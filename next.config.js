/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    return config;
  },

  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "slbfjippcytxkwkoapjr.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
module.exports = nextConfig;
