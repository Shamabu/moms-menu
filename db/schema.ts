import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const recipes = pgTable("recipes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  prepTime: text("prep_time").notNull(),
  ingredients: text("ingredients").array().notNull(),
  instructions: text("instructions").array().notNull(),
  isCustom: boolean("is_custom").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});