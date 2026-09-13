// Database
import type { plants } from './schema';

export enum TableName {
    Plants = 'plants',
    User = 'user',
    Session = 'session',
    Account = 'account',
    Verification = 'verification'
}

export interface ByteaColumn {
    data: Buffer;
    driverData: Buffer;
}

export type PlantRow = typeof plants.$inferSelect;
