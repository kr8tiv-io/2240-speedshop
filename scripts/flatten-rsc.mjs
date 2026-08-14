/**
 * Make App Router link prefetch work on a plain static host.
 *
 *   node scripts/flatten-rsc.mjs out
 *
 * THE BUG. `next build` with `output: "export"` writes each route's RSC
 * prefetch payload as a NESTED DIRECTORY:
 *
 *   out/about/__next.about/__PAGE__.txt
 *   out/builds/1960s-dodge-d100/__next.builds/$d$slug/__PAGE__.txt
 *
 * but the client asks for the same thing with the segments joined by DOTS:
 *
 *   /about/__next.about.__PAGE__.txt
 *   /builds/1960s-dodge-d100/__next.builds.$d$slug.__PAGE__.txt
 *
 * That is not a deduction — those are the literal URLs Chrome requested, and
 * every one of them came back 404 against the built export. A failed prefetch
 * is silent (the link still works, it just does a full navigation instead of
 * an instant one), which is exactly why it survived this long: nothing is
 * visibly broken, the site is just slower to move around than it should be.
 *
 * THE FIX. Emit the dotted name alongside the nested one. Copies, not moves —
 * anything already resolving the nested form keeps working.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "out");

/** Every file underneath `dir`, as paths relative to it. */
function walk(dir, base = dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, base, out);
    else out.push(path.relative(base, full));
  }
  return out;
}

let written = 0;
/* Find the payload directories themselves rather than scanning every file in
   the export: the marker is a directory whose name starts with `__next.`. */
function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const full = path.join(dir, e.name);
    if (!e.name.startsWith("__next.")) {
      scan(full);
      continue;
    }
    for (const rel of walk(full)) {
      // `__next.builds` + `$d$slug/__PAGE__.txt` -> `__next.builds.$d$slug.__PAGE__.txt`
      const flat = [e.name, ...rel.split(path.sep)].join(".");
      const dst = path.join(dir, flat);
      if (!fs.existsSync(dst)) {
        fs.copyFileSync(path.join(full, rel), dst);
        written++;
      }
    }
  }
}

if (!fs.existsSync(root)) throw new Error(`no export at ${root}`);
scan(root);
console.log(`flatten-rsc: wrote ${written} dotted prefetch payload(s)`);
