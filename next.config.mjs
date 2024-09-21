/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WEBRISK_API_KEY: process.env.WEBRISK_API_KEY,
  },
};

export default nextConfig;
