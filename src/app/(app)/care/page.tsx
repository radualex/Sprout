// Components
import { CareScreen } from '@/containers/CareScreen';

// Database
import { getPlantsForUser } from '@/lib/db/queries';

// Auth
import { requireUser } from '@/lib/auth/session';

const CarePage = async () => {
    const session = await requireUser();
    const plants = await getPlantsForUser(session.user.id);

    return <CareScreen plants={plants} />;
};

export default CarePage;
