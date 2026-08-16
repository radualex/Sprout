// Components
import { CareScreen } from '@/js/containers/CareScreen';

// Lib
import { getPlantsForUser } from '@/js/lib/queries/plants';
import { requireUser } from '@/js/lib/session';

const CarePage = async () => {
    const session = await requireUser();
    const plants = await getPlantsForUser(session.user.id);

    return <CareScreen plants={plants} />;
};

export default CarePage;
