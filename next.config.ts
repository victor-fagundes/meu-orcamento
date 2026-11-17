import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  // PGlite WASM: fora do bundle (não colocar pglite em transpilePackages)
  serverExternalPackages: ["@electric-sql/pglite", "pdfjs-dist"],
  outputFileTracingIncludes: {
    "/app/ajustes": ["./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"],
  },
  transpilePackages: ["@material/web", "lit"],
};

export default nextConfig;
