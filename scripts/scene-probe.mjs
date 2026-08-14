/**
 * Walk the live three.js scene at a given scroll position and report what is
 * actually there: which act groups are visible, what the lights are doing, and
 * whether each act's meshes are on screen and lit.
 *
 *   node scripts/scene-probe.mjs http://localhost:4241 4400
 *
 * Inference had gone as far as it usefully could — the dissolve reaches 1, the
 * framing assertion passes, and the car is still not on screen. R3F hangs its
 * store off the canvas element (`canvas.__r3f`), so the scene graph can just be
 * read rather than deduced.
 */
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const [base, yArg, wArg, hArg] = process.argv.slice(2);
const Y = Number(yArg), W = Number(wArg || 1440), H = Number(hArg || 900);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  args: [`--window-position=-2400,0`, `--window-size=${W + 16},${H + 120}`],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.goto(base, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));

for (let y = 0; y < Y; y += 300) {
  await page.evaluate((yy) => window.__lenis2240?.scrollTo(yy, { duration: 0.08 }), y);
  await new Promise((r) => setTimeout(r, 45));
}
await page.evaluate((yy) => window.__lenis2240?.scrollTo(yy, { duration: 0.2 }), Y);
await new Promise((r) => setTimeout(r, 1800));

const report = await page.evaluate(() => {
  const fl = window.__film;
  if (!fl?.three) return { error: "window.__film.three missing" };
  const { scene, camera, gl } = fl.three;

  /* three is not on window, so borrow the Box3 constructor off any geometry's
     own boundingBox rather than importing anything. */
  let Box3Ctor = null;
  scene.traverse((o) => {
    if (Box3Ctor || !o.isMesh || !o.geometry) return;
    o.geometry.computeBoundingBox();
    if (o.geometry.boundingBox) Box3Ctor = o.geometry.boundingBox.constructor;
  });

  const lights = [];
  const groups = [];
  scene.traverse((o) => {
    if (o.isLight) {
      lights.push({
        type: o.type,
        intensity: Math.round(o.intensity * 100) / 100,
        color: o.color?.getHexString?.(),
        pos: o.position.toArray().map((v) => Math.round(v * 100) / 100),
        visible: o.visible,
        parentVisible: o.parent ? o.parent.visible : null,
      });
    }
  });

  // Act groups: the three top-level groups that contain many meshes.
  for (const child of scene.children) {
    let meshes = 0, visibleMeshes = 0, tris = 0;
    const mats = new Set();
    child.traverse((o) => {
      if (!o.isMesh) return;
      meshes++;
      let vis = o.visible;
      for (let p = o.parent; p; p = p.parent) if (!p.visible) vis = false;
      if (vis) {
        visibleMeshes++;
        tris += (o.geometry?.index?.count ?? o.geometry?.attributes?.position?.count ?? 0) / 3;
      }
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      if (m) mats.add(`${m.type}:${m.color?.getHexString?.() ?? "-"}:vc${m.vertexColors ? 1 : 0}:op${m.opacity}`);
    });
    if (meshes) {
      /* WHERE IS IT, in world space. `edge` is computed from a box placed at
         the camera-fit point, not from the mesh, so it reports perfect framing
         for a car that is not there. Measure the real thing. */
      let bbox = null;
      const B = Box3Ctor;
      if (B) {
        const box = new B().setFromObject(child, true);
        if (isFinite(box.min.x)) {
          const c = box.getCenter(new box.min.constructor());
          const s = box.getSize(new box.min.constructor());
          const ndc = c.clone().project(camera);
          bbox = {
            min: box.min.toArray().map((v) => Math.round(v * 100) / 100),
            max: box.max.toArray().map((v) => Math.round(v * 100) / 100),
            size: s.toArray().map((v) => Math.round(v * 100) / 100),
            centreNDC: [Math.round(ndc.x * 100) / 100, Math.round(ndc.y * 100) / 100, Math.round(ndc.z * 100) / 100],
          };
        }
      }
      groups.push({
        name: child.name || child.type,
        visible: child.visible,
        meshes,
        visibleMeshes,
        tris: Math.round(tris),
        bbox,
        sampleMats: [...mats].slice(0, 5),
      });
    }
  }

  return {
    film: window.__film ? { act: window.__film.stage.act, reveal: Math.round(window.__film.stage.reveal * 100) / 100, edge: Math.round(window.__film.edge * 100) / 100 } : null,
    toneMapping: gl.toneMapping,
    exposure: gl.toneMappingExposure,
    cam: camera.position.toArray().map((v) => Math.round(v * 100) / 100),
    lights,
    groups,
  };
});

console.log(JSON.stringify(report, null, 1));

/* OVERRIDE-MATERIAL TEST. The probe says act II's group is visible with 21.5k
   triangles in frame under live lights, and the frame is still black. That
   leaves two possibilities and they have nothing in common: the geometry is
   somewhere the camera is not, or every material is discarding/rendering
   black. scene.overrideMaterial bypasses every material shader in one line —
   if the car appears in flat magenta, the geometry and camera were never the
   problem and the dissolve shader is eating it. */
/* Neither a strong emissive nor stripping the dissolve made act II appear, yet
   the group is visible, in frame and counted at 21.5k triangles. That
   combination — present in the graph, absent from the raster — is what LAYERS
   and per-material write flags look like. Dump the state instead of guessing. */
const state = await page.evaluate(() => {
  const { scene, camera } = window.__film.three;
  const out = { cameraLayers: camera.layers.mask, meshes: [] };
  const groups = scene.children.filter((c) => {
    let n = 0;
    c.traverse((o) => { if (o.isMesh) n++; });
    return c.visible && n > 50;
  });
  for (const g of groups) {
    g.traverse((o) => {
      if (!o.isMesh || out.meshes.length >= 8) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      /* Read matrixWorld's basis-vector lengths directly. getWorldScale()
         calls updateWorldMatrix() first, and this scene deliberately freezes
         its world matrices — so the getter can rewrite the very thing it is
         being asked to measure. */
      const e = o.matrixWorld.elements;
      const len = (i) => Math.hypot(e[i], e[i + 1], e[i + 2]);
      const ws = { x: len(0), y: len(4), z: len(8) };
      /* SIGN, not just magnitude. hypot is always positive, so a MIRRORED
         transform measures identical to a normal one — and a negative
         determinant flips triangle winding, which with side:FrontSide culls
         every face. That renders nothing while visible, bbox, frustum,
         material and lighting all still look perfect. */
      const det =
        e[0] * (e[5] * e[10] - e[6] * e[9]) -
        e[1] * (e[4] * e[10] - e[6] * e[8]) +
        e[2] * (e[4] * e[9] - e[5] * e[8]);
      const gb = o.geometry?.boundingBox;
      out.meshes.push({
        name: (o.name || "-").slice(0, 26),
        layers: o.layers.mask,
        visible: o.visible,
        frustumCulled: o.frustumCulled,
        renderOrder: o.renderOrder,
        worldScale: [ws.x.toExponential(2), ws.y.toExponential(2), ws.z.toExponential(2)],
        det: det.toExponential(2),
        mirrored: det < 0,
        matrixAutoUpdate: o.matrixAutoUpdate,
        matrixWorldAutoUpdate: o.matrixWorldAutoUpdate,
        geomSize: gb ? [Math.round((gb.max.x - gb.min.x) * 100) / 100, Math.round((gb.max.y - gb.min.y) * 100) / 100, Math.round((gb.max.z - gb.min.z) * 100) / 100] : null,
        isPoints: !!o.isPoints,
        mat: m && {
          type: m.type,
          visible: m.visible,
          transparent: m.transparent,
          opacity: m.opacity,
          colorWrite: m.colorWrite,
          depthTest: m.depthTest,
          depthWrite: m.depthWrite,
          blending: m.blending,
          side: m.side,
          alphaTest: m.alphaTest,
        },
      });
    });
  }
  return out;
});
console.log("RENDER STATE:", JSON.stringify(state, null, 1));

const shot = (n) => page.screenshot({ path: `C:\\tmp\\probe-${n}.png` });

/* UNLIT SWAP, SCOPED TO THE ACT'S CAR ONLY. Earlier attempts each broke
   themselves: scene.overrideMaterial painted the floor the same magenta so a
   magenta car on it was invisible, and clearing onBeforeCompile scene-wide
   clobbered MeshReflectorMaterial and blacked out the floor and lamp too.
   Swapping ONLY the act's meshes to a fresh unlit material leaves the rest of
   the frame as a reference: a magenta car over the normal dark floor is
   unambiguous, and it answers both questions at once, because an unlit
   material ignores the lights AND carries no dissolve patch. */
const swapped = await page.evaluate(() => {
  const { scene } = window.__film.three;
  let donor = null;
  scene.traverse((o) => {
    const m = Array.isArray(o.material) ? o.material[0] : o.material;
    if (!donor && m?.type === "MeshBasicMaterial") donor = m;
  });
  if (!donor) return -1;
  const flat = donor.clone();
  flat.color.setHex(0xff00ff);
  flat.opacity = 1;
  flat.transparent = false;
  flat.depthWrite = true;
  flat.depthTest = true;
  flat.map = null;
  flat.toneMapped = false;

  /* Report and mutate in the SAME evaluation. The earlier version measured the
     graph, then swapped materials two seconds later — long enough for the act
     to have changed underneath the conclusion. */
  const info = [];
  let n = 0;
  for (const c of scene.children) {
    let meshes = 0;
    c.traverse((o) => { if (o.isMesh) meshes++; });
    if (meshes <= 50) continue;
    const rec = { visible: c.visible, meshes, swapped: 0 };
    if (c.visible) {
      c.traverse((o) => {
        if (!o.isMesh || o.isPoints) return;
        o.material = flat;
        o.frustumCulled = false;
        rec.swapped++;
        n++;
      });
    }
    info.push(rec);
  }
  return { n, act: window.__film.stage.act, reveal: Math.round(window.__film.stage.reveal * 100) / 100, info };
});
await new Promise((r) => setTimeout(r, 800));
await shot("C-carflat");
console.log(`swapped ${JSON.stringify(swapped)} -> probe-C-carflat.png`);

/* WHO HID THEM. The wireframe ghost lives in this same group and demonstrably
   renders at reveal 0, yet at reveal 1 the whole group draws nothing even with
   an unlit material and culling off. So re-read visibility AFTER the swap:
   if the meshes were visible when measured and invisible now, something in the
   frame loop is turning them off rather than anything about how they shade.
   Then pin them on with scene.overrideMaterial (which the app cannot undo) and
   hide the floor so magenta geometry reads against black. */
const after = await page.evaluate(() => {
  const { scene } = window.__film.three;
  const out = { groups: [], reveal: window.__film.stage.reveal, act: window.__film.stage.act };
  for (const c of scene.children) {
    let meshes = 0, vis = 0;
    c.traverse((o) => {
      if (!o.isMesh) return;
      meshes++;
      let v = o.visible;
      for (let p = o.parent; p; p = p.parent) if (!p.visible) v = false;
      if (v) vis++;
    });
    if (meshes > 20) out.groups.push({ meshes, vis, groupVisible: c.visible });
  }
  return out;
});
console.log("AFTER SWAP:", JSON.stringify(after));

await page.evaluate(() => {
  const { scene } = window.__film.three;
  let donor = null;
  scene.traverse((o) => {
    const m = Array.isArray(o.material) ? o.material[0] : o.material;
    if (!donor && m?.type === "MeshBasicMaterial") donor = m;
  });
  const flat = donor.clone();
  flat.color.setHex(0xff00ff);
  flat.transparent = false;
  flat.opacity = 1;
  flat.map = null;
  flat.toneMapped = false;
  scene.overrideMaterial = flat;
  /* Hide EVERYTHING except the live act. The previous attempt hid only groups
     with few meshes and the floor still painted magenta, so magenta-on-magenta
     hid the car exactly as it did the first time. With every other child off,
     any magenta left on screen is the car and nothing else. */
  for (const c of scene.children) {
    let meshes = 0;
    c.traverse((o) => { if (o.isMesh) meshes++; });
    if (!(meshes > 20 && c.visible)) c.visible = false;
  }
  /* Force the act's CAR meshes on every frame — but never the flat planes.
     The act group also holds the scan sheet and the contact-shadow pool, both
     horizontal quads the size of the stage. Forcing those visible under an
     override material drew a huge magenta slab across the lower frame that
     occluded the very car this test exists to find. Anything with four
     triangles or fewer is one of those quads, not bodywork. */
  const on = () => {
    for (const c of scene.children) {
      let n = 0;
      c.traverse((o) => { if (o.isMesh) n++; });
      if (n <= 20 || !c.visible) continue;
      c.traverse((o) => {
        /* Points must be hidden too. The act carries a surface point cloud,
           and scene.overrideMaterial forces a MeshBasicMaterial onto it —
           which never writes gl_PointSize, so the size is undefined and the
           driver happily drew thousands of enormous magenta quads. That is
           the "solid magenta slab with a straight top edge" the last two runs
           reported as the car. */
        if (o.isPoints) {
          o.visible = false;
          return;
        }
        if (!o.isMesh) return;
        const g = o.geometry;
        const tris = (g?.index?.count ?? g?.attributes?.position?.count ?? 0) / 3;
        o.visible = tris > 4;
      });
    }
    window.__pin = requestAnimationFrame(on);
  };
  on();
});
await new Promise((r) => setTimeout(r, 900));
await shot("E-pinned");
console.log("wrote probe-E-pinned.png");

/* D: TURN OFF FRUSTUM CULLING. Everything else has been ruled out — the meshes
   are visible, correctly sized, in frame, and now carry an unlit material with
   no shader of ours on it, and they still do not rasterise. three culls against
   geometry.boundingSphere transformed by matrixWorld, and a boundingSphere that
   was computed BEFORE the geometry was recentred/scaled will place the sphere
   somewhere the frustum never reaches — the mesh is then skipped entirely while
   every property that a screenshot or a framing assertion can see still looks
   correct. If the car appears now, that is the bug. */
const culled = await page.evaluate(() => {
  const { scene, camera } = window.__film.three;
  const groups = scene.children.filter((c) => {
    let n = 0;
    c.traverse((o) => { if (o.isMesh) n++; });
    return c.visible && n > 50;
  });
  const before = [];
  let n = 0;
  for (const g of groups) {
    g.traverse((o) => {
      if (!o.isMesh && !o.isPoints) return;
      if (before.length < 4 && o.geometry) {
        const bs = o.geometry.boundingSphere;
        before.push({
          name: (o.name || "-").slice(0, 22),
          sphere: bs ? { c: bs.center.toArray().map((v) => Math.round(v)), r: Math.round(bs.radius) } : null,
        });
      }
      o.frustumCulled = false;
      n++;
    });
  }
  return { n, before };
});
await new Promise((r) => setTimeout(r, 800));
await shot("D-nocull");
console.log(`frustumCulled=false on ${culled.n}; spheres: ${JSON.stringify(culled.before)}`);

await browser.close();
