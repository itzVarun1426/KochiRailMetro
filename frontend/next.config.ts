import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },

  // Force Webpack instead of Turbopack
  experimental: {
    turbo: false,
  },

  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;





// import type { NextConfig } from "next";
// import path from "path";

// const nextConfig: NextConfig = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "placehold.co",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "images.unsplash.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "picsum.photos",
//         pathname: "/**",
//       },
//     ],
//   },

//   // 👇 Force correct root for Next.js (important for Vercel builds)
//   experimental: {
//     turbo: {
//       root: path.join(__dirname),
//     },
//   },

//   // 👇 Avoid "require.extensions" warnings
//   webpack: (config) => {
//     config.resolve.fallback = { fs: false };
//     return config;
//   },
// };

// export default nextConfig;
