// Hooks
import { useObjectUrl } from '../../hooks';

// Types
import type { Plant } from '../../types';

interface Props {
    plant: Plant;
    className: string;
}

export function PlantPhoto({ plant, className }: Props) {
    const url = useObjectUrl(plant.photo);
    if (!url) return <div className={className}>🌱</div>;
    return <img className={className} src={url} alt={plant.nickname || plant.species} />;
}
