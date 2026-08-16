import { bigint, customType, index, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

// Schema
export { account, session, user, verification } from './auth-schema';
import { user } from './auth-schema';

// Types
import type { CareKind, CareSchedule } from '../../types';

/** Postgres `bytea` column. node-postgres already maps bytea <-> Buffer. */
const bytea = customType<{ data: Buffer; driverData: Buffer; }>({
    dataType: () => { return 'bytea'; },
    toDriver: (value: Buffer): Buffer => { return value; },
    fromDriver: (value: Buffer): Buffer => { return value; }
});

export const plants = pgTable(
    'plants',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        userId: text('user_id')
            .notNull()
            .references(() => { return user.id; }, {
                onDelete: 'cascade'
            }),
        nickname: text('nickname').notNull(),
        species: text('species').notNull(),
        commonName: text('common_name').notNull().default(''),
        photo: bytea('photo'),
        acquiredAt: bigint('acquired_at', {
            mode: 'number'
        }).notNull(),
        care: jsonb('care').$type<CareSchedule>().notNull(),
        lastCare: jsonb('last_care').$type<Record<CareKind, number>>().notNull(),
        lastNotified: jsonb('last_notified')
            .$type<Partial<Record<CareKind, number>>>()
            .notNull()
            .default({}),
        notes: text('notes').notNull().default('')
    },
    (table) => {
        return [index('plants_user_id_idx').on(table.userId)];
    }
);
