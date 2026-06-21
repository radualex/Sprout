import type { Plant } from '../../types';
import { DB_NAME, STORE } from './constants';

let databasePromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
    if (databasePromise) return databasePromise;
    databasePromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore(STORE, { keyPath: 'id' });
        };
        request.onsuccess = () => { resolve(request.result); };
        request.onerror = () => { reject(request.error); };
    });
    return databasePromise;
}

function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    return openDatabase().then(
        (database) => {
            return new Promise<T>((resolve, reject) => {
                const t = database.transaction(STORE, mode);
                const request = run(t.objectStore(STORE));
                request.onsuccess = () => { resolve(request.result); };
                request.onerror = () => { reject(request.error); };
            });
        }
    );
}

export function getAllPlants(): Promise<Plant[]> {
    return tx('readonly', (s) => { return s.getAll() as IDBRequest<Plant[]>; });
}

export function savePlant(plant: Plant): Promise<IDBValidKey> {
    return tx('readwrite', (s) => { return s.put(plant); });
}

export function deletePlant(id: string): Promise<undefined> {
    return tx('readwrite', (s) => { return s.delete(id); });
}

export function newId(): string {
    return crypto.randomUUID();
}
