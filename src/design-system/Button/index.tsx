'use client';

import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import type { LucideIcon } from 'lucide-react';

// Constants
import { ButtonSize, ButtonVariant } from './constants';

// Styles
import styles from './styles.module.scss';

interface Props extends React.ComponentProps<'button'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    block?: boolean;
    grow?: boolean;
    href?: string;
    icon?: LucideIcon;
}

export const Button: React.FunctionComponent<Props> = ({ variant = ButtonVariant.Default, size = ButtonSize.Md, block = false, grow = false, className, href = '', type = 'button', icon: Icon, children, ...props }) => {
    const classes = classNames(styles.root, {
        [styles[variant]]: variant,
        [styles.block]: block,
        [styles.grow]: grow,
        [styles.sm]: size === ButtonSize.Sm
    }, className);

    const renderContent = () => {
        return (
            <React.Fragment>
                {Icon && <Icon size={16} />}
                {children}
            </React.Fragment>
        );
    };

    if (variant === ButtonVariant.Link) {
        return (
            <Link href={href} className={classes}>
                {renderContent()}
            </Link>
        );
    }

    return (
        <button type={type} className={classes} {...props}>
            {renderContent()}
        </button>
    );
};
