import {pgTable , uuid, varchar, text, timestamp} from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),

    firstName: varchar('first_name', { length: 55 }).notNull(),
    lastName: varchar('last_name', { length: 55 }).notNull(),
    
    email: varchar('email', { length: 255 }).unique().notNull(),

    password: text('password').notNull(),
    salt: text('salt').notNull(),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),

});