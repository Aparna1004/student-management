"use server";
import { db } from "@/db/index";
import { student, usersTable,MarksTable } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache"

export async function authenticateUser(username: string, password: string) {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.username, username));

    if (user.length === 0) {
      return { success: false, message: "User not found!" };
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return { success: false, message: "Invalid credentials!" };
    }

    return { success: true, message: "Login successful!" };
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: "Login failed. Try again." };
  }
}

export async function registerUser(name: string, username: string, email: string, password: string) {
  try {
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (existingUser.length > 0) {
      return { success: false, message: "Username already taken!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(usersTable).values({
      name,
      username,
      email,
      password: hashedPassword,
      role: "teacher",
    });

    return { success: true, message: "Registration successful!" };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, message: "Registration failed. Try again." };
  }
}
export async function fetchStudentCount() {
  try {
    const result = await db.select({ count: count() }).from(student);
    return result[0]?.count || 0;
  } catch (error) {
    console.error("Database error:", error);
    return 0;
  }
}

export async function addStudent(
  name: string,
  roll_no: string,
  email: string,
  phone: string,
  address: string,
  dob: string,
  sem: number,
  branch: string,
  mentor: string
) {
  const newStudent = {
    name,
    roll_no,
    email,
    phone,
    address,
    dob,
    sem,
    branch,
    mentor,
  };

  try {
    console.log("🟢 Adding Student:", newStudent);

    const insertedStudent = await db.insert(student).values(newStudent).returning();

    console.log("✅ Inserted Student:", insertedStudent);

    revalidatePath("/students");

    return insertedStudent[0];
  } catch (error: any) {
    console.error("❌ Error adding student:", error);
    throw new Error(`Failed to add student: ${error.message}`);
  }
}

export async function editStudent(
  id: number,
  name: string,
  email: string,
  phone: string,
  address: string,
  dob: string,
  sem: number,
  branch: string,
  mentor: string,
  marks: {
    osd: number;
    dsa: number;
    python: number;
    pd: number;
    ose: number;
    dba: number;
  }
) {
  try {
    console.log("🟡 Editing Student:", { id, name, email, phone, address, dob, sem, branch, mentor, marks });

    // Calculate total marks, percentage, and grade
    const total = marks.osd + marks.dsa + marks.python + marks.pd + marks.ose + marks.dba;
    const percentage = (total / 600) * 100; // Assuming each subject is out of 100

    // Grade Calculation
    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";
    else grade = "F";

    await db.transaction(async (tx) => {
      // Update student details (excluding roll_no)
      const updatedStudent = await tx
        .update(student)
        .set({ name, email, phone, address, dob, sem, branch, mentor })
        .where(eq(student.id, id))
        .returning();

      // Update marks table
      await tx
        .update(MarksTable)
        .set({
          osd: marks.osd,
          dsa: marks.dsa,
          python: marks.python,
          pd: marks.pd,
          ose: marks.ose,
          dba: marks.dba,
          total,
          percentage,
          grade,
        })
        .where(eq(MarksTable.student_id, id));

      console.log("✅ Updated Student:", updatedStudent);
    });

    revalidatePath(`/students/${id}`);
  } catch (error: any) {
    console.error("❌ Error editing student:", error);
    throw new Error(`Failed to edit student: ${error.message}`);
  }
}