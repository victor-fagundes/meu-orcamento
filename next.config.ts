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
  transpilePackages: ["@material/web", "lit"],
};

export default nextConfig;
