import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: {
            // Camera photos (and identify captures) exceed the 1MB default.
            bodySizeLimit: '5mb'
        }
    }
};

export default nextConfig;
