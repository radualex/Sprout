import { describe, expect, it } from 'vitest';
import { makePlant } from '@test/vitest/data/plant.mock';

// Helpers
import { displayName } from './index';

describe('displayName', () => {
    it('prefers the nickname', () => {
        const plant = makePlant({
            nickname: 'Kitchen monstera',
            commonName: 'Swiss cheese plant',
            species: 'Monstera deliciosa'
        });

        expect(displayName(plant)).toBe('Kitchen monstera');
    });

    it('falls back to the common name without a nickname', () => {
        const plant = makePlant({
            nickname: '',
            commonName: 'Swiss cheese plant',
            species: 'Monstera deliciosa'
        });

        expect(displayName(plant)).toBe('Swiss cheese plant');
    });

    it('falls back to the species without nickname or common name', () => {
        const plant = makePlant({
            nickname: '',
            commonName: '',
            species: 'Monstera deliciosa'
        });

        expect(displayName(plant)).toBe('Monstera deliciosa');
    });
});
