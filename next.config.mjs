/** @type {import('next').NextConfig} */
const nextConfig = {
    images:
    {
        domains: ['192.168.0.109', 'almdigital1.blob.core.windows.net', 'localhost'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '192.168.0.109',
                port: '',
                pathname: '/admin/icons/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '',
                pathname: '/admin/**',
            },
            {
                protocol: 'https',
                hostname: 'almdigital1.blob.core.windows.net',
                port: '',
                pathname: '/admin/despieces/**',
            },
        ],
    },
};

export default nextConfig;
