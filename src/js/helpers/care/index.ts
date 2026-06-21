import type { CareKind, CareSchedule, Plant } from '../../types';
import { CARE_DEFAULTS, DAY_MS } from './constants';
import type { CareTask } from './types';

export { DAY_MS, CARE_META } from './constants';
export type { CareTask } from './types';

function intervalMs(plant: Plant, kind: CareKind): number {
    const c = plant.care;
    if (kind === 'water') return c.waterEveryDays * DAY_MS;
    if (kind === 'fertilize') return c.fertilizeEveryDays * DAY_MS;
    return c.repotEveryMonths * 30 * DAY_MS;
}

export function nextDue(plant: Plant, kind: CareKind): number | null {
    const interval = intervalMs(plant, kind);
    if (interval <= 0) return null;
    return plant.lastCare[kind] + interval;
}

/** All tasks across plants, soonest first. */
export function allTasks(plants: Plant[], now = Date.now()): CareTask[] {
    const tasks: CareTask[] = [];
    for (const plant of plants) {
        for (const kind of ['water', 'fertilize', 'repot'] as CareKind[]) {
            const dueAt = nextDue(plant, kind);
            if (dueAt === null) continue;
            tasks.push({
                plant,
                kind,
                dueAt,
                daysUntil: Math.ceil((dueAt - now) / DAY_MS)
            });
        }
    }
    return tasks.sort((a, b) => { return a.dueAt - b.dueAt; });
}

export function dueTasks(plants: Plant[], now = Date.now()): CareTask[] {
    return allTasks(plants, now).filter((t) => { return t.dueAt <= now; });
}

export function formatDue(daysUntil: number): string {
    if (daysUntil < -1) return `${-daysUntil} days overdue`;
    if (daysUntil === -1) return '1 day overdue';
    if (daysUntil <= 0) return 'due today';
    if (daysUntil === 1) return 'tomorrow';
    if (daysUntil < 30) return `in ${daysUntil} days`;
    const months = Math.round(daysUntil / 30);
    return months === 1 ? 'in ~1 month' : `in ~${months} months`;
}

/** Care defaults by species keyword. First match wins; fallback is a safe generic. */
export function defaultCareFor(species: string, commonName = ''): CareSchedule {
    const hay = `${species} ${commonName}`;
    const hit = CARE_DEFAULTS.find((d) => { return d.match.test(hay); });
    return hit
        ? { ...hit.care }
        : { waterEveryDays: 7,
                fertilizeEveryDays: 30,
                repotEveryMonths: 18 };
}
