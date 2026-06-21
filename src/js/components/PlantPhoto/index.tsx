import type { Plant } from '../../types';
import { useObjectUrl } from '../../hooks';

interface Props {
    plant: Plant;
    className: string;
}

export function PlantPhoto({ plant, className }: Props) {
    const url = useObjectUrl(plant.photo);
    if (!url) return <div className={className}>🌱</div>;
    return <img className={className} src={url} alt={plant.nickname || plant.species} />;
}
