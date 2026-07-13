/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mxbpflnjgzvxwkyubpnm.supabase.co",
      },
    ],
  },
};

export default nextConfig;
