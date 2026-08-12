// Types
import type { CareKind, CareSchedule } from '../../types';

export const DAY_MS = 24 * 60 * 60 * 1000;

export const CARE_META: Record<CareKind, { label: string; verb: string; emoji: string; }> = {
    water: { label: 'Water',
        verb: 'watered',
        emoji: '💧' },
    fertilize: { label: 'Fertilise',
        verb: 'fertilised',
        emoji: '🌿' },
    repot: { label: 'Repot',
        verb: 'repotted',
        emoji: '🪴' }
};

export const CARE_DEFAULTS: { match: RegExp; care: CareSchedule; }[] = [{ match: /monstera|philodendron|pothos|epipremnum|scindapsus/i,
    care: { waterEveryDays: 7,
        fertilizeEveryDays: 30,
        repotEveryMonths: 18 } }, { match: /sansevieria|dracaena trifasciata|snake plant|zamioculcas|zz/i,
    care: { waterEveryDays: 18,
        fertilizeEveryDays: 60,
        repotEveryMonths: 30 } }, { match: /cact|echeveria|haworthia|aloe|crassula|succulent|sedum/i,
    care: { waterEveryDays: 16,
        fertilizeEveryDays: 90,
        repotEveryMonths: 24 } }, { match: /fern|nephrolepis|adiantum|asplenium/i,
    care: { waterEveryDays: 4,
        fertilizeEveryDays: 30,
        repotEveryMonths: 12 } }, { match: /calathea|maranta|goeppertia|stromanthe/i,
    care: { waterEveryDays: 5,
        fertilizeEveryDays: 30,
        repotEveryMonths: 12 } }, { match: /ficus|fiddle|elastica|benjamina|lyrata/i,
    care: { waterEveryDays: 9,
        fertilizeEveryDays: 30,
        repotEveryMonths: 18 } }, { match: /orchid|phalaenopsis/i,
    care: { waterEveryDays: 8,
        fertilizeEveryDays: 21,
        repotEveryMonths: 24 } }, { match: /spathiphyllum|peace lily/i,
    care: { waterEveryDays: 6,
        fertilizeEveryDays: 45,
        repotEveryMonths: 18 } }, { match: /chlorophytum|spider plant/i,
    care: { waterEveryDays: 7,
        fertilizeEveryDays: 30,
        repotEveryMonths: 12 } }, { match: /herb|basil|ocimum|mentha|mint|petroselinum|parsley/i,
    care: { waterEveryDays: 2,
        fertilizeEveryDays: 21,
        repotEveryMonths: 6 } }];
