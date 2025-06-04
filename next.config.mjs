/** @type {import('next').NextConfig} */
const nextConfig = {
  images:
  {
    domains: ['192.168.1.95', 'smptesting.blob.core.windows.net', 'localhost', 'almdigital1.blob.core.windows.net'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.1.95',
        port: '',
        pathname: '/menu/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/admin/**',
      },
      {
        protocol: 'https',
        hostname: 'smptesting.blob.core.windows.net',
        port: '',
        pathname: '/admin/despieces/**',
      },
      {
        protocol: 'https',
        hostname: 'almdigital1.blob.core.windows.net',
        port: '',
        pathname: '/admin/**',
      },
    ],
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
