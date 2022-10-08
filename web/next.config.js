/**
 * @type {import('next').NextConfig}
 */

const path = require("path");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  async redirects(){
    return [
      {
        source: "/#",
        destination: "/",
        permanent: true,
      },
    ];
  }
})
