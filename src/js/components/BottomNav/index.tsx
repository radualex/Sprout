'use client';

import classNames from 'classnames';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';
import { Camera, Droplets, Settings, Sprout, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

// Styles
import styles from './styles.module.scss';

interface Tab {
    id: 'plants' | 'identify' | 'care' | 'settings';
    label: string;
    icon: LucideIcon;
    href: string;
}

const TABS: Tab[] = [{
    id: 'plants',
    label: 'My Plants',
    icon: Sprout,
    href: '/'
}, {
    id: 'identify',
    label: 'Identify',
    icon: Camera,
    href: '/identify'
}, {
    id: 'care',
    label: 'Care',
    icon: Droplets,
    href: '/care'
}, {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings'
}];

interface Props extends React.ComponentProps<'nav'> {
    dueCount: number;
}

export const BottomNav: React.FunctionComponent<Props> = ({ dueCount, ...props }) => {
    const pathname = usePathname();

    const isActive = useCallback((tab: Tab): boolean => {
        if (tab.id === 'plants') {
            return pathname === '/' || pathname.startsWith('/plants');
        }

        return pathname === tab.href;
    }, [pathname]);

    const navLinks = useMemo(() => {
        return TABS.map((tab) => {
            const isTabActive = isActive(tab);
            const linkClasses = classNames({
                [styles.active]: isTabActive
            });

            return (
                <Link key={tab.id} href={tab.href} className={linkClasses}>
                    <span className={styles.icon}>
                        <tab.icon size={22} />
                    </span>
                    {tab.label}
                    {tab.id === 'care' && dueCount > 0 && (
                        <span className={styles.badge}>
                            {dueCount}
                        </span>
                    )}
                </Link>
            );
        });
    }, [isActive, dueCount]);

    return (
        <nav className={styles.bottomNav} {...props}>
            {navLinks}
        </nav>
    );
};
