import { Camera, Droplets, Settings, Sprout } from 'lucide-react';

// Types
import type { Tab } from './types';

export const TABS: Tab[] = [{
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
