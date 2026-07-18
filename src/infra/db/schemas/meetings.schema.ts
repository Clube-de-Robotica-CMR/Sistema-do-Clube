import { integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { members_table } from "./members.schema";

export const quarterEnum = pgEnum('quarters', ['1°', '2°', '3°'])
export const attendanceStatusEnum = pgEnum('attendance_status', ['Presente', 'Falta Justificada', 'Falta']);

export const meetings_table = pgTable('meetings', {
    id: uuid('id').defaultRandom().primaryKey(),
    date: timestamp('data').notNull().unique(),
    quarter: quarterEnum().notNull(), 
    year: integer('ano').notNull(), 

    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const attendance_table = pgTable('attendance', {
    id: uuid('id').defaultRandom().primaryKey(),
    meeting_id: uuid('meeting_id').references(() => meetings_table.id, { onDelete: 'cascade' }).notNull(),
    member_id: uuid('member_id').references(() => members_table.id, { onDelete: 'cascade' }).notNull(),
    status: attendanceStatusEnum('status').default('Falta').notNull(), 

    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    member_meeting_unique: uniqueIndex('member_meeting_unique_idx').on(table.member_id, table.meeting_id),
}));