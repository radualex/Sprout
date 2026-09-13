import { describe, expect, it } from 'vitest';

// Constants
import { PLANT_ID_SCHEMA } from '@/lib/db/constants';

// Services
import { CareKindSchema, CareScheduleSchema, NotifiedAtSchema, PlantInputSchema, UpdatePlantSchema } from './schema';

// Types
import { CareKind } from '@/types';

const VALID_CARE = {
    waterEveryDays: 7,
    fertilizeEveryDays: 30,
    repotEveryMonths: 18
};

const VALID_INPUT = {
    nickname: 'Kitchen monstera',
    species: 'Monstera deliciosa',
    commonName: 'Swiss cheese plant',
    care: VALID_CARE,
    acquiredAt: 1_700_000_000_000
};

const VALID_ID = '123e4567-e89b-42d3-a456-426614174000';

describe('CareKindSchema', () => {
    it.each([CareKind.Water, CareKind.Fertilize, CareKind.Repot])('accepts %s', (kind) => {
        expect(CareKindSchema.parse(kind)).toBe(kind);
    });

    it('rejects an unknown kind', () => {
        expect(() => {
            return CareKindSchema.parse('sun');
        }).toThrow();
    });
});

describe('CareScheduleSchema', () => {
    it('accepts a valid schedule', () => {
        expect(CareScheduleSchema.parse(VALID_CARE)).toEqual(VALID_CARE);
    });

    it('rejects a negative interval', () => {
        expect(() => {
            return CareScheduleSchema.parse({
                ...VALID_CARE,
                waterEveryDays: -1
            });
        }).toThrow();
    });

    it('rejects a float interval', () => {
        expect(() => {
            return CareScheduleSchema.parse({
                ...VALID_CARE,
                waterEveryDays: 1.5
            });
        }).toThrow();
    });

    it('rejects an interval over the day maximum', () => {
        expect(() => {
            return CareScheduleSchema.parse({
                ...VALID_CARE,
                fertilizeEveryDays: 3651
            });
        }).toThrow();
    });

    it('rejects an interval over the month maximum', () => {
        expect(() => {
            return CareScheduleSchema.parse({
                ...VALID_CARE,
                repotEveryMonths: 601
            });
        }).toThrow();
    });
});

describe('PlantInputSchema', () => {
    it('accepts a full valid object without a photo', () => {
        expect(PlantInputSchema.parse(VALID_INPUT)).toEqual(VALID_INPUT);
    });

    it('accepts a Blob photo', () => {
        const parsed = PlantInputSchema.parse({
            ...VALID_INPUT,
            photo: new Blob(['x'])
        });

        expect(parsed.photo).toBeInstanceOf(Blob);
    });

    it('trims the nickname', () => {
        const parsed = PlantInputSchema.parse({
            ...VALID_INPUT,
            nickname: '  Fern  '
        });

        expect(parsed.nickname).toBe('Fern');
    });

    it('rejects an empty nickname', () => {
        expect(() => {
            return PlantInputSchema.parse({
                ...VALID_INPUT,
                nickname: ''
            });
        }).toThrow();
    });

    it('rejects a whitespace-only nickname', () => {
        expect(() => {
            return PlantInputSchema.parse({
                ...VALID_INPUT,
                nickname: ' '.repeat(3)
            });
        }).toThrow();
    });

    it('rejects a missing species', () => {
        expect(() => {
            return PlantInputSchema.parse({
                ...VALID_INPUT,
                species: undefined
            });
        }).toThrow();
    });

    it('rejects text over the length maximum', () => {
        expect(() => {
            return PlantInputSchema.parse({
                ...VALID_INPUT,
                nickname: 'a'.repeat(201)
            });
        }).toThrow();
    });

    it('rejects a non-Blob photo', () => {
        expect(() => {
            return PlantInputSchema.parse({
                ...VALID_INPUT,
                photo: 'not-a-blob'
            });
        }).toThrow();
    });

    it('rejects a float acquiredAt', () => {
        expect(() => {
            return PlantInputSchema.parse({
                ...VALID_INPUT,
                acquiredAt: 1.5
            });
        }).toThrow();
    });

    it('rejects a negative acquiredAt', () => {
        expect(() => {
            return PlantInputSchema.parse({
                ...VALID_INPUT,
                acquiredAt: -1
            });
        }).toThrow();
    });

    it('strips unknown keys', () => {
        const parsed = PlantInputSchema.parse({
            ...VALID_INPUT,
            extra: 'ignored'
        });

        expect(parsed).toEqual(VALID_INPUT);
        expect(parsed).not.toHaveProperty('extra');
    });
});

describe('PLANT_ID_SCHEMA', () => {
    it('accepts a UUID', () => {
        expect(PLANT_ID_SCHEMA.parse(VALID_ID)).toBe(VALID_ID);
    });

    it('rejects a non-UUID id', () => {
        expect(() => {
            return PLANT_ID_SCHEMA.parse('plant-1');
        }).toThrow();
    });
});

describe('UpdatePlantSchema', () => {
    it('accepts a nickname and care schedule', () => {
        expect(UpdatePlantSchema.parse({
            nickname: 'Fern',
            care: VALID_CARE
        })).toEqual({
            nickname: 'Fern',
            care: VALID_CARE
        });
    });

    it('rejects an empty nickname', () => {
        expect(() => {
            return UpdatePlantSchema.parse({
                nickname: '',
                care: VALID_CARE
            });
        }).toThrow();
    });
});

describe('NotifiedAtSchema', () => {
    it('accepts a non-negative integer', () => {
        expect(NotifiedAtSchema.parse(1_700_000_000_000)).toBe(1_700_000_000_000);
    });

    it('rejects a float', () => {
        expect(() => {
            return NotifiedAtSchema.parse(1.5);
        }).toThrow();
    });

    it('rejects a negative timestamp', () => {
        expect(() => {
            return NotifiedAtSchema.parse(-1);
        }).toThrow();
    });
});
