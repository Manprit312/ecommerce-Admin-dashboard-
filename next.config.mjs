/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    // ✅ Allow localhost for dev + Cloudinary + external avatars/CDNs
    domains: [
      "localhost",
      "res.cloudinary.com", // Cloudinary direct domain support
        "via.placeholder.com",
    ],

    // ✅ Remote patterns — gives fine-grained host + path control
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
      },
      {
       protocol: "https",
        hostname: "via.placeholder.com", // ✅ added remote pattern too
      pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
