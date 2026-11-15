import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createReadStream } from "node:fs";
import { existsSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const projectDirectory = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  define: {
    __ARCHIVE_REVIEW_AVAILABLE__: JSON.stringify(
      existsSync(
        resolve(
          projectDirectory,
          "../../docs/qa/reference-fidelity/media-review/trophy-story.jpg",
        ),
      ),
    ),
  },
  plugins: [
    react(),
    {
      name: "private-media-review",
      configureServer(server) {
        server.middlewares.use("/__review-media", (request, response, next) => {
          const name = request.url?.split("?")[0]?.slice(1) || "";
          if (
            !/^(archive-[0-5]|warne-story|warne-tribute|trophy-story)\.jpg$/.test(
              name,
            )
          ) {
            response.statusCode = 404;
            response.end();
            return;
          }
          const path = resolve(
            projectDirectory,
            "../../docs/qa/reference-fidelity/media-review",
            name,
          );
          if (!existsSync(path)) {
            next();
            return;
          }
          response.setHeader("Content-Type", "image/jpeg");
          response.setHeader("Cache-Control", "private,max-age=3600");
          createReadStream(path).pipe(response);
        });
      },
      closeBundle() {
        // Never distribute inherited review-only portraits or fabricated archive graphics.
        for (const name of ["portraits", "cutouts", "archival"])
          rmSync(resolve(projectDirectory, "dist/assets", name), {
            recursive: true,
            force: true,
          });
      },
    },
  ],
  server: {
    host: "127.0.0.1",
    port: 3000,
    strictPort: true,
    proxy: { "/api": { target: "http://127.0.0.1:8010", changeOrigin: true } },
  },
});
