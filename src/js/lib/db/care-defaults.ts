// Types
import type { CareSchedule } from '../../types';

/** Species keyword → recommended care schedule. First match wins; fallback is a safe generic. */
const CARE_DEFAULTS: { match: RegExp; care: CareSchedule; }[] = [{
    match: /monstera|philodendron|pothos|epipremnum|scindapsus/i,
    care: {
        waterEveryDays: 7,
        fertilizeEveryDays: 30,
        repotEveryMonths: 18
    }
}, {
    match: /sansevieria|dracaena trifasciata|snake plant|zamioculcas|zz/i,
    care: {
        waterEveryDays: 18,
        fertilizeEveryDays: 60,
        repotEveryMonths: 30
    }
}, {
    match: /cact|echeveria|haworthia|aloe|crassula|succulent|sedum/i,
    care: {
        waterEveryDays: 16,
        fertilizeEveryDays: 90,
        repotEveryMonths: 24
    }
}, {
    match: /fern|nephrolepis|adiantum|asplenium/i,
    care: {
        waterEveryDays: 4,
        fertilizeEveryDays: 30,
        repotEveryMonths: 12
    }
}, {
    match: /calathea|maranta|goeppertia|stromanthe/i,
    care: {
        waterEveryDays: 5,
        fertilizeEveryDays: 30,
        repotEveryMonths: 12
    }
}, {
    match: /ficus|fiddle|elastica|benjamina|lyrata/i,
    care: {
        waterEveryDays: 9,
        fertilizeEveryDays: 30,
        repotEveryMonths: 18
    }
}, {
    match: /orchid|phalaenopsis/i,
    care: {
        waterEveryDays: 8,
        fertilizeEveryDays: 21,
        repotEveryMonths: 24
    }
}, {
    match: /spathiphyllum|peace lily/i,
    care: {
        waterEveryDays: 6,
        fertilizeEveryDays: 45,
        repotEveryMonths: 18
    }
}, {
    match: /chlorophytum|spider plant/i,
    care: {
        waterEveryDays: 7,
        fertilizeEveryDays: 30,
        repotEveryMonths: 12
    }
}, {
    match: /herb|basil|ocimum|mentha|mint|petroselinum|parsley/i,
    care: {
        waterEveryDays: 2,
        fertilizeEveryDays: 21,
        repotEveryMonths: 6
    }
}];

const FALLBACK_CARE: CareSchedule = {
    waterEveryDays: 7,
    fertilizeEveryDays: 30,
    repotEveryMonths: 18
};

export function defaultCareFor(species: string, commonName = ''): CareSchedule {
    const hay = `${species} ${commonName}`;
    const hit = CARE_DEFAULTS.find((entry) => {
        return entry.match.test(hay);
    });

    return hit
        ? {
                ...hit.care
            }
        : {
                ...FALLBACK_CARE
            };
}
