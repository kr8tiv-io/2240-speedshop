# THE MOBILE GUARDRAIL — run this before any refined shelf is deployed.
#
#   pwsh scripts/guardrail.ps1                    # gate against the committed baseline
#   pwsh scripts/guardrail.ps1 -WriteBaseline     # capture a new baseline (quiescent tree only)
#
# Every number below was measured, not assumed. The baseline in scripts/baselines
# is the DEPLOYED state: mobile shelf 10,312,816 B on disk, 5,290,289 B on the
# wire — the 5.05 MB the live site is known to fetch.
param([switch]$WriteBaseline)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot
$fail = @()

function Step($name) { Write-Host "`n── $name " -NoNewline; Write-Host ("─" * [Math]::Max(0, 60 - $name.Length)) }

# 1 ── The brotli twins must match the models they sit next to.
#      The loader asks for "<model>.glb.br" BY NAME and only falls back to the
#      plain file if that REQUEST FAILS. A stale-but-valid twin succeeds, so a
#      regenerated shelf with an old twin silently serves the OLD model and
#      every refinement is invisible. This is not theoretical — it is the state
#      the tree was in on 2026-08-09 after a pipeline run without precompress.
Step "brotli twins match their models"
foreach ($shelf in @("models-opt", "models-mobile")) {
  $dir = Join-Path $repo "public\$shelf"
  if (-not (Test-Path $dir)) { continue }
  $bad = 0; $n = 0
  foreach ($glb in Get-ChildItem $dir -Filter *.glb) {
    $n++
    $br = "$($glb.FullName).br"
    if (-not (Test-Path $br)) { $bad++; continue }
    $raw = [IO.File]::ReadAllBytes($glb.FullName)
    $in = [IO.File]::OpenRead($br)
    $ms = New-Object IO.MemoryStream
    try {
      $bs = New-Object IO.Compression.BrotliStream($in, [IO.Compression.CompressionMode]::Decompress)
      $bs.CopyTo($ms); $bs.Dispose()
    } catch { $bad++; $in.Dispose(); continue }
    $in.Dispose()
    if ($ms.Length -ne $raw.Length) { $bad++ }
    $ms.Dispose()
  }
  if ($bad -gt 0) { $fail += ("{0} : {1}/{2} stale or broken .br twins — run: node scripts/precompress.js" -f $shelf, $bad, $n); Write-Host "  FAIL $shelf $bad/$n stale" -ForegroundColor Red }
  else { Write-Host "  ok   $shelf $n/$n fresh" -ForegroundColor Green }
}

# 2 ── Nothing may ride into the export that the site does not fetch.
#      prepare-deploy.js drops out/models and NOTHING ELSE, so any other folder
#      under public/ ships in full. On 2026-08-09 public/models-refined held
#      148.84 MB of authoring assets that would have gone out with the site.
Step "no stray shelves under public/"
$allowed = @("models", "models-opt", "models-mobile", "shop")
$drop = (Get-Content (Join-Path $repo "scripts\prepare-deploy.js") -Raw | Select-String 'const DROP = \[(.*?)\]').Matches.Groups[1].Value
foreach ($d in Get-ChildItem (Join-Path $repo "public") -Directory) {
  if ($allowed -contains $d.Name) { continue }
  $mb = [math]::Round(((Get-ChildItem $d.FullName -Recurse -File | Measure-Object Length -Sum).Sum / 1MB), 2)
  if ($drop -notmatch "`"$($d.Name)`"") {
    $fail += "public/$($d.Name) is $mb MB and prepare-deploy.js DROP=[$drop] will not remove it — it would ship"
    Write-Host "  FAIL public/$($d.Name) $mb MB would ship (DROP=[$drop])" -ForegroundColor Red
  }
}
if ($fail.Count -eq 0) { Write-Host "  ok   only the four expected folders" -ForegroundColor Green }

# 3 ── Every model must PARSE through the real three GLTFLoader in a real
#      browser. A GLB that writes clean and throws on load is this project's
#      known failure mode and no byte count catches it.
Step "every model loads (real Chrome, real GLTFLoader)"
$base = Join-Path $repo "scripts\baselines\models-mobile.json"
$nodeArgs = @("scripts/verify-models.js", "--shelf", "models-mobile", "--repeat", "5")
if ($WriteBaseline) { $nodeArgs += @("--write-baseline", $base) } elseif (Test-Path $base) { $nodeArgs += @("--baseline", $base) }
Push-Location $repo
& node @nodeArgs
$verify = $LASTEXITCODE
Pop-Location
if ($verify -ne 0) { $fail += "scripts/verify-models.js failed (exit $verify)" }

# ── Verdict ────────────────────────────────────────────────────────────────
Write-Host ""
if ($fail.Count) {
  Write-Host "GUARDRAIL FAIL" -ForegroundColor Red
  $fail | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
  exit 1
}
Write-Host "GUARDRAIL PASS — safe to deploy" -ForegroundColor Green
exit 0
