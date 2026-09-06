import {
    boolean,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";


/* =========================
   Groups
========================= */

export const groups_table = pgTable(
    "groups",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        name: text("name")
            .notNull()
            .unique(),

        created_at: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updated_at: timestamp("updated_at")
            .defaultNow()
            .notNull(),
    }
);


/* =========================
   Members
========================= */

export const members_table = pgTable(
    "members",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        war_name: text("nome_de_guerra")
            .notNull(),

        full_name: text("nome_completo")
            .notNull(),

        number: text("número")
            .notNull()
            .unique(),

        class: text("turma")
            .notNull(),

        phone: text("contato"),

        level: text("nível")
            .default("Indefinido"),

        field: text("área")
            .default("Indefinido"),

        is_director: boolean("diretoria")
            .notNull()
            .default(false),

        group_id: uuid("group_id")
            .references(
                () => groups_table.id,
                {
                    onDelete: "set null",
                }
            ),

        created_at: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updated_at: timestamp("updated_at")
            .defaultNow()
            .notNull(),
    }
);