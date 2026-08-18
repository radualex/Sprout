import type { Metadata, Viewport } from 'next';

// Components
import { SiteCore } from '@/js/components/SiteCore';

// Styles
import '@/js/scss/globals.scss';

export const metadata: Metadata = {
    title: 'Sprout — Plant Tracker',
    description: 'Track your houseplants, identify species with your camera, and never miss a watering.',
    applicationName: 'Sprout',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Sprout'
    },
    icons: {
        icon: '/icon.svg',
        apple: '/icon-192.png'
    }
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    userScalable: false,
    themeColor: '#1d3b2a'
};

interface Props {
    children: React.ReactNode;
}

const RootLayout = ({ children }: Props) => {
    return (
        <html lang="en">
            <body>
                <SiteCore>
                    {children}
                </SiteCore>
            </body>
        </html>
    );
};

export default RootLayout;
