# Which models are ACTUALLY faceted, and does recalculating normals flip faces?
#
#   blender --background --python scripts/audit-facets.py -- <dir>
#
# Two questions, one import per model:
#
#   1. What fraction of this model's triangles carry one normal per FACE? That is
#      the same test `isFlatShaded` makes at runtime in Loaders.tsx, and it is the
#      only honest basis for deciding whether a model needs de-faceting at all.
#      Refining a model that is already smooth does not merely waste time — a
#      smooth-by-angle pass INTRODUCES sharp edges wherever the author's normals
#      crossed a steeper angle than the threshold, and the glTF exporter splits
#      vertices at every one of them. Measured on the shipped shelf: the props
#      got BIGGER (ammo-box 48,895 -> 51,761 B on the wire, bench-vice 150,090 ->
#      155,788) while the faceted cars halved.
#
#   2. How many faces does `normals_make_consistent(inside=False)` flip? glTF
#      already mandates counter-clockwise winding, so a flip is not a correction,
#      it is damage — and it is invisible in a Cycles clay render, which shades
#      both sides. In three, with the default FrontSide, a flipped face simply
#      disappears.

import bpy
import bmesh
import json
import os
import sys


def flat_fraction(me):
    """Fraction of triangles whose three corner normals are identical."""
    me.calc_loop_triangles()
    normals = me.corner_normals if hasattr(me, "corner_normals") else None
    total = flat = 0
    for tri in me.loop_triangles:
        total += 1
        if normals is not None:
            a, b, c = (normals[i].vector for i in tri.loops)
        else:
            continue
        if (a - b).length < 1e-4 and (a - c).length < 1e-4:
            flat += 1
    return (flat / total) if total else 0.0, total


def flips(me):
    """Faces whose winding `recalc_face_normals` would reverse."""
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.faces.ensure_lookup_table()
    before = [f.normal.copy() for f in bm.faces]
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.faces.ensure_lookup_table()
    n = sum(1 for i, f in enumerate(bm.faces) if f.normal.dot(before[i]) < 0.0)
    bm.free()
    return n


def main():
    argv = sys.argv[sys.argv.index("--") + 1:]
    in_dir = argv[0]
    for name in sorted(f for f in os.listdir(in_dir) if f.lower().endswith(".glb")):
        row = {"file": name}
        try:
            bpy.ops.wm.read_homefile(use_empty=True, use_factory_startup=True)
            bpy.ops.import_scene.gltf(filepath=os.path.join(in_dir, name))
            tris = flatn = flipped = 0
            for ob in bpy.data.objects:
                if ob.type != "MESH":
                    continue
                frac, n = flat_fraction(ob.data)
                tris += n
                flatn += frac * n
                flipped += flips(ob.data)
            row.update(
                tris=tris,
                flat_pct=round(100.0 * flatn / tris, 1) if tris else 0.0,
                flips=flipped,
                flip_pct=round(100.0 * flipped / tris, 1) if tris else 0.0,
            )
        except Exception as ex:
            row.update(error=str(ex)[:120])
        print("FACET_ROW " + json.dumps(row), flush=True)


main()
