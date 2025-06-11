/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images:
    {
        domains: ['192.168.1.95', 'smptesting.blob.core.windows.net', 'localhost', 'almdigital1.blob.core.windows.net', 'services-nexa.dportal.app'],
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
            {
                protocol: 'https',
                hostname: 'services-nexa.dportal.app',
                port: '',
                pathname: '/menu/**',
            },
        ],
    },
    compiler: {
        // ssr and displayName are configured by default
        styledComponents: true
    }
};

export default nextConfig;
