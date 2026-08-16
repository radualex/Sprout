import { notFound } from 'next/navigation';

// Components
import { PlantDetail } from '@/js/containers/PlantDetail';

// Lib
import { getPlantForUser } from '@/js/lib/queries/plants';
import { requireUser } from '@/js/lib/session';

interface Props {
    params: Promise<{ id: string; }>;
}

const PlantDetailPage = async ({ params }: Props) => {
    const session = await requireUser();
    const { id } = await params;
    const plant = await getPlantForUser(session.user.id, id);
    if (!plant) notFound();

    return <PlantDetail plant={plant} />;
};

export default PlantDetailPage;
