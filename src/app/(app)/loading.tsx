import classNames from 'classnames';

// Styles
import styles from './loading.module.css';

const ROWS = [0, 1, 2];

interface Props extends React.ComponentProps<'div'> {}

const Loading = ({ className, ...props }: Props) => {
    const classes = classNames(className, styles.root);

    return (
        <div aria-busy="true" {...props} className={classes}>
            <header className={styles.header}>
                <div>
                    <div className={styles.title} />
                    <div className={styles.subtitle} />
                </div>
            </header>
            <div className={styles.list}>
                {ROWS.map((row) => {
                    return (
                        <div key={row} className={styles.row}>
                            <div className={styles.thumb} />
                            <div className={styles.lines}>
                                <div className={styles.lineTitle} />
                                <div className={styles.lineMeta} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Loading;
