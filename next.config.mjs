/** @type {import('next').NextConfig} */
const nextConfig = {
    images:
    {
        domains: ['192.168.0.109', 'smptesting.blob.core.windows.net', 'localhost', 'almdigital1.blob.core.windows.net'],
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
    compiler:{
        // ssr and displayName are configured by default
        styledComponents:true
    }
};

export default nextConfig;
