import classNames from 'classnames';
import localFont from 'next/font/local';
import type { Metadata, Viewport } from 'next';

// Components
import SiteCore from '@/components/SiteCore';

// Styles
import './globals.css';

const font = localFont({
    src: '../assets/fonts/manrope/Manrope-latin.woff2',
    variable: '--font-manrope',
    display: 'swap'
});

export const metadata: Metadata = {
    title: {
        default: 'Sprout — Plant Tracker',
        template: '%s · Sprout'
    },
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

interface Props extends React.ComponentProps<'html'> {
    children: React.ReactNode;
}

const RootLayout = ({ children, className, ...props }: Props) => {
    const classes = classNames(className, font.variable);

    return (
        <html lang="en" {...props} className={classes}>
            <body>
                <SiteCore>
                    {children}
                </SiteCore>
            </body>
        </html>
    );
};

export default RootLayout;
