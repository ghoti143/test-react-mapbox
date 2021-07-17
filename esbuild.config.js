import esbuild from "esbuild";
import serve, { error, log } from "create-serve";

export const isWatch = process.argv.includes("-w");

esbuild
  .build({
    entryPoints: ["./src/index.jsx"],
    outfile: "./dist/bundle.js",
    minify: true,
    bundle: true,
    define: { "process.env.NODE_ENV": "'production'" },
    sourcemap: true,
    watch: isWatch && {
      onRebuild(err) {
        serve.update();
        err ? error("× Failed") : log("✓ Updated");
      },
    },
  })
  .catch(() => process.exit(1));

if (isWatch) {
  serve.start({
    port: 8080,
    root: ".",
  });
}
