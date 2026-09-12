import { notFound } from 'next/navigation';

// Components
import { PlantDetail } from '@/containers/PlantDetail';

// Database
import { getPlantForUser } from '@/lib/db/queries';

// Auth
import { requireUser } from '@/lib/auth/session';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

const PlantDetailPage = async ({ params }: Props) => {
    const session = await requireUser();
    const { id } = await params;
    const plant = await getPlantForUser(session.user.id, id);

    if (!plant) {
        notFound();
    }

    return <PlantDetail plant={plant} />;
};

export default PlantDetailPage;
