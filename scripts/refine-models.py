# Geometry refinement pass — run by Blender, headless.
#
#   blender --background --python scripts/refine-models.py -- <in_dir> <out_dir> [name ...]
#
# WHAT IS WRONG WITH THE MODELS
#
# Measured across the vehicles: 55-84% of polygons are flat-shaded, and the
# vertex:triangle ratio sits near 2:1. A welded, smooth-shaded mesh runs about
# 0.5-0.7. Two verts per triangle means the vertices are SPLIT — the facets are
# baked into the NORMAL accessor of the glTF itself. That is why setting
# `material.flatShading = false` at runtime changes nothing: three is being handed
# faceted normals and is faithfully drawing them. The Charger carried 17,316
# vertices for 9,648 triangles.
#
# WHAT THIS DOES, AND WHY IN THIS ORDER
#
#   1. Clear custom split normals. The glTF importer turns the file's NORMAL
#      accessor into custom split normals, and those OVERRIDE anything computed
#      later — shade_smooth on top of them is a no-op. They have to go first.
#      (`use_auto_smooth` was removed in Blender 4.1; 5.x wants
#      `customdata_custom_splitnormals_clear` + `shade_smooth_by_angle`.)
#   2. Weld. Coincident vertices left over from the split collapse back into one.
#   3. Recalculate outside, so the welded shell has consistent winding.
#   4. Smooth by 30 degrees. Anything sharper than that stays sharp, so a crate
#      stays a crate and a body panel stops being a diamond pattern.
#   5. Mark material boundaries sharp. A seam between two materials is a real
#      edge of the object — a window into a roof, a bumper against a wing.
#      Smoothing across it bevels away the very line that says these are
#      different parts. At 35 degrees without this, the Charger's windscreen
#      melted into the cowl.
#
# WELDING IS SKIPPED ON ANYTHING ACTUALLY TEXTURED. Merging by distance
# collapses vertices sitting on opposite sides of a UV seam into one, which
# tears the texture across the seam. Textured props therefore get steps 1, 3, 4
# and 5 and keep their vertex count — and they lose nothing by it, because the
# glTF exporter re-splits at UV seams on the way out regardless.
#
# The test is whether a material SAMPLES a texture, not whether a UV layer
# exists. Every car here ships UVs that no material reads: the bodies are
# flat-colour, `tex: []` on all thirteen slots. Guarding on the UV layer alone
# refused to weld the Camaro and the Challenger — 9,072 verts for 4,548 tris and
# 21,880 for 11,107, both a hair under the 2:1 that means fully split — to
# protect coordinates nothing was reading. The compress pass prunes those UVs
# minutes later as unused, which is the same conclusion by a different route.
#
# EVERY MODEL IS CHECKED FOR DAMAGE, because this pipeline has already shipped a
# file that wrote successfully and threw on load. A refusal here is a model
# copied through untouched, never a model half-processed.

import bpy
import bmesh
import json
import math
import os
import sys
from mathutils import Vector

# Weld distance in WORLD units — about 0.4 mm on a 6.5 m car.
#
# It has to be converted into each object's own local space before use, because
# these models are authored at wildly different scales: the Charger sits at
# world scale 1 with a body 0.87 units across, while the Camaro, Challenger and
# Coupe are at scale 100 (and parts of them at 122.7 and 44.8) with meshes a
# hundredth the size. A flat local threshold is 0.05% of the Charger's body and
# 2.9% of the Camaro's spoiler — the same number, doing nothing to one model and
# dissolving another. The damage check caught all three before they shipped:
# the Camaro lost 45% of its triangles, the Coupe 37%, the Challenger 10%.
WELD_WORLD = 0.0004
SMOOTH_ANGLE = 30.0    # degrees
MAX_TRI_LOSS = 0.005   # 0.5% — the weld legitimately drops a few degenerates
MAX_BBOX_DRIFT = 0.002 # 0.2% of the largest dimension


def measure():
    verts = tris = 0
    lo = Vector((1e18, 1e18, 1e18))
    hi = Vector((-1e18, -1e18, -1e18))
    for ob in bpy.data.objects:
        if ob.type != "MESH":
            continue
        me = ob.data
        verts += len(me.vertices)
        me.calc_loop_triangles()
        tris += len(me.loop_triangles)
        for corner in ob.bound_box:
            w = ob.matrix_world @ Vector(corner)
            for i in range(3):
                lo[i] = min(lo[i], w[i])
                hi[i] = max(hi[i], w[i])
    dim = [hi[i] - lo[i] for i in range(3)] if verts else [0.0, 0.0, 0.0]
    return verts, tris, dim


def samples_a_texture(me):
    """True only if some material on this mesh actually reads an image."""
    for mat in me.materials:
        if mat is None or not mat.use_nodes:
            continue
        for node in mat.node_tree.nodes:
            if node.type == "TEX_IMAGE" and node.image is not None:
                for out in node.outputs:
                    if out.is_linked:
                        return True
    return False


def refine_all():
    welded = skipped_uv = 0
    for ob in [o for o in bpy.data.objects if o.type == "MESH"]:
        me = ob.data
        bpy.context.view_layer.objects.active = ob
        bpy.ops.object.select_all(action="DESELECT")
        ob.select_set(True)

        if me.has_custom_normals:
            bpy.ops.mesh.customdata_custom_splitnormals_clear()

        textured = bool(me.uv_layers) and samples_a_texture(me)
        scale = sum(abs(s) for s in ob.matrix_world.to_scale()) / 3.0
        local_weld = WELD_WORLD / max(scale, 1e-6)
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        if not textured:
            bpy.ops.mesh.remove_doubles(threshold=local_weld)
            welded += 1
        else:
            skipped_uv += 1
        bpy.ops.mesh.normals_make_consistent(inside=False)
        bpy.ops.object.mode_set(mode="OBJECT")

        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(SMOOTH_ANGLE))

        bm = bmesh.new()
        bm.from_mesh(me)
        for edge in bm.edges:
            faces = edge.link_faces
            if len(faces) == 2 and faces[0].material_index != faces[1].material_index:
                edge.smooth = False
        bm.to_mesh(me)
        bm.free()
        me.update()
        ob.select_set(False)
    return welded, skipped_uv


def damaged(before, after):
    """Numeric proof the refinement did not eat the model."""
    v0, t0, d0 = before
    v1, t1, d1 = after
    if t0 and (t0 - t1) / t0 > MAX_TRI_LOSS:
        return "lost %.2f%% of triangles (%d -> %d)" % (100.0 * (t0 - t1) / t0, t0, t1)
    if v1 == 0:
        return "no vertices survived"
    scale = max(max(d0), 1e-9)
    for i in range(3):
        if abs(d0[i] - d1[i]) / scale > MAX_BBOX_DRIFT:
            return "bounding box moved on axis %d: %.5f -> %.5f" % (i, d0[i], d1[i])
    return ""


def main():
    argv = sys.argv[sys.argv.index("--") + 1:]
    in_dir, out_dir = argv[0], argv[1]
    only = set(argv[2:])
    os.makedirs(out_dir, exist_ok=True)

    names = sorted(f for f in os.listdir(in_dir) if f.lower().endswith(".glb"))
    if only:
        names = [n for n in names if n in only]

    report = []
    for name in names:
        src = os.path.join(in_dir, name)
        dst = os.path.join(out_dir, name)
        row = {"file": name}
        try:
            bpy.ops.wm.read_homefile(use_empty=True, use_factory_startup=True)
            bpy.ops.import_scene.gltf(filepath=src)
            before = measure()
            welded, skipped_uv = refine_all()
            after = measure()
            harm = damaged(before, after)
            if harm:
                row.update(status="refused", reason=harm)
            else:
                bpy.ops.export_scene.gltf(
                    filepath=dst,
                    export_format="GLB",
                    export_normals=True,
                    export_texcoords=True,
                    export_materials="EXPORT",
                    export_apply=False,
                    export_yup=True,
                    export_cameras=False,
                    export_lights=False,
                    use_selection=False,
                )
                row.update(
                    status="refined",
                    verts=[before[0], after[0]],
                    tris=[before[1], after[1]],
                    welded=welded,
                    skipped_uv=skipped_uv,
                    bytes=[os.path.getsize(src), os.path.getsize(dst)],
                )
        except Exception as ex:  # a bad model must not take the batch down
            row.update(status="error", reason=str(ex)[:200])
        report.append(row)
        print("REFINE_ROW " + json.dumps(row), flush=True)

    print("REFINE_DONE " + json.dumps({"count": len(report)}), flush=True)


main()
