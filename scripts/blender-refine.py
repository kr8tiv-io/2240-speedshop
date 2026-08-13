"""
Hero-model refinement pass, run headless in Blender.

    blender --background --factory-startup --python scripts/blender-refine.py -- <in.glb> <out.glb>

WHY BLENDER AND NOT MORE RUNTIME CODE
The site already welds vertices and recomputes normals at load, but that is a
blunt instrument: it smooths EVERYTHING, including the hard creases where a
panel meets a bumper, so a door shut line goes soft. Blender can do the thing
that actually wants doing — smooth by ANGLE, so curvature is continuous across
a quarter panel and stays sharp at a crease — and it can subdivide the body
without touching the tyres.

WHAT THIS DOES, IN ORDER
  1. merge doubles          — these Poly-Pizza bodies ship split verts
  2. shade smooth by angle  — 40 degrees: curves smooth, creases stay creases
  3. subdivide bodywork     — level 1, and ONLY on the panels whose silhouette
                              the camera reads. Subdividing a wheel or an
                              interior is bytes spent where nobody looks.
  4. bake AO to vertex col  — contact darkening in the gaps, wheel wells and
                              grille recesses. Vertex colours, not a texture:
                              a few bytes per vertex and NO extra HTTP request,
                              which is the whole reason it survives the mobile
                              budget. Only worth doing after (3), because AO
                              on vertices is only as detailed as the mesh.

Everything is measured on the way out — see the JSON printed at the end.
"""

import bpy
import bmesh
import json
import sys
from pathlib import Path

ARGS = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
SRC = Path(ARGS[0])
DST = Path(ARGS[1])
# Material names whose meshes are bodywork: worth subdividing, because their
# silhouette is what the camera reads.
# PAINT ONLY, and the list is short on purpose. Including "details 1" / "details 4"
# (a guess at the coupe's primer panels) matched 11 of the Challenger's 12
# multi-material meshes and took the stage from 449 kB to 889 kB — subdividing
# interiors, cables and engine bays for a silhouette nobody reads. These four
# names are the actual painted bodywork across all three cars.
BODY_HINTS = ("body", "middle", "chasis", "atlas")

# SUBDIVISION IS OFF. It was on for three iterations and it was the wrong call.
#
# Two reasons, and the first is the one that decided it. The hero entrance is a
# WIREFRAME reveal — the car resolves out of a glowing net and the net runs
# through it. That net is drawn from this same geometry, so tripling the
# triangle count tripled the line density: side by side against the previous
# build, a legible grid over the roof and quarter panel turned into a solid
# amber glow, and the extra emissive area pushed bloom until the whole frame
# washed out. The signature effect got worse to buy model detail.
#
# The second reason is that it was not buying much. SUBSURF in SIMPLE mode
# splits each face into four COPLANAR faces — it adds resolution, not
# curvature, so the silhouette after subdividing is identical to the
# silhouette before. The only real gain was a finer vertex grid for the AO
# bake, and that is not worth 182 kB and the reveal.
#
# What survives is the part that was always the point: merge doubles, shade
# smooth by ANGLE so curvature is continuous across a panel and a crease stays
# sharp, and bake AO. Flip this back on only alongside a separate coarse cage
# mesh for the wireframe pass.
SUBDIVIDE = False

# Deliberately NOT a skip-list. The first version vetoed any mesh that also
# contained glass or rubber, and the Charger — which packs nine materials into
# five meshes — came out with zero subdivisions while the other two cars got
# six and nine. Inverting it to "anything that isn't purely glass" then
# subdivided interiors, cables and engine bays too and pushed the stage from
# 449 kB to 889 kB for geometry the camera never reads a silhouette against.
# An explicit include-list is the only version that spends the budget where
# it shows.


def is_body(obj):
    """
    A BODY hint beats a SKIP hint, and that ordering matters.

    The Charger packs nine materials into five meshes — bodywork, glass and
    tyres share a mesh — so a skip-first rule vetoed every one of them and it
    came out of the first run with zero subdivisions while the other two cars
    got six and nine. On a multi-material mesh the presence of bodywork is the
    signal; skip only decides meshes that are ONLY glass or rubber.
    """
    names = [(s.material.name or "").lower() for s in obj.material_slots if s.material]
    return any(any(h in n for h in BODY_HINTS) for n in names)


def tri_count():
    total = 0
    for o in bpy.data.objects:
        if o.type != "MESH":
            continue
        me = o.data
        me.calc_loop_triangles()
        total += len(me.loop_triangles)
    return total


bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(SRC))

meshes = [o for o in bpy.data.objects if o.type == "MESH"]
before = tri_count()
subdivided = 0

for obj in meshes:
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

    # 1. merge doubles — split verts are why the runtime weld existed at all
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
    bm.to_mesh(obj.data)
    obj.data.update()
    bm.free()

    # 2. smooth by ANGLE, so a quarter panel is continuous and a shut line is not
    bpy.ops.object.shade_smooth_by_angle(angle=0.698132)  # 40 degrees

    # 3. SUBDIVISION IS OFF, and that is a considered decision — see below.
    if SUBDIVIDE and is_body(obj):
        mod = obj.modifiers.new(name="Subdiv", type="SUBSURF")
        mod.levels = 1
        mod.render_levels = 1
        # Simple (not Catmull-Clark) keeps the designed form and just adds
        # resolution; Catmull-Clark on a low-poly car shrinks and rounds it
        # into a bar of soap.
        mod.subdivision_type = "SIMPLE"
        bpy.ops.object.modifier_apply(modifier=mod.name)
        subdivided += 1

after_subdiv = tri_count()

# 4. AO to vertex colours
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = 24
scene.render.bake.target = "VERTEX_COLORS"
scene.render.bake.use_pass_direct = False
scene.render.bake.use_pass_indirect = False
scene.render.bake.margin = 0

baked = 0
failed = []
for obj in meshes:
    me = obj.data
    if not me.color_attributes:
        me.color_attributes.new(name="AO", type="BYTE_COLOR", domain="CORNER")
    me.color_attributes.active_color_index = me.color_attributes.find("AO")
    me.color_attributes.render_color_index = me.color_attributes.find("AO")
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    try:
        bpy.ops.object.bake(type="AO")
        baked += 1
    except Exception as exc:  # noqa: BLE001 - report, do not abort the batch
        failed.append(f"{obj.name}: {exc}")

# 4b. Lift the AO off the floor.
# A raw bake ran min 0.0 / mean 0.67 — a straight multiply would take a third
# of the brightness off the WHOLE car, which is the opposite of the brief on
# the daylight build. Remap to [AO_FLOOR, 1]: cavities still read, open
# surfaces are untouched. Done here rather than in a shader so the runtime
# stays a plain `vertexColors: true` multiply with nothing to keep in sync.
AO_FLOOR = 0.5
for obj in meshes:
    attr = obj.data.color_attributes.get("AO")
    if not attr:
        continue
    for datum in attr.data:
        c = datum.color
        datum.color = (
            AO_FLOOR + (1.0 - AO_FLOOR) * c[0],
            AO_FLOOR + (1.0 - AO_FLOOR) * c[1],
            AO_FLOOR + (1.0 - AO_FLOOR) * c[2],
            1.0,
        )

DST.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=str(DST),
    export_format="GLB",
    export_apply=True,
    # Blender 5.x renamed these: `export_colors` is gone. MATERIAL alone only
    # emits vertex colours where a material reads them, and these materials do
    # not — so force ALL colour layers out, which is where the baked AO lives.
    export_vertex_color="ACTIVE",
    export_all_vertex_colors=True,
    export_active_vertex_color_when_no_material=True,
    export_normals=True,
    export_yup=True,
    export_draco_mesh_compression_enable=False,  # gltfpack/meshopt handles this
)

print(
    "REFINE_RESULT "
    + json.dumps(
        {
            "src": SRC.name,
            "meshes": len(meshes),
            "tris_before": before,
            "tris_after": after_subdiv,
            "subdivided": subdivided,
            "ao_baked": baked,
            "ao_failed": failed[:3],
            "out_kb": round(DST.stat().st_size / 1024) if DST.exists() else 0,
        }
    )
)
