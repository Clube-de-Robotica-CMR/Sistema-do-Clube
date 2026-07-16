import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const members_table = pgTable('members', {
    id: uuid('id').defaultRandom().primaryKey(),
    war_name: text('nome_de_guerra').notNull(),
    full_name: text('nome_completo').notNull(),
    number: text('número').notNull(),
    class: text('turma').notNull(),
    phone: text('contato'),
    level: text('nível').default('Nível B'),
    field: text('área'),

    is_director: boolean('diretoria').notNull().default(false),
    is_active: boolean('ativo').notNull().default(true),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})