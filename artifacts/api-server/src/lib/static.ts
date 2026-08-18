import express, { type Express } from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Serves the built frontend (Vite SPA) from the same Express process so the
 * whole site runs as a single service on one origin — this is why the browser
 * forms can POST to /api/lead without any cross-origin proxy in production.
 *
 * The frontend build is expected at dist/public next to the bundled server
 * (the Dockerfile / DEPLOY.md copy it there), or at the path in FRONTEND_DIST.
 *
 * Returns true when a build was found and mounted, false otherwise (e.g. when
 * running the API standalone in development).
 */
export function serveFrontend(app: Express): boolean {
  const serverDir = path.dirname(fileURLToPath(import.meta.url));
  const distDir = process.env["FRONTEND_DIST"]
    ? path.resolve(process.env["FRONTEND_DIST"])
    : path.join(serverDir, "public");

  const indexHtml = path.join(distDir, "index.html");
  if (!existsSync(indexHtml)) {
    return false;
  }

  // Static assets (hashed JS/CSS, favicon, robots.txt, sitemap.xml, ...).
  app.use(express.static(distDir, { index: false, maxAge: "1h" }));

  // SPA fallback: any non-API GET/HEAD returns index.html so client-side
  // routing (/support, /legal) works on direct load and refresh.
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.path.startsWith("/api")) return next();
    res.sendFile(indexHtml);
  });

  return true;
}
