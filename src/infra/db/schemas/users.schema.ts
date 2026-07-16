import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users_table = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('nome').notNull(),
    password: text('senha').notNull(),
    role: text('cargo').notNull().default('diretoria'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})