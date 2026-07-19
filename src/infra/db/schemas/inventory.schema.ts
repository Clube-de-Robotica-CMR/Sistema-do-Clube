import { pgTable, uuid, integer, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';

export const classificationEnum = pgEnum('classification_enum', 
    [
        'Microcontrolador', 'Atuador', 'Componente Mecânico', 'Sensor', 'Conector', 
        'Energia', 'Variados', 'Dispositivo de saída'
    ]
)

export const collectionEnum = pgEnum('collection_enum', 
    [
        'Arduino', 'LEGO SPIKE', 'LEGO EV3'
    ]
)

export const statusEnum = pgEnum('status_enum',
    [
        'Funcionando', 'Sem funcionamento'
    ]
)

export const inventory_table = pgTable('inventory', {
    id: uuid('id').defaultRandom().primaryKey(),
    item: text('item').notNull(),
    quantity: integer('quantity').notNull().default(0),
    
    classification: classificationEnum('classification').notNull(),
    collection: collectionEnum('collection').notNull(),
    status: statusEnum('status').notNull(),
    location: text('location').notNull(),
    
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});