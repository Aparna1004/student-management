"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Edit,
  Mail,
  Phone,
  User,
  GraduationCap,
  Award,
  Percent,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { deleteStudent, editStudent } from "@/server/auth"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Student {
  id: string
  name: string
  username: string
  roll_no: string
  email: string
  phone: string
  dob: string
}

interface Marks {
  total: number
  percentage: number
  grade: string
  osd: number
  dsa: number
  python: number
  pd: number
  ose: number
  dba: number
}

interface StudentDetailProps {
  student: Student
  marks: Marks
}

export default function StudentDetail({ student, marks }: StudentDetailProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatedData, setUpdatedData] = useState({ ...student, ...marks })

  if (!student) return <p>Student not found.</p>

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedData({ ...updatedData, [e.target.id]: e.target.value })
  }

  const handleSave = async () => {
    console.log(updatedData)
    await editStudent(updatedData)
    setIsDialogOpen(false)
  }

  const handleDelete = async () => {
    try {
      console.log(`🟡 Attempting to delete student with id: ${student.roll_no}`);
  
      await deleteStudent(student.roll_no);
  
      console.log(`✅ Student with id ${student.roll_no} deleted successfully`);
      
      // Redirect to the students list page after deletion
      window.location.href = "/students";
    } catch (error) {
      console.error("❌ Error deleting student:", error);
    }
  };
  

  // Function to determine badge color based on grade
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-green-500 hover:bg-green-600"
      case "B+":
      case "B":
        return "bg-blue-500 hover:bg-blue-600"
      case "C+":
      case "C":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "D":
        return "bg-orange-500 hover:bg-orange-600"
      case "F":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  // Function to get progress color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-blue-500"
    if (score >= 70) return "bg-yellow-500"
    if (score >= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <Link href="/students">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to students</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
          <Badge variant="outline" className="ml-2">
            {student.roll_no}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Edit className="h-4 w-4" /> Edit Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Student Profile</DialogTitle>
                <DialogDescription>Update student and marks details below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  {Object.entries(student).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={key} className="text-right capitalize">
                        {key.replace("_", " ")}
                      </Label>
                      <Input
                        id={key}
                        value={updatedData[key as keyof typeof updatedData] || ""}
                        onChange={handleChange}
                        className="col-span-3"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 mt-4">
                  <h3 className="text-lg font-semibold">Academic Information</h3>
                  {Object.entries(marks).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={key} className="text-right capitalize">
                        {key.replace("_", " ")}
                      </Label>
                      <Input
                        id={key}
                        type="number"
                        value={updatedData[key as keyof typeof updatedData] || ""}
                        onChange={handleChange}
                        className="col-span-3"
                        readOnly={["grade", "percentage", "total"].includes(key)} // Make read-only
                      />
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSave}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {student.name}'s record and all associated
                  data from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Personal Information */}
        <Card className="md:col-span-1 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-muted/50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Student's personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col items-center gap-4 pb-4 border-b">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{student.username}</h3>
                <p className="text-sm text-muted-foreground">@{student.username}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{student.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{student.dob}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="md:col-span-2 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-muted/50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Academic Performance
            </CardTitle>
            <CardDescription>Student's academic results and grades</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="subjects">Subject Marks</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Award className="h-8 w-8 text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <p className="text-3xl font-bold">{marks.grade}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Percent className="h-8 w-8 text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">Percentage</p>
                      <p className="text-3xl font-bold">{marks.percentage}%</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <BookOpen className="h-8 w-8 text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-3xl font-bold">{marks.total}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Overall Percentage</span>
                          <span className="text-sm font-medium">{marks.percentage}%</span>
                        </div>
                        <Progress value={marks.percentage} className={getScoreColor(marks.percentage)} />
                      </div>

                      <div className="pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-medium">Final Grade</span>
                          <Badge className={getGradeColor(marks.grade)}>{marks.grade}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subjects">
                <div className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Marks</TableHead>
                        <TableHead className="text-right">Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: "OSD", score: marks.osd },
                        { name: "DSA", score: marks.dsa },
                        { name: "Python", score: marks.python },
                        { name: "PD", score: marks.pd },
                        { name: "OSE", score: marks.ose },
                        { name: "DBA", score: marks.dba },
                      ].map((subject) => (
                        <TableRow key={subject.name}>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell className="text-right">{subject.score}</TableCell>
                          <TableCell className="text-right">
                            <Progress value={subject.score} className={getScoreColor(subject.score)} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-muted/30 flex justify-between">
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
              <Edit className="h-3 w-3 mr-2" /> Update Marks
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

