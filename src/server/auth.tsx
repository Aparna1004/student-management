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

  const Marks={
    student_id:roll_no,
    osd: 0,
    dsa: 0,
    python: 0,
    pd: 0,
    ose: 0,
    dba: 0,
    total: 0,
    percentage: 0,
    grade: "F",
  }

  try {
    console.log("🟢 Adding Student:", newStudent);

    const insertedStudent = await db.insert(student).values(newStudent).returning();
    const insertedMarks = await db.insert(MarksTable).values(Marks).returning();

    console.log("✅ Inserted Student:", insertedStudent);
    console.log("✅ Inserted Student:", insertedMarks);

    revalidatePath("/students");

    return insertedStudent[0];
  } catch (error: any) {
    console.error("❌ Error adding student:", error);
    throw new Error(`Failed to add student: ${error.message}`);
  }
}

export async function editStudent(studentData: {
  id: number;
  roll_no: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  sem: number;
  branch: string;
  mentor: string;
  osd: number;
  dsa: number;
  python: number;
  pd: number;
  ose: number;
  dba: number;
}) {
  try {
    console.log("🟡 Editing Student:", studentData);

    const total =
    Number(studentData.osd) +
    Number(studentData.dsa) +
    Number(studentData.python) +
    Number(studentData.pd) + 
    Number(studentData.ose) +
    Number(studentData.dba);

  const percentage = Math.round((total / 600) * 100); 

    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";

    await db.transaction(async (tx) => {
      const updatedStudent = await tx
        .update(student)
        .set({
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          address: studentData.address,
          dob: studentData.dob,
          sem: studentData.sem,
          branch: studentData.branch,
          mentor: studentData.mentor,
        })
        .where(eq(student.roll_no, studentData.roll_no))
        .returning();

      await tx
        .update(MarksTable)
        .set({
          osd: studentData.osd,
          dsa: studentData.dsa,
          python: studentData.python,
          pd: Number(studentData.pd), 
          ose: studentData.ose,
          dba: studentData.dba,
          total,
          percentage,
          grade,
        })
        .where(eq(MarksTable.student_id, studentData.roll_no));

      console.log("✅ Updated Student:", updatedStudent);
    });

    revalidatePath(`/students/${studentData.id}`);
  } catch (error: any) {
    console.error("❌ Error editing student:", error);
    throw new Error(`Failed to edit student: ${error.message}`);
  }
}

export async function deleteStudent(id: string) {
  try {
    console.log(`🟡 Deleting student with id: ${id}`);

    // Execute the transaction
    await db.transaction(async (tx) => {
      await tx.delete(MarksTable).where(eq(MarksTable.student_id, Number(id))); 
      await tx.delete(student).where(eq(student.roll_no, id));
    });

    console.log(`✅ Successfully deleted student with id: ${id}`);

    return { success: true };
  } catch (error: any) {
    console.error("❌ Error deleting student:", error);
    throw new Error(`Failed to delete student: ${error.message}`);
  }
}