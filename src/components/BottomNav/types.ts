import type { LucideIcon } from 'lucide-react';

export interface Tab {
    id: 'plants' | 'identify' | 'care' | 'settings';
    label: string;
    icon: LucideIcon;
    href: string;
}
