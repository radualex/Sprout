import React from 'react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import { Button } from '@/design-system/Button';

// Helpers
import { CARE_META } from '@/js/helpers/care';

// Styles
import styles from './styles.module.scss';

// Types
import { CareKind, type Plant } from '@/js/types';

interface Props {
    plant: Plant;
    onEdit: () => void;
}

export const CareScheduleNotice: React.FunctionComponent<Props> = ({ plant, onEdit }) => {
    const WaterIcon = CARE_META[CareKind.Water].icon;
    const FertilizeIcon = CARE_META[CareKind.Fertilize].icon;
    const RepotIcon = CARE_META[CareKind.Repot].icon;

    return (
        <React.Fragment>
            <div className={styles.notice}>
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
            <Button variant={ButtonVariant.Secondary} block onClick={onEdit}>
                Edit schedule
            </Button>
        </React.Fragment>
    );
};
