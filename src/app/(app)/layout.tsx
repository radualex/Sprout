import React from 'react';

// Components
import { BottomNav } from '@/js/components/BottomNav';

// Helpers
import { dueTasks } from '@/js/helpers/care';

// Lib
import { getPlantsForUser } from '@/js/lib/queries/plants';
import { requireUser } from '@/js/lib/session';

// Styles
import styles from './styles.module.scss';

interface Props extends React.ComponentProps<'div'> {}

const AppLayout: React.FunctionComponent<Props> = async ({ children, ...props }) => {
    const session = await requireUser();
    const plants = await getPlantsForUser(session.user.id);
    const dueCount = dueTasks(plants).length;

    return (
        <div className={styles.appShell} {...props}>
            {children}
            <BottomNav dueCount={dueCount} />
        </div>
    );
};

export default AppLayout;
