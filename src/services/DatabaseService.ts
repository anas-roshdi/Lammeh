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

const DB_NAME = 'lammeh_v14.db';
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
            const asset = Asset.fromModule(require('../../assets/db/lammeh_v14.db'));
            await asset.downloadAsync();

            await FileSystem.copyAsync({
                from: asset.localUri || asset.uri,
                to: dbPath,
            });
            console.log('Database v14 copied to local storage successfully.');
        }

        // Strip 'file://' prefix so Android native SQLite can resolve the directory
        const nativeDir = dbDir.replace('file://', '');

        // Pass nativeDir as the 3rd argument to open the database from the copied location
        cachedDbInstance = await SQLite.openDatabaseAsync(DB_NAME, {}, nativeDir);

        // Verify tables loaded from the copied database
        const tables = await cachedDbInstance.getAllAsync<{ name: string }>(
            "SELECT name FROM sqlite_master WHERE type='table'"
        );
        console.log('--- TABLES DETECTED ---', tables);

        return cachedDbInstance;
    } catch (error) {
        console.error('--- DATABASE INIT ERROR ---', error);
        return null;
    }
};

export const getCategories = async (db: SQLite.SQLiteDatabase | null): Promise<Category[]> => {
    if (!db) return [];

    try {
        return await db.getAllAsync<Category>('SELECT * FROM categories');
    } catch (error) {
        console.error('Error fetching categories: ', error);
        return [];
    }
};

export const getRandomWord = async (db: SQLite.SQLiteDatabase | null, categoryId: number): Promise<string | null> => {
    if (!db) return null;

    try {
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