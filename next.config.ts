import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "app.admin.caprover-root.dishestolearn.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  
};

export default nextConfig;
