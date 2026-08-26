# Static export -> Hostinger, via the Git-deploy repo. Combined-site edition.
#
#   pwsh scripts/deploy-combined.ps1 -Repo C:\tmp\2240deploy\daylight -Message "..."
#
# Chain: precompress (fresh byte-identical Brotli twins) -> EXPORT=1 build
# (stamps both model versions and copies the twins) -> prepare-deploy (renames the model shelves to their
# content-addressed names and prunes out/models to hero-<hash>/) -> prune the rest ->
# flatten-rsc -> mirror -> signed commit -> token push.
#
# Session workarounds baked in (2026-08-12):
#   - commit signing goes through C:\tmp\signwrap.bat (git cannot spawn
#     System32\ssh-keygen.exe directly under this harness);
#   - push uses a token-embedded URL (credential helpers die on this
#     machine's broken /bin/sh).

param(
  [Parameter(Mandatory = $true)][string]$Repo,
  [string]$Message = "Combined site: After Hours film + shop walk-through + Journal"
)

$ErrorActionPreference = "Stop"
$project = Split-Path -Parent $PSScriptRoot
Set-Location $project

Write-Host "== precompressing model transport twins"
node scripts/precompress.js
if ($LASTEXITCODE -ne 0) { throw "precompress failed" }

Write-Host "== building static export"
$env:EXPORT = "1"
# Webpack resolves next/font during the build. Honour the Windows trust store
# instead of weakening TLS when the machine sits behind an HTTPS inspector.
if ($env:NODE_OPTIONS -notmatch "(?:^|\s)--use-system-ca(?:\s|$)") {
  $env:NODE_OPTIONS = ($env:NODE_OPTIONS + " --use-system-ca").Trim()
}
pnpm exec next build --webpack
if ($LASTEXITCODE -ne 0) { throw "next build failed" }

$out = Join-Path $project "out"
if (-not (Test-Path $out)) { throw "no out/ produced" }

Write-Host "== content-addressing the model shelves"
node scripts/prepare-deploy.js
if ($LASTEXITCODE -ne 0) { throw "prepare-deploy failed" }

Write-Host "== pruning payload"
# Raw source GLBs (~140 MB) never ship; only models/hero-<hash> survives, and
# prepare-deploy has already enforced that. Belt and braces on the rest:
Get-ChildItem (Join-Path $out "models") -File -ErrorAction SilentlyContinue | Remove-Item -Force
Remove-Item (Join-Path $out "draco") -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $out "models\CREDITS.md") -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $out "shop\_orig-letterboxed") -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $out "shop\_orig-ig") -Recurse -Force -ErrorAction SilentlyContinue
# The un-stamped shelves must not ship next to the stamped ones: double weight.
if (Test-Path (Join-Path $out "models-opt")) { Remove-Item (Join-Path $out "models-opt") -Recurse -Force }
if (Test-Path (Join-Path $out "models-mobile")) { Remove-Item (Join-Path $out "models-mobile") -Recurse -Force }

node scripts/flatten-rsc.mjs $out
if ($LASTEXITCODE -ne 0) { throw "flatten-rsc failed" }

$size = (Get-ChildItem $out -Recurse -File | Measure-Object Length -Sum).Sum
Write-Host ("   export {0:N1} MB" -f ($size / 1MB))

Write-Host "== mirroring into $Repo"
$staticMarker = Join-Path $Repo ".deploy-current-static.txt"
$repoStatic = [System.IO.Path]::GetFullPath((Join-Path $Repo "_next\static"))
$repoStaticPrefix = $repoStatic.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
$overlapRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("2240-static-overlap-" + [guid]::NewGuid().ToString("N"))
$overlapResolved = [System.IO.Path]::GetFullPath($overlapRoot)
$tempPrefix = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath()).TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
if (-not $overlapResolved.StartsWith($tempPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "static overlap directory escaped the system temp directory"
}
New-Item -ItemType Directory -Path $overlapResolved -Force | Out-Null

try {
  # Hostinger/CDN propagation is not atomic at the individual object edge. A
  # fresh HTML/runtime once arrived before its matching 5963 garage chunk and
  # the real 3D tour fell back to the photograph. Preserve exactly the static
  # files referenced by ONE previous deployment so either runtime remains
  # complete throughout propagation, without accumulating every old build.
  $previousStatic = if (Test-Path -LiteralPath $staticMarker) {
    @(Get-Content -LiteralPath $staticMarker | Where-Object { $_.Trim().Length -gt 0 })
  } elseif (Test-Path -LiteralPath $repoStatic) {
    @(Get-ChildItem -LiteralPath $repoStatic -Recurse -File | ForEach-Object {
      [System.IO.Path]::GetRelativePath($Repo, $_.FullName).Replace("\", "/")
    })
  } else {
    @()
  }

  Write-Host "== preserving previous immutable static generation ($($previousStatic.Count) files)"
  foreach ($relativePath in $previousStatic) {
    $source = [System.IO.Path]::GetFullPath((Join-Path $Repo $relativePath.Replace("/", "\")))
    if (-not $source.StartsWith($repoStaticPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
      throw "static overlap marker escaped _next/static: $relativePath"
    }
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) { continue }
    $target = Join-Path $overlapResolved $relativePath.Replace("/", "\")
    New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
    Copy-Item -LiteralPath $source -Destination $target -Force
  }

  Get-ChildItem $Repo -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
  Copy-Item (Join-Path $out "*") $Repo -Recurse -Force

  if ($previousStatic.Count -gt 0) {
    Write-Host "== restoring previous immutable static generation"
    Copy-Item (Join-Path $overlapResolved "*") $Repo -Recurse -Force
  }

  $outStatic = Join-Path $out "_next\static"
  $currentStatic = @(Get-ChildItem -LiteralPath $outStatic -Recurse -File | ForEach-Object {
    [System.IO.Path]::GetRelativePath($out, $_.FullName).Replace("\", "/")
  } | Sort-Object)
  Set-Content -LiteralPath (Join-Path $Repo ".deploy-current-static.txt") -Value $currentStatic
  Set-Content (Join-Path $Repo ".gitattributes") "* -text`n*.glb binary`n*.br binary`n" -NoNewline
} finally {
  if (Test-Path -LiteralPath $overlapResolved) {
    Remove-Item -LiteralPath $overlapResolved -Recurse -Force
  }
}

Write-Host "== committing"
$noHooks = Join-Path ([System.IO.Path]::GetTempPath()) "git-nohooks"
New-Item -ItemType Directory -Force $noHooks | Out-Null
git -C $Repo config core.hooksPath $noHooks
git -C $Repo config gpg.ssh.program C:/tmp/signwrap.bat

# THE RACE: fresh files can look "racily clean" against the index (mtime
# granularity), and add -A stages nothing while reporting success.
git -C $Repo update-index --really-refresh --unmerged *> $null
git -C $Repo add -A

$dirty = @(git -C $Repo status --porcelain).Count
$staged = @(git -C $Repo diff --cached --name-only).Count
if ($staged -eq 0 -and $dirty -gt 0) {
  Write-Host "== index missed the copy (racy mtime) - refreshing and retrying"
  Start-Sleep -Seconds 2
  git -C $Repo update-index --really-refresh --unmerged *> $null
  git -C $Repo add -A
  $staged = @(git -C $Repo diff --cached --name-only).Count
}
if ($staged -eq 0) {
  if ($dirty -eq 0) { Write-Host "== nothing changed - already deployed"; exit 0 }
  throw "git add -A staged nothing while $dirty path(s) differ - refusing to report a deploy"
}
Write-Host "== $staged file(s) staged"

git -C $Repo -c user.name="Matt-Aurora-Ventures" -c user.email="lucidbloks@gmail.com" commit -m $Message
if ($LASTEXITCODE -ne 0) { throw "commit failed" }

Write-Host "== pushing"
$tok = (gh auth token).Trim()
$originUrl = (git -C $Repo remote get-url origin).Trim()
$pushUrl = $originUrl -replace "^https://github\.com/", "https://x-access-token:$tok@github.com/"
git -C $Repo push $pushUrl HEAD:main
if ($LASTEXITCODE -ne 0) { throw "push failed" }
Write-Host "== pushed - Hostinger webhook redeploys on its own"
