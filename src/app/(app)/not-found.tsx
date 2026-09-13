import classNames from 'classnames';
import Link from 'next/link';
import { Sprout } from 'lucide-react';

// Styles
import styles from './not-found.module.css';

interface Props extends React.ComponentProps<'div'> {}

const NotFound = ({ className, ...props }: Props) => {
    const classes = classNames(className, styles.root);

    return (
        <div {...props} className={classes}>
            <div className={styles.icon}>
                <Sprout size="3rem" />
            </div>
            <h1 className={styles.title}>Page not found</h1>
            <p>The page you are looking for could not be found.</p>
            <Link href="/" className={styles.home}>Back to my plants</Link>
        </div>
    );
};

export default NotFound;
