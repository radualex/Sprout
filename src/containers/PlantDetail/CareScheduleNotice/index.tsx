import React from 'react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import Button from '@/design-system/Button';

// Helpers
import { CARE_META } from '@/helpers/care';

// Styles
import styles from './styles.module.css';

// Types
import { CareKind, type Plant } from '@/types';

export interface Props {
    plant: Plant;
    onEdit: () => void;
}

const CareScheduleNotice: React.FunctionComponent<Props> = ({ plant, onEdit }) => {
    const WaterIcon = CARE_META[CareKind.Water].icon;
    const FertilizeIcon = CARE_META[CareKind.Fertilize].icon;
    const RepotIcon = CARE_META[CareKind.Repot].icon;

    return (
        <React.Fragment>
            <div className={styles.notice}>
                <WaterIcon size="0.875rem" />
                <span>
                    {`every ${plant.care.waterEveryDays} days`}
                </span>
                <FertilizeIcon size="0.875rem" />
                <span>
                    {plant.care.fertilizeEveryDays ? `every ${plant.care.fertilizeEveryDays} days` : 'never'}
                </span>
                <RepotIcon size="0.875rem" />
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

export default CareScheduleNotice;
