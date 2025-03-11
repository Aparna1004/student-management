import { integer, pgTable, varchar, date, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    username: varchar({ length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    role: varchar({ length: 255 }).notNull(),
    verified: boolean().default(false).notNull(),
    pinToBeChanged: boolean().default(true)
});

export const student = pgTable("student", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    roll_no: varchar({ length: 20 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    phone: varchar({ length: 15 }).notNull().unique(),
    address: varchar({ length: 255 }).notNull(),
    dob: date().notNull(),
    sem: integer().notNull(),
    branch: varchar({ length: 255 }).notNull(),
    mentor: varchar({ length: 255 }).notNull().references(() => usersTable.username, { onDelete: "cascade" }),
});

export const MarksTable = pgTable("marks", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    student_id: integer().notNull().references(() => student.id, { onDelete: "cascade" }),
    osd: integer().notNull(),
    dsa: integer().notNull(),
    python: integer().notNull(),
    pd: integer().notNull(),
    ose: integer().notNull(),
    dba: integer().notNull(),
    total: integer().notNull(),
    percentage: integer().notNull(),
    grade: varchar({ length: 255 }).notNull(),
});
