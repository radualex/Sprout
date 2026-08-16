// Components
import { SettingsScreen } from '@/js/containers/SettingsScreen';

// Lib
import { getPlantsForUser } from '@/js/lib/queries/plants';
import { requireUser } from '@/js/lib/session';

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
