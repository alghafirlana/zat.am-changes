import { defineConfig } from "vite";
import fs from "node:fs/promises";

export default defineConfig({
    plugins: [
        {
            name: "numerale",
            configureServer(server) {
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
        port: 5184,
        strictPort: true,
        open: true
    }
});