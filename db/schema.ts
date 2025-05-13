import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
  username: text('username').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  isLoggedIn: integer('isLoggedIn').default(0),
});

export const plant = sqliteTable('plant', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
  plantName: text('plantName').notNull(),
  image: text('image')
});

export const plantType = sqliteTable('plantType', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s','now'))`),
  potNumber: integer('potNumber').notNull(),
  frequency: integer('frequency').notNull(),
  duration: integer('duration').notNull(),
  plantId: integer('plantId').notNull().references(() => plant.id),
  userId: integer('userId').notNull().references(() => user.id),
  waterUsage: integer('waterUsage').default(0),
  date: text('date')
});

// Export Task to use as an interface in your app
export type User = typeof user.$inferSelect;
export type Plant = typeof plant.$inferSelect;
export type PlantType = typeof plantType.$inferSelect;