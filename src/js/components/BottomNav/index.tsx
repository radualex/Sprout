'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Styles
import styles from './styles.module.scss';

interface Tab {
    id: 'plants' | 'identify' | 'care' | 'settings';
    label: string;
    icon: string;
    href: string;
}

const TABS: Tab[] = [{
    id: 'plants',
    label: 'My Plants',
    icon: '🪴',
    href: '/'
}, {
    id: 'identify',
    label: 'Identify',
    icon: '📷',
    href: '/identify'
}, {
    id: 'care',
    label: 'Care',
    icon: '💧',
    href: '/care'
}, {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    href: '/settings'
}];

interface Props {
    dueCount: number;
}

export const BottomNav: React.FunctionComponent<Props> = ({ dueCount }) => {
    const pathname = usePathname();

    const isActive = (tab: Tab): boolean => {
        if (tab.id === 'plants') {
            return pathname === '/' || pathname.startsWith('/plants');
        }

        return pathname === tab.href;
    };

    return (
        <nav className={styles.bottomNav}>
            {TABS.map((tab) => {
                const isTabActive = isActive(tab);

                return (
                    <Link key={tab.id} href={tab.href} className={isTabActive ? styles.active : ''}>
                        <span className={styles.icon}>{tab.icon}</span>
                        {tab.label}
                        {tab.id === 'care' && dueCount > 0 && (
                            <span className={styles.badge}>{dueCount}</span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
};
