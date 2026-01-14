import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://10.137.237.231:3000', 'http://192.168.*.*:3000', 'http://10.*.*.*:3000'],
};

export default nextConfig;
