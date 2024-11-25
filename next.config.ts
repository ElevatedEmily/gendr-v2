import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_SECRET: "/nIaTbc+EXyu/w6DI1NmKMWUY1yuT63rqGxtKPF8HgU=", // This is okay
  },
};

export default nextConfig;
