import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Constants
import { ERROR_BAD_KEY, ERROR_NO_IMAGE, ERROR_NO_KEY, ERROR_NOT_RECOGNISED, ERROR_UNREACHABLE, PLANTNET_API_URL } from './constants';

// Services
import { identifySpecies, PlantNetError } from './index';

const API_KEY = 'env-test-key';

const imageForm = (apiKey?: string): FormData => {
    const form = new FormData();
    form.append('images', new File(['leaf'], 'plant.jpg', {
        type: 'image/jpeg'
    }));
    if (apiKey !== undefined) {
        form.append('apiKey', apiKey);
    }

    return form;
};

const emptyForm = (): FormData => {
    return new FormData();
};

const mockResponse = (body: unknown, status: number): Response => {
    const isOk = status >= 200 && status < 300;

    return {
        ok: isOk,
        status,
        json: () => {
            return Promise.resolve(body);
        }
    } as unknown as Response;
};

const capturePlantNetError = async (promise: Promise<unknown>): Promise<PlantNetError> => {
    try {
        await promise;
    } catch (error) {
        if (error instanceof PlantNetError) {
            return error;
        }

        throw error;
    }

    throw new Error('Expected identifySpecies to reject.');
};

describe('identifySpecies', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        vi.stubEnv('PLANTNET_API_KEY', API_KEY);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    it('rejects with 400 when no image is provided', async () => {
        const error = await capturePlantNetError(identifySpecies(emptyForm()));

        expect(error.httpStatus).toBe(400);
        expect(error.message).toBe(ERROR_NO_IMAGE);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('rejects with 400 when no key is configured', async () => {
        vi.stubEnv('PLANTNET_API_KEY', '');

        const error = await capturePlantNetError(identifySpecies(imageForm()));

        expect(error.httpStatus).toBe(400);
        expect(error.message).toBe(ERROR_NO_KEY);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('ignores a non-string apiKey field (e.g. a File)', async () => {
        vi.stubEnv('PLANTNET_API_KEY', '');
        const form = imageForm();
        form.append('apiKey', new File(['key'], 'key.txt', {
            type: 'text/plain'
        }));

        const error = await capturePlantNetError(identifySpecies(form));

        expect(error.httpStatus).toBe(400);
        expect(error.message).toBe(ERROR_NO_KEY);
    });

    it.each(['', ' '.repeat(3), 'k'.repeat(500)])('ignores an unusable client key %j', async (apiKey) => {
        vi.stubEnv('PLANTNET_API_KEY', '');

        const error = await capturePlantNetError(identifySpecies(imageForm(apiKey)));

        expect(error.httpStatus).toBe(400);
        expect(error.message).toBe(ERROR_NO_KEY);
    });

    it('uses the per-request apiKey when the env key is unset', async () => {
        vi.stubEnv('PLANTNET_API_KEY', '');
        fetchMock.mockResolvedValue(mockResponse({
            results: []
        }, 200));

        await identifySpecies(imageForm('user-key'));

        expect(fetchMock).toHaveBeenCalledWith(
            `${PLANTNET_API_URL}?api-key=${encodeURIComponent('user-key')}&nb-results=5`,
            expect.anything()
        );
    });

    it('maps a 401 to a bad-key 400', async () => {
        fetchMock.mockResolvedValue(mockResponse({}, 401));

        const error = await capturePlantNetError(identifySpecies(imageForm()));

        expect(error.httpStatus).toBe(400);
        expect(error.message).toBe(ERROR_BAD_KEY);
    });

    it('maps a 404 to a not-recognised 400', async () => {
        fetchMock.mockResolvedValue(mockResponse({}, 404));

        const error = await capturePlantNetError(identifySpecies(imageForm()));

        expect(error.httpStatus).toBe(400);
        expect(error.message).toBe(ERROR_NOT_RECOGNISED);
    });

    it('maps any other HTTP failure to a 502', async () => {
        fetchMock.mockResolvedValue(mockResponse({}, 500));

        const error = await capturePlantNetError(identifySpecies(imageForm()));

        expect(error.httpStatus).toBe(502);
        expect(error.message).toBe('PlantNet failed with HTTP 500.');
    });

    it('maps a network throw to a 502 unreachable error', async () => {
        fetchMock.mockRejectedValue(new Error('socket hang up'));

        const error = await capturePlantNetError(identifySpecies(imageForm()));

        expect(error.httpStatus).toBe(502);
        expect(error.message).toBe(ERROR_UNREACHABLE);
    });

    it('maps PlantNet results to IdentifyResult with default care', async () => {
        fetchMock.mockResolvedValue(mockResponse({
            results: [{
                scientificNameWithoutAuthor: 'Monstera deliciosa',
                commonNames: ['Swiss cheese plant'],
                score: 0.93
            }, {
                scientificNameWithoutAuthor: undefined,
                commonNames: undefined,
                score: undefined
            }]
        }, 200));

        const results = await identifySpecies(imageForm());
        const [identified, unknown] = results;

        expect(results).toHaveLength(2);
        expect(identified).toEqual({
            species: 'Monstera deliciosa',
            commonName: 'Swiss cheese plant',
            confidence: 0.93,
            defaultCare: {
                waterEveryDays: 7,
                fertilizeEveryDays: 30,
                repotEveryMonths: 18
            }
        });
        expect(unknown).toEqual({
            species: 'Unknown species',
            commonName: '',
            confidence: 0,
            defaultCare: {
                waterEveryDays: 7,
                fertilizeEveryDays: 30,
                repotEveryMonths: 18
            }
        });
    });

    it('returns an empty list when PlantNet omits results', async () => {
        fetchMock.mockResolvedValue(mockResponse({}, 200));

        const results = await identifySpecies(imageForm());

        expect(results).toEqual([]);
    });
});
