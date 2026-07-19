import { pgTable, text, timestamp, uuid, integer, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";

export const placementEnum = pgEnum('placement_rank', ['1°', '2°', '3°']);

export const competitions_table = pgTable('competitions', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    date: timestamp('date').notNull(),
    year: integer('year').notNull(),

    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const competition_results_table = pgTable('competition_results', {
    id: uuid('id').defaultRandom().primaryKey(),
    competition_id: uuid('competition_id')
        .references(() => competitions_table.id, { onDelete: 'cascade' })
        .notNull(),
    
    member_war_name: text('member_war_name').notNull(),
    member_number: text('member_number').notNull(), 
    placement: placementEnum('placement').notNull(), 

    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    number_competition_unique: uniqueIndex('number_competition_unique_idx')
        .on(table.member_number, table.competition_id),
}));