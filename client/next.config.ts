import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
       remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" },{
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
        pathname: "/**",
      },],
     },

     async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
