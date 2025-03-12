"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Calendar, Edit, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import StudentEditForm from "@/components/student-edit-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { editStudent } from "@/server/auth"; // Import editStudent function

interface StudentDetailProps {
  student: any;
  marks: any;
}

export default function StudentDetail({ student, marks }: StudentDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatedStudent, setUpdatedStudent] = useState({
    name: student.name,
    username: student.username,
  });

  if (!student) return <p>Student not found.</p>;
  if (isEditing) return <StudentEditForm student={student} onCancel={() => setIsEditing(false)} />;

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedStudent({ ...updatedStudent, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSave = async () => {
    await editStudent(student.roll_no, updatedStudent); // Update student in DB
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/students">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to students</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Student Details</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={updatedStudent.name} onChange={handleChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">Username</Label>
                <Input id="username" value={updatedStudent.username} onChange={handleChange} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Personal Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Student's personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <User className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">{student.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {student.roll_no}</p>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Date of Birth: {student.dob}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Student's academic performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {marks && (
              <div className="grid grid-cols-2 gap-4">
                <div className="border p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Marks</div>
                  <div className="text-2xl font-bold">{marks.total}</div>
                </div>
                <div className="border p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Percentage</div>
                  <div className="text-2xl font-bold">{marks.percentage}%</div>
                </div>
                <div className="border p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Grade</div>
                  <div className="text-2xl font-bold">{marks.grade}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Marks Table */}
      <Tabs defaultValue="marks">
        <TabsList>
          <TabsTrigger value="marks">Marks</TabsTrigger>
        </TabsList>
        <TabsContent value="marks" className="border rounded-md p-4 mt-2">
          <h3 className="text-lg font-semibold mb-4">Marks Breakdown</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marks &&
                ["osd", "dsa", "python", "pd", "ose", "dba"].map((subject) => (
                  <TableRow key={subject}>
                    <TableCell>{subject.toUpperCase()}</TableCell>
                    <TableCell>{marks[subject]}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
