import * as z from 'zod';

// Types
import { CareKind, type PlantInput } from '@/types';

const MAX_TEXT_LENGTH = 200;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // keep in sync with next.config.ts bodySizeLimit '5mb'
const MAX_DAYS = 3650;
const MAX_MONTHS = 600;

export const CareKindSchema = z.enum(CareKind);

export const CareScheduleSchema = z.object({
    waterEveryDays: z.int().min(0).max(MAX_DAYS),
    fertilizeEveryDays: z.int().min(0).max(MAX_DAYS),
    repotEveryMonths: z.int().min(0).max(MAX_MONTHS)
});

export const PlantIdSchema = z.uuid();

// Realm-agnostic: survives React Flight/Next serialization (File is a Blob).
const photoSchema = z.custom<Blob>((value) => {
    return typeof value === 'object'
        && value !== null
        && typeof (value as Blob).arrayBuffer === 'function'
        && typeof (value as Blob).size === 'number'
        && (value as Blob).size <= MAX_PHOTO_BYTES;
}, {
    message: 'Photo must be a Blob no larger than 5 MB.'
});

export const PlantInputSchema = z.object({
    nickname: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
    species: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
    commonName: z.string().trim().max(MAX_TEXT_LENGTH),
    care: CareScheduleSchema,
    photo: photoSchema.optional(),
    acquiredAt: z.int().nonnegative()
});

/** Compile-time assertion that the schema output still matches the shared client contract. */
export const parsePlantInput = (value: unknown): PlantInput => {
    return PlantInputSchema.parse(value);
};

export const UpdatePlantSchema = z.object({
    nickname: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
    care: CareScheduleSchema
});
export type UpdatePlantInput = z.infer<typeof UpdatePlantSchema>;

export const NotifiedAtSchema = z.int().nonnegative();
