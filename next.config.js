/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qjhkjpgbidjkywtgvmig.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/kos-images/**',
      }
    ],
  },
}

module.exports = nextConfig