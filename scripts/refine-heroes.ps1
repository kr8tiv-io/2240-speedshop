# Rebuild the three hero GLBs: Blender refinement pass, then meshopt pack.
#
#   pwsh scripts/refine-heroes.ps1
#
# Blender does the modelling craft the runtime cannot — merge doubles, shade
# smooth BY ANGLE (so curvature is continuous across a panel and a shut line
# stays sharp), subdivide only the bodywork, and bake ambient occlusion into
# vertex colours. gltfpack then quantises and entropy-codes the result.
#
# The cost is small and worth knowing: the Challenger goes 11.1k -> 29.7k
# triangles and 156 kB -> ~193 kB shipped. 2.7x the geometry plus baked
# contact shadow for +24% bytes, and NO extra HTTP request because the AO
# rides in the vertex stream rather than a texture.

$ErrorActionPreference = "Stop"
$project = Split-Path -Parent $PSScriptRoot
Set-Location $project

$blender = "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"
if (-not (Test-Path $blender)) { $blender = "C:\Program Files\Blender Foundation\Blender 5.0\blender.exe" }
if (-not (Test-Path $blender)) { throw "Blender not found - install it or adjust the path" }

$work = "C:\tmp\2240refine"
New-Item -ItemType Directory -Force $work | Out-Null

$heroes = @(
  @{ src = "car-muscle-challenger.glb";  out = "challenger.glb" },
  @{ src = "car-muscle-coupe-hoodup.glb"; out = "coupe-hoodup.glb" },
  @{ src = "car-dodge-charger.glb";       out = "charger.glb" }
)

$total = 0
foreach ($h in $heroes) {
  $src = Join-Path $project "public\models\$($h.src)"
  $mid = Join-Path $work "refined-$($h.out)"
  $dst = Join-Path $project "public\models\hero\$($h.out)"

  Write-Host "== $($h.src)"
  & $blender --background --factory-startup --python scripts/blender-refine.py -- $src $mid 2>&1 |
    Select-String -Pattern 'REFINE_RESULT|Traceback|Error:' | ForEach-Object { Write-Host "   $_" }
  if (-not (Test-Path $mid)) { throw "Blender produced nothing for $($h.src)" }

  npx --yes gltfpack@0.24 -i $mid -o $dst -cc -kn -km -ke -vp 16 -vn 12 -vt 14 -vc 8 2>&1 | Out-Null
  if (-not (Test-Path $dst)) { throw "gltfpack produced nothing for $($h.out)" }

  $kb = [int]((Get-Item $dst).Length / 1024)
  $total += $kb
  Write-Host ("   -> hero/{0}  {1} kB" -f $h.out, $kb)
}
Write-Host ("== stage total {0} kB" -f $total)
