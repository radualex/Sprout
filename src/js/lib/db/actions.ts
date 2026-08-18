'use server';

import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';

// Database
import { database } from '@/js/lib/db';
import { plants } from '@/js/lib/db/schema';

// Auth
import { requireUser } from '@/js/lib/auth/session';

// Types
import { CareKind, type CareSchedule, type PlantInput } from '@/js/types';

const ALL_PATH = '/';

export const createPlant = async (input: PlantInput): Promise<string> => {
    const session = await requireUser();
    const now = Date.now();
    const photo = input.photo ? Buffer.from(await input.photo.arrayBuffer()) : undefined;
    const [row] = await database
        .insert(plants)
        .values({
            userId: session.user.id,
            nickname: input.nickname,
            species: input.species,
            commonName: input.commonName,
            acquiredAt: input.acquiredAt,
            care: input.care,
            lastCare: {
                [CareKind.Water]: now,
                [CareKind.Fertilize]: now,
                [CareKind.Repot]: now
            },
            lastNotified: {},
            notes: '',
            photo
        })
        .returning({
            id: plants.id
        });
    revalidatePath(ALL_PATH, 'layout');

    return row.id;
};

export const updatePlant = async (id: string, input: { nickname: string; care: CareSchedule; }): Promise<void> => {
    const session = await requireUser();
    await database
        .update(plants)
        .set({
            nickname: input.nickname,
            care: input.care
        })
        .where(and(eq(plants.id, id), eq(plants.userId, session.user.id)));
    revalidatePath(ALL_PATH, 'layout');
};

export const markCareDone = async (id: string, kind: CareKind): Promise<void> => {
    const session = await requireUser();
    const rows = await database
        .select({
            lastCare: plants.lastCare
        })
        .from(plants)
        .where(and(eq(plants.id, id), eq(plants.userId, session.user.id)));
    const row = rows.at(0);

    if (!row) {
        return;
    }

    await database
        .update(plants)
        .set({
            lastCare: {
                ...row.lastCare,
                [kind]: Date.now()
            }
        })
        .where(eq(plants.id, id));
    revalidatePath(ALL_PATH, 'layout');
};

export const recordNotified = async (id: string, kind: CareKind, at: number): Promise<void> => {
    const session = await requireUser();
    const rows = await database
        .select({
            lastNotified: plants.lastNotified
        })
        .from(plants)
        .where(and(eq(plants.id, id), eq(plants.userId, session.user.id)));
    const row = rows.at(0);

    if (!row) {
        return;
    }

    await database
        .update(plants)
        .set({
            lastNotified: {
                ...row.lastNotified,
                [kind]: at
            }
        })
        .where(eq(plants.id, id));
};

export const deletePlant = async (id: string): Promise<void> => {
    const session = await requireUser();
    await database
        .delete(plants)
        .where(and(eq(plants.id, id), eq(plants.userId, session.user.id)));
    revalidatePath(ALL_PATH, 'layout');
};
