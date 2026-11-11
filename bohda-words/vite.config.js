import { defineConfig } from "vite";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const getFile = (relativePath) =>
    fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
    plugins: [
        {
            name: "bodhaplay-home",

            configureServer(server) {
                const sharedFiles = {
                    "/bp26/js/load-header.js": [
                        "../bp26/js/load-header.js",
                        "text/javascript"
                    ],
                    "/shared/navbar.html": [
                        "../shared/navbar.html",
                        "text/html"
                    ],
                    "/shared/navbar.css": [
                        "../shared/navbar.css",
                        "text/css"
                    ],
                    "/bp26/css/header.css": ["../bp26/css/header.css", "text/css"],
                    "/bp26/bp26c.png": [
                        "../bp26/bp26c.png",
                        "image/png"
                    ]
                };

                server.middlewares.use(async (req, res, next) => {
                    const route = req.url?.split("?")[0];
                    const resource = sharedFiles[route];

                    if (!resource) return next();

                    try {
                        const contents = await fs.readFile(
                            getFile(resource[0])
                        );

                        res.setHeader(
                            "Content-Type",
                            resource[1]
                        );

                        res.end(contents);
                    } catch (error) {
                        next(error);
                    }
                });

                server.middlewares.use(async (req, res, next) => {
                    if (req.url?.split("?")[0] !== "/") {
                        return next();
                    }

                    try {
                        const html = await fs.readFile(
                            getFile("./src/index.html"),
                            "utf8"
                        );

                        const transformed =
                            await server.transformIndexHtml(
                                "/src/index.html",
                                html
                            );

                        res.setHeader(
                            "Content-Type",
                            "text/html; charset=utf-8"
                        );

                        res.end(transformed);
                    } catch (error) {
                        next(error);
                    }
                });
            }
        }
    ],

    server: {
        port: 5181,
        strictPort: true,
        open: true
    }
});

