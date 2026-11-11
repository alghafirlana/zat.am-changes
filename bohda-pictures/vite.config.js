import { defineConfig } from "vite";
import fs from "node:fs/promises";

export default defineConfig({
    plugins: [
        {
            name: "bodhaplay-home",
            configureServer(server) {
                // Serve original Zat.am navbar files
                const navbarFiles = {
                    "/bp26/js/load-header.js": ["../bp26/js/load-header.js", "text/javascript"],
                    "/bp26/css/header.css": ["../bp26/css/header.css", "text/css"],
                    "/shared/navbar.css": ["../shared/navbar.css", "text/css"],
                    "/shared/navbar.html": ["../shared/navbar.html", "text/html"],
                    "/bp26/bp26c.png": ["../bp26/bp26c.png", "image/png"]
                };

                server.middlewares.use(async (req, res, next) => {
                    const pathname = req.url?.split("?")[0];
                    const resource = navbarFiles[pathname];

                    if (!resource) return next();

                    try {
                        const contents = await fs.readFile(
                            new URL(resource[0], import.meta.url)
                        );

                        res.setHeader("Content-Type", resource[1]);
                        res.end(contents);
                    } catch (error) {
                        next(error);
                    }
                });

                server.middlewares.use(async (req, res, next) => {
                    if (req.url !== "/") return next();

                    try {
                        const html = await fs.readFile(
                            "src/index.html",
                            "utf8"
                        );

                        const transformed = await server.transformIndexHtml(
                            "/src/index.html",
                            html
                        );

                        res.setHeader("Content-Type", "text/html");
                        res.end(transformed);
                    } catch (error) {
                        next(error);
                    }
                });
            }
        }
    ],
    server: {
        port: 5180,
        strictPort: true,
        open: true
    }
});
