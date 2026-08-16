'use server';

import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';

// Lib
import { database } from '../db';
import { plants } from '../db/schema';
import { requireUser } from '../session';

// Types
import type { CareKind, CareSchedule, PlantInput } from '../../types';

const ALL_PATH = '/';

export async function createPlant(input: PlantInput): Promise<string> {
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
            lastCare: { water: now, fertilize: now, repot: now },
            lastNotified: {},
            notes: '',
            photo
        })
        .returning({ id: plants.id });
    revalidatePath(ALL_PATH, 'layout');
    return row.id;
}

export async function updatePlant(id: string, input: { nickname: string; care: CareSchedule; }): Promise<void> {
    const session = await requireUser();
    await database
        .update(plants)
        .set({ nickname: input.nickname, care: input.care })
        .where(and(eq(plants.id, id), eq(plants.userId, session.user.id)));
    revalidatePath(ALL_PATH, 'layout');
}

export async function markCareDone(id: string, kind: CareKind): Promise<void> {
    const session = await requireUser();
    const rows = await database
        .select({ lastCare: plants.lastCare })
        .from(plants)
        .where(and(eq(plants.id, id), eq(plants.userId, session.user.id)));
    const row = rows.at(0);
    if (!row) return;
    await database
        .update(plants)
        .set({ lastCare: { ...row.lastCare, [kind]: Date.now() } })
        .where(eq(plants.id, id));
    revalidatePath(ALL_PATH, 'layout');
}

export async function recordNotified(id: string, kind: CareKind, at: number): Promise<void> {
    const session = await requireUser();
    const rows = await database
        .select({ lastNotified: plants.lastNotified })
        .from(plants)
        .where(and(eq(plants.id, id), eq(plants.userId, session.user.id)));
    const row = rows.at(0);
    if (!row) return;
    await database
        .update(plants)
        .set({ lastNotified: { ...row.lastNotified, [kind]: at } })
        .where(eq(plants.id, id));
}

export async function deletePlant(id: string): Promise<void> {
    const session = await requireUser();
    await database
        .delete(plants)
        .where(and(eq(plants.id, id), eq(plants.userId, session.user.id)));
    revalidatePath(ALL_PATH, 'layout');
}
