/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "qjhkjpgbidjkywtgvmig.supabase.co"
    ],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;