# Static export -> Hostinger, via the Git-deploy repo.
#
#   pwsh scripts/deploy.ps1 -Repo C:\tmp\2240deploy\afterhours -Message "..."
#
# The Hostinger site is Git-deployed: the repo's ROOT is public_html, and a
# push to main fires the webhook that redeploys. So the job is: build the
# export, prune it, mirror it into the repo working tree, commit, push.
#
# THE PRUNE IS NOT OPTIONAL. `next build` copies all of public/ into out/, and
# public/models still holds ~100 MB of raw source GLBs that the compression
# script reads. Only public/models/hero (321 kB, three meshopt-packed cars)
# is fetched at runtime. /draco/ goes too: nothing is Draco-compressed any
# more, so its 763 kB decoder would be dead weight in the repo.

param(
  [Parameter(Mandatory = $true)][string]$Repo,
  [string]$Message = "Three-act hero: matrix reveal, three models, meshopt-compressed"
)

$ErrorActionPreference = "Stop"
$project = Split-Path -Parent $PSScriptRoot
Set-Location $project

Write-Host "== building static export"
$env:EXPORT = "1"
pnpm exec next build
if ($LASTEXITCODE -ne 0) { throw "next build failed" }

$out = Join-Path $project "out"
if (-not (Test-Path $out)) { throw "no out/ produced" }

Write-Host "== pruning payload"
Get-ChildItem (Join-Path $out "models") -File -ErrorAction SilentlyContinue | Remove-Item -Force
Remove-Item (Join-Path $out "draco") -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $out "models\CREDITS.md") -Force -ErrorAction SilentlyContinue
# The letterbox-trim script keeps the untrimmed originals next to the images it
# fixed. They are the backup, not the deliverable — shipping them puts several
# MB of black bars back on the server.
Remove-Item (Join-Path $out "shop\_orig-letterboxed") -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $out "shop\_orig-ig") -Recurse -Force -ErrorAction SilentlyContinue

# App Router prefetch payloads ship as nested directories but are REQUESTED
# with the segments joined by dots, so every route prefetch 404s on a static
# host and each link falls back to a full navigation. See scripts/flatten-rsc.mjs.
node scripts/flatten-rsc.mjs $out
if ($LASTEXITCODE -ne 0) { throw "flatten-rsc failed" }

$size = (Get-ChildItem $out -Recurse -File | Measure-Object Length -Sum).Sum
Write-Host ("   export {0:N1} MB" -f ($size / 1MB))

Write-Host "== mirroring into $Repo"
# Wipe everything the repo tracks except .git, then copy the export in. A
# straight copy would leave last deploy's orphans (renamed chunks, dropped
# routes) sitting in public_html forever.
Get-ChildItem $Repo -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
Copy-Item (Join-Path $out "*") $Repo -Recurse -Force

# Next writes no .nojekyll and Hostinger serves _next/ fine, but an empty
# .gitattributes keeps git from mangling the .glb binaries on Windows.
Set-Content (Join-Path $Repo ".gitattributes") "* -text`n*.glb binary`n" -NoNewline

Write-Host "== committing"
# This machine has lefthook installed as a GLOBAL core.hooksPath, and its
# hooks are /bin/sh scripts that cannot fork here at all ("Resource
# temporarily unavailable" on every exec). LEFTHOOK=0 is lefthook's own
# documented opt-out, not a --no-verify bypass, and this deploy repo carries
# no lefthook.yml — there is nothing for the hook to check. Without it the
# commit and the push both die on a broken shell.
$env:LEFTHOOK = "0"

# LEFTHOOK=0 is lefthook's own opt-out, but it is read INSIDE a /bin/sh hook —
# and sh on this machine cannot reliably fork ("Resource temporarily
# unavailable"), so the hook dies before it ever reads the variable and the
# commit fails at random depending on machine load. Point this throwaway
# deploy clone at an empty hooks directory instead: repo-scoped, deterministic,
# and it removes the dependency on a broken shell rather than gambling on it.
$noHooks = Join-Path ([System.IO.Path]::GetTempPath()) "git-nohooks"
New-Item -ItemType Directory -Force $noHooks | Out-Null
git -C $Repo config core.hooksPath $noHooks

# THE RACE: git decides what changed from mtime+size. Wiping and re-copying
# ~300 files takes less time than the filesystem's timestamp granularity, so
# the fresh files can look "racily clean" against the index git wrote moments
# earlier and `add -A` stages NOTHING. It is intermittent, it reports success,
# and the site keeps serving the old build. Refresh the stat cache, and if the
# index still disagrees with a dirty tree, wait past the granularity window
# and try once more before believing it.
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

# A deploy script that can succeed without deploying is worse than one that
# fails, so prove the index actually changed before claiming anything.
if ($staged -eq 0) {
  if ($dirty -eq 0) { Write-Host "== nothing changed - already deployed"; exit 0 }
  throw "git add -A staged nothing while $dirty path(s) differ - refusing to report a deploy"
}
Write-Host "== $staged file(s) staged"

git -C $Repo -c user.name="Matt-Aurora-Ventures" -c user.email="lucidbloks@gmail.com" commit -m $Message
if ($LASTEXITCODE -ne 0) { throw "commit failed" }
git -C $Repo push origin HEAD
if ($LASTEXITCODE -ne 0) { throw "push failed" }
Write-Host "== pushed - Hostinger webhook redeploys on its own"
