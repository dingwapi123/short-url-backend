import { pgTable, bigint, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";

/**
 * URL Record Table Definition
 * Corresponds to the original Sequelize model: src/models/urlRecordModel.js
 */
export const urlRecords = pgTable("url_record", {
  // Using mode: 'number' because the original code uses Date.now() (which returns a number) as ID
  id: bigint("id", { mode: "number" }).primaryKey(),
  
  originalUrl: text("originalUrl").notNull(),
  shortUrl: text("shortUrl").notNull(),
  urlCode: text("urlCode").notNull().unique(),
  
  // Sequelize DataTypes.STRING defaults to varchar(255)
  title: varchar("title", { length: 255 }).notNull(),
  
  description: text("description"),
  category: varchar("category", { length: 255 }),
  
  visitCount: integer("visitCount").default(0),
  
  // Sequelize automatically adds these
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type UrlRecord = typeof urlRecords.$inferSelect;
export type NewUrlRecord = typeof urlRecords.$inferInsert;
