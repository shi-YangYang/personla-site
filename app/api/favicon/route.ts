import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const FAVICON_DIR = path.join(process.cwd(), "data");

const CANDIDATES = [
  { name: "favicon.ico", type: "image/x-icon" },
  { name: "favicon.png", type: "image/png" },
  { name: "favicon.svg", type: "image/svg+xml" },
  { name: "icon.png", type: "image/png" },
] as const;

export async function GET() {
  for (const c of CANDIDATES) {
    const file = path.join(FAVICON_DIR, c.name);
    if (existsSync(file)) {
      return new Response(readFileSync(file), {
        headers: {
          "Content-Type": c.type,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  }
  return new Response("Not Found", { status: 404 });
}
