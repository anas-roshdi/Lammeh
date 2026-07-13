import * as FileSystem from 'expo-file-system/legacy';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

export interface Category {
    id: number;
    name: string;
    icon: string;
    is_premium: number;
}

export interface Word {
    id: number;
    category_id: number;
    word: string;
}

// Updated Database Name for versioning
const DB_NAME = 'lammeh_v2.db';
let cachedDbInstance: SQLite.SQLiteDatabase | null = null;

export const initDB = async (): Promise<SQLite.SQLiteDatabase | null> => {
    try {
        if (cachedDbInstance) {
            return cachedDbInstance;
        }

        const dbDir = `${FileSystem.documentDirectory}SQLite/`;
        const dbPath = `${dbDir}${DB_NAME}`;

        const dirInfo = await FileSystem.getInfoAsync(dbDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
        }

        const dbInfo = await FileSystem.getInfoAsync(dbPath);
        if (!dbInfo.exists) {
            // Update the require statement to point to the renamed file
            const asset = Asset.fromModule(require('../../assets/db/lammeh_v2.db'));
            await asset.downloadAsync();

            await FileSystem.copyAsync({
                from: asset.localUri || asset.uri,
                to: dbPath,
            });
            console.log('Database v2 copied to local storage successfully.');
        }

        cachedDbInstance = await SQLite.openDatabaseAsync(DB_NAME);
        return cachedDbInstance;
    } catch (error) {
        console.error('--- DATABASE INIT ERROR ---', error);
        return null;
    }
};

export const getCategories = async (db: SQLite.SQLiteDatabase | null): Promise<Category[]> => {
    if (!db) return [];

    try {
        // Explicitly run getAllAsync with no arguments to keep it safe
        return await db.getAllAsync<Category>('SELECT * FROM categories');
    } catch (error) {
        console.error('Error fetching categories: ', error);
        return [];
    }
};

export const getRandomWord = async (db: SQLite.SQLiteDatabase | null, categoryId: number): Promise<string | null> => {
    if (!db) return null;

    try {
        // Force convert categoryId to a safe standard number type to avoid native mapping errors
        const safeId = Number(categoryId);
        const result = await db.getFirstAsync<{ word: string }>(
            'SELECT word FROM words WHERE category_id = ? ORDER BY RANDOM() LIMIT 1',
            [safeId]
        );
        return result ? result.word : null;
    } catch (error) {
        console.error('Error fetching random word: ', error);
        return null;
    }
};