import React from 'react';
import classNames from 'classnames';

// Helpers
import { CARE_META } from '@/js/helpers/care';

// Styles
import shared from '@/js/scss/shared.module.scss';

// Types
import { CareKind, type Plant } from '@/js/types';

interface Props {
    plant: Plant;
    onEdit: () => void;
}

export const CareScheduleNotice: React.FunctionComponent<Props> = ({ plant, onEdit }) => {
    const secondaryBlockButtonClasses = classNames(shared.btn, shared.secondary, shared.block);
    const WaterIcon = CARE_META[CareKind.Water].icon;
    const FertilizeIcon = CARE_META[CareKind.Fertilize].icon;
    const RepotIcon = CARE_META[CareKind.Repot].icon;

    return (
        <React.Fragment>
            <div className={shared.notice}>
                <WaterIcon size={14} />
                <span>
                    {`every ${plant.care.waterEveryDays} days`}
                </span>
                <FertilizeIcon size={14} />
                <span>
                    {plant.care.fertilizeEveryDays ? `every ${plant.care.fertilizeEveryDays} days` : 'never'}
                </span>
                <RepotIcon size={14} />
                <span>
                    {plant.care.repotEveryMonths ? `every ${plant.care.repotEveryMonths} months` : 'never'}
                </span>
            </div>
            <button type="button" className={secondaryBlockButtonClasses} onClick={onEdit}>
                Edit schedule
            </button>
        </React.Fragment>
    );
};
