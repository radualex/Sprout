// Components
import { CareScreen } from '@/js/containers/CareScreen';

// Database
import { getPlantsForUser } from '@/js/lib/db/queries';

// Auth
import { requireUser } from '@/js/lib/auth/session';

const CarePage = async () => {
    const session = await requireUser();
    const plants = await getPlantsForUser(session.user.id);

    return <CareScreen plants={plants} />;
};

export default CarePage;
