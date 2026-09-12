import { describe, expect, it } from 'vitest';
import { makePlant, NOW } from '@test/vitest/data/plant.mock';

// Helpers
import { allTasks, DAY_MS, DAYS_PER_MONTH, dueTasks, formatDue, nextDue } from './index';

// Types
import { CareKind } from '@/types';

const WATER_ONLY = {
    waterEveryDays: 7,
    fertilizeEveryDays: 0,
    repotEveryMonths: 0
};

const NO_CARE = {
    waterEveryDays: 0,
    fertilizeEveryDays: 0,
    repotEveryMonths: 0
};

const lastCareAt = (at: number): Record<CareKind, number> => {
    return {
        [CareKind.Water]: at,
        [CareKind.Fertilize]: at,
        [CareKind.Repot]: at
    };
};

const FORMAT_DUE_CASES: [number, string][] = [
    [-2, '2 days overdue'],
    [-1, '1 day overdue'],
    [0, 'due today'],
    [1, 'tomorrow'],
    [5, 'in 5 days'],
    [30, 'in ~1 month'],
    [45, 'in ~2 months']
];

describe('nextDue', () => {
    it('returns undefined when the interval is zero', () => {
        const plant = makePlant({
            care: NO_CARE,
            lastCare: lastCareAt(NOW)
        });

        expect(nextDue(plant, CareKind.Water)).toBeUndefined();
        expect(nextDue(plant, CareKind.Fertilize)).toBeUndefined();
        expect(nextDue(plant, CareKind.Repot)).toBeUndefined();
    });

    it('returns lastCare plus the day interval', () => {
        const last = NOW - 3 * DAY_MS;
        const plant = makePlant({
            care: WATER_ONLY,
            lastCare: lastCareAt(last)
        });

        expect(nextDue(plant, CareKind.Water)).toBe(last + 7 * DAY_MS);
    });

    it('returns lastCare plus the month interval', () => {
        const last = NOW - 40 * DAY_MS;
        const plant = makePlant({
            care: {
                waterEveryDays: 0,
                fertilizeEveryDays: 0,
                repotEveryMonths: 3
            },
            lastCare: lastCareAt(last)
        });

        expect(nextDue(plant, CareKind.Repot)).toBe(last + 3 * DAYS_PER_MONTH * DAY_MS);
    });
});

describe('formatDue', () => {
    it.each(FORMAT_DUE_CASES)('formats %i as "%s"', (daysUntil, expected) => {
        expect(formatDue(daysUntil)).toBe(expected);
    });
});

describe('dueTasks', () => {
    it('includes an overdue task and excludes a future one', () => {
        const overdue = makePlant({
            id: 'plant-overdue',
            care: WATER_ONLY,
            lastCare: lastCareAt(NOW - 10 * DAY_MS)
        });
        const future = makePlant({
            id: 'plant-future',
            care: WATER_ONLY,
            lastCare: lastCareAt(NOW - DAY_MS)
        });

        const tasks = dueTasks([overdue, future], NOW);
        const [overdueTask] = tasks;

        expect(tasks).toHaveLength(1);
        expect(overdueTask.plant.id).toBe('plant-overdue');
        expect(overdueTask.kind).toBe(CareKind.Water);
    });
});

describe('allTasks', () => {
    it('sorts tasks soonest first across plants', () => {
        const soon = makePlant({
            id: 'plant-soon',
            care: WATER_ONLY,
            lastCare: lastCareAt(NOW - 6 * DAY_MS)
        });
        const later = makePlant({
            id: 'plant-later',
            care: WATER_ONLY,
            lastCare: lastCareAt(NOW - DAY_MS)
        });

        const tasks = allTasks([later, soon], NOW);
        const [first, second] = tasks;

        expect(tasks.map((task) => {
            return task.plant.id;
        })).toEqual(['plant-soon', 'plant-later']);
        expect(first.daysUntil).toBeLessThan(second.daysUntil);
    });
});
