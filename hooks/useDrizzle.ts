import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from '@/db/schema'; 

export function useDrizzle() {
  const sqliteDb = useSQLiteContext();
  return drizzle(sqliteDb, { schema });
}
