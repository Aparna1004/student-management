import DashboardLayout from "@/components/dashboard-layout";
import StudentDetail from "@/components/student-detail";
import { db } from "@/db/index";
import { student, MarksTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  const studentId = Number(params.id);

  const studentRecord = await db.select().from(student).where(eq(student.id, studentId));
  const marksRecord = await db.select().from(MarksTable).where(eq(MarksTable.student_id, studentId));

  const studentData = studentRecord.length > 0 ? studentRecord[0] : null;
  const marksData = marksRecord.length > 0 ? marksRecord[0] : null;

  return (
    <DashboardLayout>
      <StudentDetail student={studentData} marks={marksData} />
    </DashboardLayout>
  );
}
