const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});



module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  distDir: "out",
  compress: true,
});
