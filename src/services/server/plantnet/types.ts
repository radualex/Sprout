export interface PlantNetRawResult {
    scientificNameWithoutAuthor?: string | null;
    commonNames?: string[] | null;
    score?: number | null;
}

export interface PlantNetResponse {
    results?: PlantNetRawResult[];
}
