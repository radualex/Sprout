import { useState } from 'react';

// Styles
import shared from '../../scss/shared.module.scss';

// Types
import type { Plant } from '../../types';

interface Props {
    plant: Plant;
    onSave: (plant: Plant) => void;
    onCancel: () => void;
}

export function EditSchedule({ plant, onSave, onCancel }: Props) {
    const [nickname, setNickname] = useState(plant.nickname);
    const [care, setCare] = useState(plant.care);

    return (
        <>
            <div className={shared.field}>
                <label htmlFor="es-nickname">Nickname</label>
                <input
                    id="es-nickname"
                    value={nickname}
                    onChange={(event_) => {
                        setNickname(event_.target.value);
                    }}
                />
            </div>
            <div className={shared.fieldRow}>
                <div className={shared.field}>
                    <label htmlFor="es-water">💧 Water</label>
                    <select
                        id="es-water"
                        value={care.waterEveryDays}
                        onChange={(event_) => {
                            setCare({ ...care,
                                waterEveryDays: +event_.target.value });
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
                    <label htmlFor="es-fertilize">🌿 Fertilise</label>
                    <select
                        id="es-fertilize"
                        value={care.fertilizeEveryDays}
                        onChange={(event) => {
                            setCare({ ...care,
                                fertilizeEveryDays: +event.target.value });
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
                <label htmlFor="es-repot">🪴 Repot</label>
                <select
                    id="es-repot"
                    value={care.repotEveryMonths}
                    onChange={(event) => {
                        setCare({ ...care,
                            repotEveryMonths: +event.target.value });
                    }}
                >
                    <option value={0}>never</option>
                    {[6, 12, 18, 24, 30, 36].map((m) => {
                        return (
                            <option key={m} value={m}>every {m} months</option>
                        );
                    })}
                </select>
            </div>
            <div className={shared.shutterRow}>
                <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={onCancel}>Cancel</button>
                <button
                    type="button"
                    className={shared.btn}
                    onClick={() => {
                        onSave({ ...plant,
                            nickname: nickname.trim() || plant.nickname,
                            care });
                    }}
                >
                    Save changes
                </button>
            </div>
        </>
    );
}
