// Components
import { BottomNav } from '@/js/components/BottomNav';

// Helpers
import { dueTasks } from '@/js/helpers/care';

// Lib
import { getPlantsForUser } from '@/js/lib/queries/plants';
import { requireUser } from '@/js/lib/session';

// Styles
import styles from './styles.module.scss';

interface Props {
    children: React.ReactNode;
}

const AppLayout = async ({ children }: Props) => {
    const session = await requireUser();
    const plants = await getPlantsForUser(session.user.id);
    const dueCount = dueTasks(plants).length;

    return (
        <div className={styles.appShell}>
            {children}
            <BottomNav dueCount={dueCount} />
        </div>
    );
};

export default AppLayout;
