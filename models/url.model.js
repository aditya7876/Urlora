import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const urlsTable = pgTable("urls", {
    id: uuid("id").primaryKey().defaultRandom(),
    
    shortCode: varchar("code", { length: 155 }).unique().notNull(),
    targetUrl: text("target_url").notNull(),

    userId: uuid("user_id").references(() => usersTable.id).notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});