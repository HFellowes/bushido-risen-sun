import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const warbands = sqliteTable('warbands', {
  id:         text('id').primaryKey(),
  name:       text('name').notNull(),
  faction:    text('faction').notNull(),
  riceLimit:  integer('rice_limit').notNull().default(35),
  slots:      text('slots').notNull().default('[]'),   // JSON array of WarbandSlot
  notes:      text('notes').notNull().default(''),
  createdAt:  text('created_at').notNull(),
  updatedAt:  text('updated_at').notNull(),
})

export type WarbandRow = typeof warbands.$inferSelect
export type NewWarbandRow = typeof warbands.$inferInsert
