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
                <div className={styles.row}>
                    <WaterIcon size="0.875rem" aria-hidden />
                    <span>
                        {`${plant.care.waterEveryDays} days`}
                    </span>
                </div>
                <div className={styles.row}>
                    <FertilizeIcon size="0.875rem" aria-hidden />
                    <span>
                        {plant.care.fertilizeEveryDays ? `${plant.care.fertilizeEveryDays} days` : 'never'}
                    </span>
                </div>
                <div className={styles.row}>
                    <RepotIcon size="0.875rem" aria-hidden />
                    <span>
                        {plant.care.repotEveryMonths ? `${plant.care.repotEveryMonths} months` : 'never'}
                    </span>
                </div>
            </div>
            <Button variant={ButtonVariant.Secondary} block onClick={onEdit}>
                Edit
            </Button>
        </React.Fragment>
    );
};

export default CareScheduleNotice;
