// Database
import { getPlantPhoto } from '@/js/lib/db/queries';

// Auth
import { requireUser } from '@/js/lib/auth/session';

interface Props {
    params: Promise<{ id: string; }>;
}

export const GET = async (_request: Request, { params }: Props) => {
    const session = await requireUser();
    const { id } = await params;
    const photo = await getPlantPhoto(session.user.id, id);

    if (!photo) {
        return new Response('Not found', {
            status: 404
        });
    }

    return new Response(new Uint8Array(photo), {
        headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'private, max-age=3600'
        }
    });
};
