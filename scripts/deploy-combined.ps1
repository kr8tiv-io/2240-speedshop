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
  [string]$Message = "Combined site: After Hours film + shop walk-through + Journal",
  [string]$LiveUrl = "https://2240speedshop.com",
  [switch]$PrepareOnly
)

$ErrorActionPreference = "Stop"
$project = Split-Path -Parent $PSScriptRoot
Set-Location $project
$project = [System.IO.Path]::GetFullPath($project)
$out = [System.IO.Path]::GetFullPath((Join-Path $project "out"))
$Repo = [System.IO.Path]::GetFullPath($Repo).TrimEnd('\', '/')
if ($PrepareOnly -and $Repo -ne 'C:\tmp\2240deploy\daylight') {
  throw "PrepareOnly is restricted to the verified 2240 deployment checkout"
}
if (-not (Test-Path -LiteralPath (Join-Path $Repo ".git"))) {
  throw "deployment target must be an existing Git checkout"
}
if ($Repo -eq $project -or $Repo -eq $out -or $Repo -eq [System.IO.Path]::GetPathRoot($Repo)) {
  throw "deployment target is not a dedicated deployment checkout"
}

function Assert-NoReparsePoints {
  param([Parameter(Mandatory = $true)][string]$Root)
  if (-not (Test-Path -LiteralPath $Root)) { return }
  $items = @(Get-Item -LiteralPath $Root -Force) + @(Get-ChildItem -LiteralPath $Root -Recurse -Force)
  if ($items | Where-Object { $_.Attributes -band [System.IO.FileAttributes]::ReparsePoint } | Select-Object -First 1) {
    throw "refusing filesystem mutation through a link or junction under $Root"
  }
}

function Remove-ExportPath {
  param([Parameter(Mandatory = $true)][string]$RelativePath)
  $target = [System.IO.Path]::GetFullPath((Join-Path $out $RelativePath))
  if (-not $target.StartsWith($out + '\', [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "prune target escaped the export: $RelativePath"
  }
  if (Test-Path -LiteralPath $target) {
    Assert-NoReparsePoints -Root $target
    Remove-Item -LiteralPath $target -Recurse -Force
  }
}

Assert-NoReparsePoints -Root $out
Assert-NoReparsePoints -Root $Repo

function Wait-ForPublishedRelease {
  param(
    [Parameter(Mandatory = $true)][string]$BaseUrl,
    [Parameter(Mandatory = $true)][string]$Expected,
    [int]$TimeoutSeconds = 300
  )

  $deadline = [DateTime]::UtcNow.AddSeconds($TimeoutSeconds)
  $markerUrl = $BaseUrl.TrimEnd("/") + "/.well-known/2240-release.txt?release=" + $Expected
  do {
    try {
      $response = Invoke-WebRequest `
        -Uri $markerUrl `
        -Headers @{ "Cache-Control" = "no-cache" } `
        -TimeoutSec 15 `
        -UseBasicParsing
      if ($response.StatusCode -eq 200 -and $response.Content.Trim() -eq $Expected) {
        Write-Host "== Hostinger published release $Expected"
        return
      }
    } catch {
      # The webhook deploy is asynchronous. Network/404 responses are expected
      # until the new tree becomes active; the bounded deadline owns failure.
    }
    Start-Sleep -Seconds 5
  } while ([DateTime]::UtcNow -lt $deadline)

  throw "Hostinger did not publish release $Expected within $TimeoutSeconds seconds"
}

function Add-ReleaseStamp {
  param(
    [Parameter(Mandatory = $true)][string]$Root,
    [Parameter(Mandatory = $true)][string]$Release
  )

  $stamp = '<meta name="2240-release" content="' + $Release + '">'
  $htmlFiles = @(Get-ChildItem -LiteralPath $Root -Recurse -File -Filter "*.html")
  if ($htmlFiles.Count -eq 0) { throw "no HTML files available for release stamping" }
  $utf8 = [System.Text.UTF8Encoding]::new($false)
  foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    if (-not $content.Contains("</head>")) { throw "HTML release stamp has no head in $($file.FullName)" }
    [System.IO.File]::WriteAllText(
      $file.FullName,
      $content.Replace("</head>", $stamp + "</head>"),
      $utf8
    )
  }
}

function Wait-ForLiveHtmlRelease {
  param(
    [Parameter(Mandatory = $true)][string]$BaseUrl,
    [Parameter(Mandatory = $true)][string]$Expected,
    [int]$TimeoutSeconds = 180
  )

  $deadline = [DateTime]::UtcNow.AddSeconds($TimeoutSeconds)
  $rootUrl = $BaseUrl.TrimEnd("/") + "/"
  $expectedStamp = '<meta name="2240-release" content="' + $Expected + '">'
  do {
    try {
      $response = Invoke-WebRequest `
        -Uri $rootUrl `
        -Headers @{ "Cache-Control" = "no-cache"; "Pragma" = "no-cache" } `
        -TimeoutSec 15 `
        -UseBasicParsing
      if ($response.StatusCode -eq 200 -and $response.Content.Contains($expectedStamp)) {
        Write-Host "== live root HTML is exact release $Expected"
        return
      }
    } catch {
      # An edge may still be replacing its shared HTML generation.
    }
    Start-Sleep -Seconds 5
  } while ([DateTime]::UtcNow -lt $deadline)

  throw "Hostinger root HTML did not reach release $Expected within $TimeoutSeconds seconds"
}

function Assert-LiveReleaseAssets {
  param(
    [Parameter(Mandatory = $true)][string]$BaseUrl,
    [Parameter(Mandatory = $true)][string[]]$RelativePaths,
    [int]$TimeoutSeconds = 120
  )

  foreach ($relativePath in $RelativePaths) {
    $assetUrl = $BaseUrl.TrimEnd("/") + "/" + $relativePath.TrimStart("/")
    $deadline = [DateTime]::UtcNow.AddSeconds($TimeoutSeconds)
    $published = $false
    do {
      try {
        $response = Invoke-WebRequest `
          -Uri $assetUrl `
          -Method Head `
          -Headers @{ "Cache-Control" = "no-cache" } `
          -TimeoutSec 15 `
          -UseBasicParsing
        if ($response.StatusCode -eq 200) { $published = $true; break }
      } catch {
        # Immutable assets can propagate just after the stamped HTML.
      }
      Start-Sleep -Seconds 4
    } while ([DateTime]::UtcNow -lt $deadline)
    if (-not $published) { throw "critical release asset is not live: $relativePath" }
    Write-Host "   live asset $relativePath"
  }
}

Write-Host "== precompressing model transport twins"
node scripts/precompress.js
if ($LASTEXITCODE -ne 0) { throw "precompress failed" }

Write-Host "== building static export"
$env:EXPORT = "1"
Remove-Item Env:HOSTINGER_PREVIEW -ErrorAction SilentlyContinue
Remove-Item Env:BASEPATH -ErrorAction SilentlyContinue
# Webpack resolves next/font during the build. Honour the Windows trust store
# instead of weakening TLS when the machine sits behind an HTTPS inspector.
if ($env:NODE_OPTIONS -notmatch "(?:^|\s)--use-system-ca(?:\s|$)") {
  $env:NODE_OPTIONS = ($env:NODE_OPTIONS + " --use-system-ca").Trim()
}
node --use-system-ca node_modules/next/dist/bin/next build --webpack
if ($LASTEXITCODE -ne 0) { throw "next build failed" }

if (-not (Test-Path $out)) { throw "no out/ produced" }
Assert-NoReparsePoints -Root $out

Write-Host "== content-addressing the model shelves"
node scripts/prepare-deploy.js
if ($LASTEXITCODE -ne 0) { throw "prepare-deploy failed" }

Write-Host "== pruning payload"
# Raw source GLBs (~140 MB) never ship; only models/hero-<hash> survives, and
# prepare-deploy has already enforced that. Belt and braces on the rest:
foreach ($file in @(Get-ChildItem -LiteralPath (Join-Path $out "models") -File -ErrorAction SilentlyContinue)) {
  Remove-ExportPath -RelativePath ("models\" + $file.Name)
}
foreach ($relative in @("draco", "models\CREDITS.md", "shop\_orig-letterboxed", "shop\_orig-ig")) {
  Remove-ExportPath -RelativePath $relative
}
# The un-stamped shelves must not ship next to the stamped ones: double weight.
Remove-ExportPath -RelativePath "models-opt"
Remove-ExportPath -RelativePath "models-mobile"

node scripts/flatten-rsc.mjs $out
if ($LASTEXITCODE -ne 0) { throw "flatten-rsc failed" }

# A unique, uncacheable marker proves which export Hostinger is actually
# serving. Purging before this marker changes races the asynchronous webhook:
# the old deployment can refill a freshly emptied edge cache.
$releaseId = [guid]::NewGuid().ToString("N")
$releaseDirectory = Join-Path $out ".well-known"
New-Item -ItemType Directory -Path $releaseDirectory -Force | Out-Null
Set-Content -LiteralPath (Join-Path $releaseDirectory "2240-release.txt") -Value $releaseId -NoNewline
Add-ReleaseStamp -Root $out -Release $releaseId

# Verify the exact runtime, lossless desktop/mobile model shelves, and hero
# model generation that this HTML references. These paths are captured before
# mirroring so post-purge verification cannot accidentally validate an old tree.
$criticalAssets = @()
$indexHtml = [System.IO.File]::ReadAllText((Join-Path $out "index.html"))
$runtimeAssets = @([regex]::Matches($indexHtml, '(?:src|href)="(/_next/static/[^"?]+\.(?:js|css))') | ForEach-Object {
  $_.Groups[1].Value.TrimStart("/")
} | Select-Object -Unique)
$criticalAssets += $runtimeAssets
$garageChunk = Get-ChildItem -LiteralPath (Join-Path $out "_next\static\chunks") -Recurse -File -Filter "*.js" | Where-Object {
  $source = [System.IO.File]::ReadAllText($_.FullName)
  $source.Contains("data-shop-world") -or ($source.Contains("models-opt-") -and $source.Contains("models-mobile-"))
} | Select-Object -First 1
if (-not $garageChunk) { throw "could not discover the exported ShopWorld garage chunk" }
$criticalAssets += [System.IO.Path]::GetRelativePath($out, $garageChunk.FullName).Replace("\", "/")
$criticalAssets = @($criticalAssets | Select-Object -Unique)
foreach ($shelfPattern in @("models-opt-*", "models-mobile-*")) {
  $shelf = Get-ChildItem -LiteralPath $out -Directory -Filter $shelfPattern | Select-Object -First 1
  if (-not $shelf) { throw "missing release shelf $shelfPattern" }
  $candidate = Join-Path $shelf.FullName "car-dodge-charger.glb.br"
  if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
    $candidate = Join-Path $shelf.FullName "car-dodge-charger.glb"
  }
  if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) { throw "missing critical Charger in $($shelf.Name)" }
  $criticalAssets += [System.IO.Path]::GetRelativePath($out, $candidate).Replace("\", "/")
}
$heroShelf = Get-ChildItem -LiteralPath (Join-Path $out "models") -Directory -Filter "hero-*" | Select-Object -First 1
if (-not $heroShelf) { throw "missing content-addressed hero shelf" }
$heroAsset = Get-ChildItem -LiteralPath $heroShelf.FullName -File | Where-Object {
  $_.Name -match '\.glb(?:\.br)?$'
} | Sort-Object { if ($_.Name.EndsWith(".br")) { 0 } else { 1 } } | Select-Object -First 1
if (-not $heroAsset) { throw "missing critical hero model" }
$criticalAssets += [System.IO.Path]::GetRelativePath($out, $heroAsset.FullName).Replace("\", "/")
if ($criticalAssets.Count -lt 4) { throw "release verification did not capture enough critical assets" }

$size = (Get-ChildItem $out -Recurse -File | Measure-Object Length -Sum).Sum
Write-Host ("   export {0:N1} MB" -f ($size / 1MB))

Write-Host "== mirroring into $Repo"
$staticMarker = Join-Path $Repo ".deploy-current-static.txt"
$shelfMarker = Join-Path $Repo ".deploy-current-shelves.txt"
$repoStatic = [System.IO.Path]::GetFullPath((Join-Path $Repo "_next\static"))
$repoRoot = [System.IO.Path]::GetFullPath($Repo)
$repoRootPrefix = $repoRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
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

  $previousShelves = if (Test-Path -LiteralPath $shelfMarker) {
    @(Get-Content -LiteralPath $shelfMarker | Where-Object { $_.Trim().Length -gt 0 })
  } else {
    $roots = @(
      Get-ChildItem -LiteralPath $Repo -Directory -ErrorAction SilentlyContinue | Where-Object {
        $_.Name -match '^models-(?:opt|mobile)-'
      }
      Get-ChildItem -LiteralPath (Join-Path $Repo "models") -Directory -Filter "hero-*" -ErrorAction SilentlyContinue
    )
    @($roots | ForEach-Object {
      Get-ChildItem -LiteralPath $_.FullName -Recurse -File | ForEach-Object {
        [System.IO.Path]::GetRelativePath($Repo, $_.FullName).Replace("\", "/")
      }
    })
  }
  # A previously prepared but uncommitted checkout may have newer markers
  # than the published Git tree. Keep that committed generation too.
  foreach ($manifest in @(".deploy-current-static.txt", ".deploy-current-shelves.txt")) {
    $committedPaths = @(git -C $Repo show "HEAD:$manifest" 2>$null)
    if ($LASTEXITCODE -ne 0) { throw "could not read the prior committed immutable manifest: $manifest" }
    if ($manifest -eq ".deploy-current-static.txt") {
      $previousStatic += @($committedPaths | Where-Object { $_.Trim().Length -gt 0 })
    } else {
      $previousShelves += @($committedPaths | Where-Object { $_.Trim().Length -gt 0 })
    }
  }
  $previousImmutable = @($previousStatic + $previousShelves | Sort-Object -Unique)

  Write-Host "== preserving previous immutable runtime/model generation ($($previousImmutable.Count) files)"
  foreach ($relativePath in $previousImmutable) {
    $normalized = $relativePath.Replace("\", "/")
    $allowedImmutable =
      $normalized.StartsWith("_next/static/", [System.StringComparison]::OrdinalIgnoreCase) -or
      $normalized -match '^(?:models-(?:opt|mobile)-[^/]+|models/hero-[^/]+)/'
    if (-not $allowedImmutable) { throw "immutable overlap marker escaped allowed shelves: $relativePath" }
    $source = [System.IO.Path]::GetFullPath((Join-Path $Repo $relativePath.Replace("/", "\")))
    if (-not $source.StartsWith($repoRootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
      throw "immutable overlap marker escaped deployment repo: $relativePath"
    }
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) { continue }
    $target = Join-Path $overlapResolved $relativePath.Replace("/", "\")
    New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
    Copy-Item -LiteralPath $source -Destination $target -Force
  }

  Assert-NoReparsePoints -Root $Repo
  if (-not (Test-Path -LiteralPath (Join-Path $Repo ".git"))) { throw "deployment checkout lost its Git metadata" }
  foreach ($item in @(Get-ChildItem -LiteralPath $Repo -Force | Where-Object { $_.Name -ne ".git" })) {
    $target = [System.IO.Path]::GetFullPath($item.FullName)
    if (-not $target.StartsWith($repoRootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
      throw "mirror delete escaped the deployment checkout"
    }
    Remove-Item -LiteralPath $target -Recurse -Force
  }
  foreach ($item in @(Get-ChildItem -LiteralPath $out -Force)) {
    Copy-Item -LiteralPath $item.FullName -Destination $Repo -Recurse -Force
  }

  if ($previousImmutable.Count -gt 0) {
    Write-Host "== restoring previous immutable runtime/model generation"
    foreach ($relativePath in $previousImmutable) {
      $source = Join-Path $overlapResolved $relativePath.Replace("/", "\")
      if (-not (Test-Path -LiteralPath $source -PathType Leaf)) { continue }
      $target = Join-Path $Repo $relativePath.Replace("/", "\")
      # Current output always wins a same-path collision. This matters when a
      # newer Brotli encoder improves the twin without changing raw GLB bytes.
      if (Test-Path -LiteralPath $target) { continue }
      New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
      Copy-Item -LiteralPath $source -Destination $target -Force
    }
  }

  $outStatic = Join-Path $out "_next\static"
  $currentStatic = @(Get-ChildItem -LiteralPath $outStatic -Recurse -File | ForEach-Object {
    [System.IO.Path]::GetRelativePath($out, $_.FullName).Replace("\", "/")
  } | Sort-Object)
  Set-Content -LiteralPath (Join-Path $Repo ".deploy-current-static.txt") -Value $currentStatic
  $currentShelfRoots = @(
    Get-ChildItem -LiteralPath $out -Directory | Where-Object { $_.Name -match '^models-(?:opt|mobile)-' }
    Get-ChildItem -LiteralPath (Join-Path $out "models") -Directory -Filter "hero-*" -ErrorAction SilentlyContinue
  )
  $currentShelves = @($currentShelfRoots | ForEach-Object {
    Get-ChildItem -LiteralPath $_.FullName -Recurse -File | ForEach-Object {
      [System.IO.Path]::GetRelativePath($out, $_.FullName).Replace("\", "/")
    }
  } | Sort-Object)
  Set-Content -LiteralPath (Join-Path $Repo ".deploy-current-shelves.txt") -Value $currentShelves
  Set-Content (Join-Path $Repo ".gitattributes") "* -text`n*.glb binary`n*.br binary`n" -NoNewline
} finally {
  if (Test-Path -LiteralPath $overlapResolved) {
    Remove-Item -LiteralPath $overlapResolved -Recurse -Force
  }
}

if ($PrepareOnly) {
  $reportDirectory = Join-Path $project "output"
  New-Item -ItemType Directory -Path $reportDirectory -Force | Out-Null
  [ordered]@{
    releaseId = $releaseId
    preparedAt = [DateTime]::UtcNow.ToString("o")
    deploymentCheckout = $Repo
    exportRoot = $out
    exportBytes = $size
    preservedImmutableFiles = $previousImmutable.Count
    criticalAssets = $criticalAssets
    published = $false
  } | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $reportDirectory "release-prepared.json")
  Write-Host "== prepared release $releaseId in $Repo; no Git mutation or publish performed"
  return
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

Write-Host "== waiting for the new Hostinger release before cache purge"
Wait-ForPublishedRelease -BaseUrl $LiveUrl -Expected $releaseId

# When API credentials exist, cache purge is mandatory and a skip is failure.
# On a workstation without them, the exact queryless HTML and critical-asset
# checks below remain the deployment gate rather than reporting a false purge.
$purgeVariables = @("HOSTINGER_API_TOKEN", "HOSTINGER_USERNAME", "HOSTINGER_DOMAIN")
$purgeConfigured = @($purgeVariables | Where-Object {
  -not (Get-Item -Path ("Env:" + $_) -ErrorAction SilentlyContinue).Value
}).Count -eq 0
if ($purgeConfigured) {
  Write-Host "== requesting required Hostinger server and CDN cache purge"
  node scripts/purge-hostinger-cache.mjs --required
  if ($LASTEXITCODE -ne 0) { throw "Hostinger cache purge was required but not accepted" }
} else {
  Write-Warning "Hostinger API credentials are unavailable; exact live release verification is required"
}

Write-Host "== verifying exact root HTML and critical assets after cache handling"
Wait-ForPublishedRelease -BaseUrl $LiveUrl -Expected $releaseId -TimeoutSeconds 90
Wait-ForLiveHtmlRelease -BaseUrl $LiveUrl -Expected $releaseId
Assert-LiveReleaseAssets -BaseUrl $LiveUrl -RelativePaths $criticalAssets
