'use client';

import classNames from 'classnames';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';

// Constants
import { TABS } from './constants';

// Styles
import styles from './styles.module.scss';

// Types
import type { Tab } from './types';

export interface Props extends React.ComponentProps<'nav'> {
    dueCount: number;
}

const BottomNav: React.FunctionComponent<Props> = ({ dueCount, ...props }) => {
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
        <nav className={styles.root} {...props}>
            {navLinks}
        </nav>
    );
};

export default BottomNav;
