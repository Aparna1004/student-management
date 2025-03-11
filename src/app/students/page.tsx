import { cookies } from "next/headers"; // Import cookies
import { db } from "@/db/index";
import { student } from "@/db/schema";
import { eq } from "drizzle-orm";
import DashboardLayout from "@/components/dashboard-layout";
import StudentsTable from "@/components/students-table";

export default async function StudentsPage() {
  const sessionCookie = cookies().get("user");
  const username = sessionCookie?.value;

  if (!username) {
    return <p className="text-center text-red-500">You are not verified. Please log in.</p>;
  }

  const students = await db
    .select()
    .from(student)
    .where(eq(student.mentor, username));
  
  console.log(students);

  return (
    <DashboardLayout>
      <StudentsTable initialStudents={students} />
    </DashboardLayout>
  );
}
