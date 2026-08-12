// Constants
import { DB_NAME, STORE } from './constants';

// Types
import type { Plant } from '../../types';

function createDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.addEventListener('upgradeneeded', () => {
            request.result.createObjectStore(STORE, { keyPath: 'id' });
        });
        request.addEventListener('success', () => {
            resolve(request.result);
        });
        request.addEventListener('error', () => {
            reject(request.error ?? new Error('Failed to open database'));
        });
    });
}

const openDatabase = (() => {
    let promise: Promise<IDBDatabase> | undefined;
    return function open(): Promise<IDBDatabase> {
        promise ??= createDatabase();
        return promise;
    };
})();

async function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const database = await openDatabase();
    return new Promise<T>((resolve, reject) => {
        const transaction = database.transaction(STORE, mode);
        const request = run(transaction.objectStore(STORE));
        request.addEventListener('success', () => {
            resolve(request.result);
        });
        request.addEventListener('error', () => {
            reject(request.error ?? new Error('IndexedDB request failed'));
        });
    });
}

export function getAllPlants(): Promise<Plant[]> {
    return tx('readonly', (store) => {
        return store.getAll() as IDBRequest<Plant[]>;
    });
}

export function savePlant(plant: Plant): Promise<IDBValidKey> {
    return tx('readwrite', (store) => {
        return store.put(plant);
    });
}

export function deletePlant(id: string): Promise<undefined> {
    return tx('readwrite', (store) => {
        return store.delete(id);
    });
}

export function newId(): string {
    return crypto.randomUUID();
}
