export interface PlantNetSpecies {
    scientificNameWithoutAuthor?: string | null;
    commonNames?: string[] | null;
}

export interface PlantNetRawResult {
    species?: PlantNetSpecies | null;
    score?: number | null;
}

export interface PlantNetResponse {
    results?: PlantNetRawResult[];
}

export interface PlantNetErrorBody {
    message?: string;
}
