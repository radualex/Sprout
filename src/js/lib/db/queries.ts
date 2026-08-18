import { and, desc, eq } from 'drizzle-orm';

// Database
import { database } from '@/js/lib/db';
import { plants } from '@/js/lib/db/schema';

// Types
import type { Plant } from '@/js/types';

type PlantRow = typeof plants.$inferSelect;

const rowToPlant = (row: PlantRow): Plant => {
    return {
        id: row.id,
        nickname: row.nickname,
        species: row.species,
        commonName: row.commonName,
        photo: row.photo ? `/plants/${row.id}/photo` : undefined,
        acquiredAt: row.acquiredAt,
        care: row.care,
        lastCare: row.lastCare,
        lastNotified: row.lastNotified,
        notes: row.notes
    };
};

export const getPlantsForUser = async (userId: string): Promise<Plant[]> => {
    const rows = await database
        .select()
        .from(plants)
        .where(eq(plants.userId, userId))
        .orderBy(desc(plants.acquiredAt));

    return rows.map((row) => {
        return rowToPlant(row);
    });
};

export const getPlantForUser = async (userId: string, id: string): Promise<Plant | undefined> => {
    const rows = await database
        .select()
        .from(plants)
        .where(and(eq(plants.id, id), eq(plants.userId, userId)));
    const row = rows.at(0);

    return row ? rowToPlant(row) : undefined;
};

export const getPlantPhoto = async (userId: string, id: string): Promise<Buffer | undefined> => {
    const rows = await database
        .select({
            photo: plants.photo
        })
        .from(plants)
        .where(and(eq(plants.id, id), eq(plants.userId, userId)));
    const row = rows.at(0);

    return row?.photo ?? undefined;
};
