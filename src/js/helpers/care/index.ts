// Constants
import { DAY_MS } from './constants';

// Types
import { CareKind, type Plant } from '@/js/types';
import type { CareTask } from './types';

export { DAY_MS, CARE_META } from './constants';
export type { CareTask } from './types';

const intervalMs = (plant: Plant, kind: CareKind): number => {
    const c = plant.care;
    if (kind === CareKind.Water) {
        return c.waterEveryDays * DAY_MS;
    }
    if (kind === CareKind.Fertilize) {
        return c.fertilizeEveryDays * DAY_MS;
    }

    return c.repotEveryMonths * 30 * DAY_MS;
};

export const nextDue = (plant: Plant, kind: CareKind): number | undefined => {
    const interval = intervalMs(plant, kind);
    if (interval <= 0) {
        return undefined;
    }

    return plant.lastCare[kind] + interval;
};

const tasksForPlant = (plant: Plant, now: number): CareTask[] => {
    const tasks: CareTask[] = [];
    for (const kind of [CareKind.Water, CareKind.Fertilize, CareKind.Repot]) {
        const dueAt = nextDue(plant, kind);
        if (dueAt === undefined) {
            continue;
        }
        tasks.push({
            plant,
            kind,
            dueAt,
            daysUntil: Math.ceil((dueAt - now) / DAY_MS)
        });
    }

    return tasks;
};

/** All tasks across plants, soonest first. */
export const allTasks = (plants: Plant[], now = Date.now()): CareTask[] => {
    const tasks = plants.flatMap((plant) => {
        return tasksForPlant(plant, now);
    });

    return tasks.toSorted((a, b) => {
        return a.dueAt - b.dueAt;
    });
};

export const dueTasks = (plants: Plant[], now = Date.now()): CareTask[] => {
    return allTasks(plants, now).filter((t) => {
        return t.dueAt <= now;
    });
};

export const formatDue = (daysUntil: number): string => {
    if (daysUntil < -1) {
        return `${-daysUntil} days overdue`;
    }

    if (daysUntil === -1) {
        return '1 day overdue';
    }

    if (daysUntil <= 0) {
        return 'due today';
    }

    if (daysUntil === 1) {
        return 'tomorrow';
    }

    if (daysUntil < 30) {
        return `in ${daysUntil} days`;
    }

    const months = Math.round(daysUntil / 30);

    return months === 1 ? 'in ~1 month' : `in ~${months} months`;
};
