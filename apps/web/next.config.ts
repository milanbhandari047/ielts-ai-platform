// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  // Allow backend uploads to be served in dev
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ??
          "http://localhost:8000"
        }/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
