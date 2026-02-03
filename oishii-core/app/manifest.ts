import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Oishii - Recipe Collection',
        short_name: 'Oishii',
        description: 'Your personal recipe collection app',
        start_url: '/',
        display: 'standalone',
        background_color: '#fffbf5',
        theme_color: '#f97316',
        orientation: 'portrait',
        icons: [
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/logo.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}
