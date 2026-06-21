export interface IdentifyResult {
    species: string;
    commonName: string;
    confidence: number; // 0..1
    source: 'plantnet' | 'demo';
}
