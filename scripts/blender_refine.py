"""
De-facet glTF cars in Blender 5.2 without wrecking them.

  blender --background --factory-startup --python scripts/blender_refine.py -- IN.glb OUT.glb [angle]

WHY THE OBVIOUS FIXES DON'T WORK (all verified against Blender 5.2.0 LTS source,
addons_core/io_scene_gltf2/blender/imp/mesh.py):

  * material.flatShading = false at runtime does nothing: the facets are baked into
    the NORMAL accessor as custom split normals (importer line 658,
    mesh.normals_split_custom_set_from_vertices).
  * bpy.ops.object.shade_smooth() alone does nothing: per bpy.types.Mesh.shade_smooth
    it only removes the "sharp_face" attribute; custom split normals still win.
  * mesh.use_auto_smooth / auto_smooth_angle DO NOT EXIST in 4.1+ (confirmed absent
    from the 5.2 bpy.types.Mesh RST).
  * Clearing custom split normals is still not enough. The importer ALSO writes a
    per-face "sharp_face" boolean it guesses from the data (importer lines 885-928);
    on car-muscle-challenger that flag is set on 7484 / 11107 faces = 67.4%, which is
    exactly the "67.4% flat-shaded polys" measured in Blender.
  * And even clearing BOTH is not enough: the vertices are physically SPLIT
    (21880 verts for 11107 tris ~= 2:1). Smooth shading averages face normals around a
    shared vertex; if no vertex is shared, every corner still resolves to its own facet
    normal. THE WELD IS THE ACTUAL FIX. Everything else is bookkeeping.

THE CLEAN PATH — do it at import time, not with post-hoc surgery:

  import_shading='SMOOTH'  ->  importer line 196 only sets has_normals=True when
                               import_shading=='NORMALS', so line 658 never runs and
                               NO custom split normals are ever allocated; and
                               set_poly_smoothing (line 873) writes sharp_face=False
                               for every face.
  merge_vertices=True      ->  merge_duplicate_verts (line 931) dedupes on a structured
                               numpy array. Because vert_normals stays EMPTY under
                               'SMOOTH' (guarded by has_normals at line 309), the dedupe
                               key is POSITION ONLY -- exact float32 equality. That is the
                               precise inverse of the split the glTF exporter performed.

Exact-equality welding is why NO distance threshold is needed, and it is much safer than
one: the smallest genuine edge in car-muscle-challenger is 5e-7 units on a ~5-unit model
(a 1e7 dynamic range), so any global merge distance big enough to matter would also
collapse real geometry. bpy.ops.mesh.remove_doubles is the wrong tool here.

MEASURED, Blender 5.2.0 LTS, public/models-opt (tris and bbox unchanged, bbox to 6 dp):
  challenger 21880 -> 5864 welded verts   camaro 9072 -> 2312   hotrod 47594 -> 12865

After dedup+prune+meshopt (the site's own geometry step), shipped vs refined@40:
  challenger 167284 -> 113828 B (-32.0%)
  camaro      71268 ->  53652 B (-24.7%)
  hotrod     300756 -> 177552 B (-41.0%)
Quality goes UP and the mobile shelf gets SMALLER, because the source was paying for a
fully-split vertex buffer just to encode facets.
"""

import bpy
import math
import os
import sys
from collections import Counter


# ---------------------------------------------------------------- audit helpers

def _coincident_face_audit():
    """Faces sharing an identical set of vertex POSITIONS with another face in the
    same mesh. After welding these become the same face and mesh.validate() drops
    one. If the pair has OPPOSITE winding it was deliberate double-sided geometry
    and collapsing it makes that part vanish from one side.

    This predicted the loss exactly: hotrod predicted 32 / lost 32 (all 32 opposite
    winding), charger 4 / 4, coupe-hoodup 2 / 2, challenger 0 / 0.
    """
    redundant = 0
    opposite = 0
    mats = set()
    for ob in (o for o in bpy.data.objects if o.type == 'MESH'):
        me = ob.data
        groups = {}
        for p in me.polygons:
            key = tuple(sorted(
                tuple(round(c, 6) for c in me.vertices[v].co) for v in p.vertices))
            groups.setdefault(key, []).append(p)
        for key, faces in groups.items():
            if len(faces) < 2:
                continue
            redundant += len(faces) - 1
            for i in range(len(faces)):
                for j in range(i + 1, len(faces)):
                    if faces[i].normal.dot(faces[j].normal) < -0.9:
                        opposite += 1
                        mats.add((ob.name, faces[i].material_index))
    return {"redundant_coincident_faces": redundant,
            "opposite_winding_pairs": opposite,
            "double_sided_slots": sorted(mats)}


def _totals():
    verts = tris = 0
    bb = [1e9] * 3 + [-1e9] * 3
    for ob in (o for o in bpy.data.objects if o.type == 'MESH'):
        me = ob.data
        me.calc_loop_triangles()
        verts += len(me.vertices)
        tris += len(me.loop_triangles)
        for v in me.vertices:
            w = ob.matrix_world @ v.co
            for i in range(3):
                bb[i] = min(bb[i], w[i])
                bb[i + 3] = max(bb[i + 3], w[i])
    return {"verts": verts, "tris": tris,
            "bbox": [round(x, 6) for x in bb]}


# ---------------------------------------------------------------- the function

def refine(path_in, path_out, angle_deg=40.0, weld=True,
           recalc_outside=False, on_double_sided="report", verbose=True):
    """De-facet one glTF/GLB and write it back.

    angle_deg        Smooth-by-angle threshold. 40 is the evidence-based default
                     (see the dihedral histograms in the notes below). Edges whose
                     dihedral angle exceeds this stay sharp, so panel seams, window
                     frames and grille slats survive.
    weld             Merge the split vertices. This is the step that actually
                     de-facets; with weld=False you get a smooth-shaded mesh that
                     still looks faceted.
    recalc_outside   OFF by default and you almost certainly want it off: glTF
                     already guarantees CCW front faces, and 'recalculate outside'
                     would flip 372 faces on the challenger and 1173 on the hotrod
                     -- it misfires on the open/non-manifold shells these models use.
    on_double_sided  'report' (default) | 'mark' | 'skip_weld'. What to do when the
                     mesh contains back-to-back face pairs that welding would
                     collapse. 'mark' clears backface culling on the affected
                     materials (exports as glTF doubleSided=true) which preserves the
                     look for ~0 bytes but disables culling for the whole material.

    Returns a dict of before/after metrics. Check it -- see the guardrails below.
    """
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # --- baseline: read the file as-is so we can diff against it -------------
    bpy.ops.import_scene.gltf(filepath=path_in)
    before = _totals()
    audit = _coincident_face_audit()
    bpy.ops.wm.read_factory_settings(use_empty=True)

    if audit["opposite_winding_pairs"] and on_double_sided == "skip_weld":
        weld = False

    # --- the real import: no custom split normals, no sharp_face, welded -----
    bpy.ops.import_scene.gltf(filepath=path_in,
                              import_shading='SMOOTH',
                              merge_vertices=bool(weld))
    welded = _totals()

    for ob in (o for o in bpy.data.objects if o.type == 'MESH'):
        bpy.ops.object.select_all(action='DESELECT')
        ob.select_set(True)
        bpy.context.view_layer.objects.active = ob

        if recalc_outside:
            bpy.ops.object.mode_set(mode='EDIT')
            bpy.ops.mesh.select_all(action='SELECT')
            bpy.ops.mesh.normals_make_consistent(inside=False)
            bpy.ops.object.mode_set(mode='OBJECT')

        # shade_smooth first: clears any lingering sharp_face and removes a
        # "Smooth by Angle" modifier if one is present (manual: Shade Smooth
        # "will also remove any Smooth By Angle Modifiers").
        bpy.ops.object.shade_smooth()

        # Bakes the "sharp_edge" attribute directly -- NOT a geometry-nodes
        # modifier, so nothing depends on modifier evaluation at export time.
        # (bpy.ops.object.shade_auto_smooth would add the modifier instead.)
        # keep_sharp_edges=False => clear existing tags first, rebuild cleanly.
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angle_deg),
                                             keep_sharp_edges=False)

        if audit["opposite_winding_pairs"] and on_double_sided == "mark":
            for slot in ob.material_slots:
                if slot.material:
                    slot.material.use_backface_culling = False

    after = _totals()

    # --- export -------------------------------------------------------------
    # No Draco: scripts/compress-models.js applies EXT_meshopt_compression later,
    # and the two are mutually exclusive. Textures are deliberately left alone
    # here; compress-models.js re-encodes them to KTX2.
    bpy.ops.export_scene.gltf(
        filepath=path_out,
        export_format='GLB',
        use_selection=False,
        export_apply=True,          # bake any modifier (there should be none)
        export_yup=True,            # glTF convention
        export_normals=True,        # REQUIRED - without it the smoothing is lost
        export_tangents=False,      # no UVs on these vehicles; tangents = dead bytes
        export_texcoords=True,      # keep UVs where they do exist
        export_materials='EXPORT',  # keep PBR factors
        export_draco_mesh_compression_enable=False,
        export_shared_accessors=True,
        export_animations=False,
        export_skins=False,
        export_morph=False,
        export_cameras=False,
        export_lights=False,
        export_extras=False,
    )

    report = {
        "file": os.path.basename(path_in),
        "angle_deg": angle_deg,
        "welded": weld,
        "before": before,
        "after_weld": welded,
        "after_smooth": after,
        "audit": audit,
        "in_bytes": os.path.getsize(path_in),
        "out_bytes": os.path.getsize(path_out),
        "checks": _guardrails(before, welded, after),
    }
    if verbose:
        import json
        print("###REFINE###")
        print(json.dumps(report, indent=1))
    return report


def _guardrails(before, welded, after):
    """Numeric tripwires. Anything False here means STOP and look."""
    bb_ok = all(abs(a - b) < 1e-4 for a, b in zip(before["bbox"], after["bbox"]))
    tri_delta = before["tris"] - after["tris"]
    return {
        # 1. bounding box must not move: proves no vertex was displaced.
        "bbox_unchanged": bb_ok,
        # 2. triangles must survive. A small loss == coincident duplicate faces
        #    removed by validate(); cross-check audit.redundant_coincident_faces,
        #    which predicts the number exactly.
        "tris_lost": tri_delta,
        "tris_lost_pct": round(100.0 * tri_delta / max(1, before["tris"]), 3),
        # 3. the weld must actually do something, or you did not de-facet.
        "verts_before": before["verts"],
        "verts_after_weld": welded["verts"],
        "weld_ratio": round(welded["verts"] / max(1, before["verts"]), 3),
        # a real de-facet lands well under 1.0; ~1.0 means nothing welded.
        "weld_effective": welded["verts"] < before["verts"] * 0.95,
        # 4. verts:tris should fall toward ~0.5 (closed manifold) from ~2.0 (split).
        "verts_per_tri_before": round(before["verts"] / max(1, before["tris"]), 3),
        "verts_per_tri_after_weld": round(welded["verts"] / max(1, welded["tris"]), 3),
    }


if __name__ == "__main__":
    argv = sys.argv[sys.argv.index("--") + 1:]
    src, dst = argv[0], argv[1]
    ang = float(argv[2]) if len(argv) > 2 else 40.0
    refine(src, dst, angle_deg=ang)
