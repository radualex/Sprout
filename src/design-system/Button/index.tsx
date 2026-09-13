'use client';

import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

// Constants
import { ButtonSize, ButtonVariant } from './constants';

// Styles
import styles from './styles.module.css';

// Types
import type { AnchorProps, ButtonProps } from './types';

export type Props = ButtonProps | AnchorProps;

const Button: React.FunctionComponent<Props> = ({ variant = ButtonVariant.Default, size = ButtonSize.Md, block = false, grow = false, className, icon: Icon, children, ...props }) => {
    const classes = classNames(styles.root, {
        [styles[variant]]: variant,
        [styles.block]: block,
        [styles.grow]: grow,
        [styles.sm]: size === ButtonSize.Sm
    }, className);

    const renderContent = () => {
        return (
            <React.Fragment>
                {Icon && <Icon size="1rem" aria-hidden />}
                {children}
            </React.Fragment>
        );
    };

    if (props.href !== undefined) {
        return (
            <Link className={classes} {...props}>
                {renderContent()}
            </Link>
        );
    }

    return (
        <button {...props} type={props.type ?? 'button'} className={classes}>
            {renderContent()}
        </button>
    );
};

export default Button;
