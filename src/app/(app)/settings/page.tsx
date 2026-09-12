// Components
import { SettingsScreen } from '@/containers/SettingsScreen';

// Database
import { getPlantsForUser } from '@/lib/db/queries';

// Auth
import { requireUser } from '@/lib/auth/session';

const SettingsPage = async () => {
    const session = await requireUser();
    const plants = await getPlantsForUser(session.user.id);
    const user = {
        name: session.user.name,
        email: session.user.email
    };

    return (
        <SettingsScreen plants={plants} user={user} />
    );
};

export default SettingsPage;
