import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const members_table = pgTable('members', {
    id: uuid('id').defaultRandom().primaryKey(),
    war_name: text('nome_de_guerra').notNull(),
    full_name: text('nome_completo').notNull(),
    number: text('número').notNull().unique(),
    class: text('turma').notNull(),
    phone: text('contato'),
    level: text('nível').default('Indefinido'),
    field: text('área').default('Indefinido'),

    is_director: boolean('diretoria').notNull().default(false),

    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
})