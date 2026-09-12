import type { LucideIcon } from 'lucide-react';

// Constants
import type { ButtonVariant } from '@/design-system/Button/constants';

export interface Action {
    key: string;
    label: string;
    icon?: LucideIcon;
    variant: ButtonVariant;
    onClick: () => void;
    disabled?: boolean;
}
