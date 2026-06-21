import shared from '../../scss/shared.module.scss';
import { useState } from 'react';
import { defaultCareFor } from '../../helpers/care';
import { useObjectUrl } from '../../hooks';
import { newId } from '../../services/db';
import type { IdentifyResult } from '../../services/identify';
import type { CareSchedule, Plant } from '../../types';

interface Props {
    photo: Blob;
    result: IdentifyResult;
    onCancel: () => void;
    onSaved: (plant: Plant) => void;
}

export function AddPlantForm({ photo, result, onCancel, onSaved }: Props) {
    const [nickname, setNickname] = useState(result.commonName || result.species);
    const [care, setCare] = useState<CareSchedule>(() => { return defaultCareFor(result.species, result.commonName); });
    const photoUrl = useObjectUrl(photo);

    function save() {
        const now = Date.now();
        onSaved({
            id: newId(),
            nickname: nickname.trim() || result.commonName || result.species,
            species: result.species,
            commonName: result.commonName,
            photo,
            acquiredAt: now,
            care,
            lastCare: { water: now,
                fertilize: now,
                repot: now },
            lastNotified: {},
            notes: ''
        });
    }

    return (
        <>
            <div className={`${shared.resultCard} ${shared.selected}`}>
                {photoUrl && (
                    <img
                        src={photoUrl}
                        alt=""
                        style={{ width: 56,
                            height: 56,
                            borderRadius: 12,
                            objectFit: 'cover' }}
                    />
                )}
                <div>
                    <div className={shared.common}>{result.commonName || result.species}</div>
                    <div className={shared.sci}>{result.species}</div>
                </div>
            </div>

            <div className={shared.field}>
                <label htmlFor="apf-nickname">Nickname</label>
                <input id="apf-nickname" value={nickname} onChange={(e) => { setNickname(e.target.value); }} placeholder="e.g. Kitchen monstera" />
            </div>

            <div className={shared.sectionTitle}>Care schedule</div>
            <div className={shared.fieldRow}>
                <div className={shared.field}>
                    <label htmlFor="apf-water">💧 Water</label>
                    <select
                        id="apf-water"
                        value={care.waterEveryDays}
                        onChange={(e) => {
                            setCare({ ...care,
                                waterEveryDays: +e.target.value });
                        }}
                    >
                        {[2, 3, 4, 5, 6, 7, 9, 10, 12, 14, 16, 18, 21, 28].map((d) => {
                            return (
                                <option key={d} value={d}>every {d} days</option>
                            );
                        })}
                    </select>
                </div>
                <div className={shared.field}>
                    <label htmlFor="apf-fertilize">🌿 Fertilise</label>
                    <select
                        id="apf-fertilize"
                        value={care.fertilizeEveryDays}
                        onChange={(e) => {
                            setCare({ ...care,
                                fertilizeEveryDays: +e.target.value });
                        }}
                    >
                        <option value={0}>never</option>
                        {[14, 21, 30, 45, 60, 90].map((d) => {
                            return (
                                <option key={d} value={d}>every {d} days</option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <div className={shared.field}>
                <label htmlFor="apf-repot">🪴 Repot</label>
                <select
                    id="apf-repot"
                    value={care.repotEveryMonths}
                    onChange={(e) => {
                        setCare({ ...care,
                            repotEveryMonths: +e.target.value });
                    }}
                >
                    <option value={0}>never</option>
                    {[6, 12, 18, 24, 30, 36].map((m) => {
                        return (
                            <option key={m} value={m}>every {m} months</option>
                        );
                    })}
                </select>
                <div className={shared.hint}>Suggested defaults are based on the identified species — tweak as needed.</div>
            </div>

            <div className={shared.shutterRow}>
                <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={onCancel}>
                    Back
                </button>
                <button type="button" className={shared.btn} onClick={save}>
                    🌱 Add to my plants
                </button>
            </div>
        </>
    );
}
