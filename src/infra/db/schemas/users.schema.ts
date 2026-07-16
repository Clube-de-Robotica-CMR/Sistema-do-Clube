import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users_table = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('nome').notNull().unique(),
    password: text('senha').notNull(),
    role: text('cargo').notNull().default('diretoria'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
})