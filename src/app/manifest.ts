import type { MetadataRoute } from 'next';

const manifest = (): MetadataRoute.Manifest => {
    return {
        name: 'Sprout — Plant Tracker',
        short_name: 'Sprout',
        description: 'Track your houseplants, identify species with your camera, and never miss a watering.',
        start_url: '/',
        display: 'standalone',
        background_color: '#f4f1e8',
        theme_color: '#1d3b2a',
        orientation: 'portrait',
        icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }]
    };
};

export default manifest;
