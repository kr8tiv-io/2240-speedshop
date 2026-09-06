import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { pipeline } from "node:stream";

const ROOT = path.resolve(process.env.EXPORT_DIR || "out");
const PORT = Number(process.env.PORT || 3117);
const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  // Static Next RSC payloads must match the production host's text MIME.
  // Octet-stream makes Next discard them and force a second hard navigation.
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".avif", "image/avif"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".ico", "image/x-icon"],
  [".woff2", "font/woff2"],
  [".glb", "model/gltf-binary"],
  [".bin", "application/octet-stream"],
  [".wasm", "application/wasm"],
]);

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", "http://export.local").pathname);
  let file = path.resolve(ROOT, `.${pathname}`);
  if (!file.startsWith(`${ROOT}${path.sep}`) && file !== ROOT) {
    response.writeHead(403).end("forbidden");
    return;
  }
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    const stat = fs.statSync(file);
    const brotli = file.endsWith(".br");
    const contentFile = brotli ? file.slice(0, -3) : file;
    response.writeHead(200, {
      "Content-Type": types.get(path.extname(contentFile).toLowerCase()) || "application/octet-stream",
      "Content-Length": stat.size,
      "Cache-Control": "no-store",
      ...(brotli ? { "Content-Encoding": "br" } : {}),
    });
    if (request.method === "HEAD") response.end();
    else pipeline(fs.createReadStream(file), response, () => {});
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("not found");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`static export: http://127.0.0.1:${PORT} from ${ROOT}`);
});
