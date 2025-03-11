"use client"
import { useEffect, useState } from "react"
import { fetchStudentCount } from "@/server/auth"  // Import server action
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function DashboardPage() {
  const [students, setStudents] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const count = await fetchStudentCount();  // Fetch from server action
        setStudents(count);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
