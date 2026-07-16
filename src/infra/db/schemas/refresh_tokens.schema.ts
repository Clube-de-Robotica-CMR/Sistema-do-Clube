import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users_table } from "./users.schema";

export const refresh_tokens_table = pgTable('refresh_tokens', {
    id: uuid('id').defaultRandom().primaryKey(),
    token: text('token').notNull().unique(),
    user_id: uuid('user_id')
        .references(() => users_table.id, { onDelete: 'cascade' })
        .notNull(),
    expires_at: timestamp('expires_at').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
});