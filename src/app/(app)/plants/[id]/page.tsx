import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Components
import PlantDetail from '@/containers/PlantDetail';

// Helpers
import { displayName } from '@/helpers/plant';

// Database
import { getPlantForUser } from '@/lib/db/queries';

// Auth
import { requireUser } from '@/lib/auth/session';

// Types
import type { PageParameters } from './types';

interface Props {
    params: Promise<PageParameters>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const session = await requireUser();
    const plant = await getPlantForUser(session.user.id, id);

    if (!plant) {
        return {
            title: 'Plant not found'
        };
    }

    return {
        title: displayName(plant),
        description: 'Care schedule, photo and details for this plant.'
    };
};

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
