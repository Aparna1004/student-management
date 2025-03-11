"use client"

import { useState, useMemo, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Plus, Search, SortAsc, SortDesc } from "lucide-react"
import Link from "next/link"

interface Student {
  id: string
  name: string
  roll_no: string
  email: string
  phone: string
  address: string
  dob: string
  sem: number
  branch: string
  mentor: string
}

interface StudentsTableProps {
  initialStudents: Student[]
}

function AddStudent({ onAddStudent }: { onAddStudent: (student: Student) => void }) {
  const [open, setOpen] = useState(false)
  const [newStudent, setNewStudent] = useState<Student>({
    id: "",
    name: "",
    roll_no: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    sem: 1,
    branch: "",
    mentor: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStudent),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Failed to add student")
        }

        const addedStudent = await res.json()
        onAddStudent(addedStudent)
        setOpen(false)
        setNewStudent({ id: "", name: "", roll_no: "", email: "", phone: "", address: "", dob: "", sem: 1, branch: "", mentor: "" })
      } catch (error) {
        console.error("Failed to add student:", error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Input name="roll_no" placeholder="Roll No" value={newStudent.roll_no} onChange={handleInputChange} required />
          <Input name="name" placeholder="Name" value={newStudent.name} onChange={handleInputChange} required />
          <Input name="email" type="email" placeholder="Email" value={newStudent.email} onChange={handleInputChange} required />
          <Input name="phone" placeholder="Phone" value={newStudent.phone} onChange={handleInputChange} required />
          <Input name="address" placeholder="Address" value={newStudent.address} onChange={handleInputChange} required />
          <Input name="dob" type="date" value={newStudent.dob} onChange={handleInputChange} required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="sem" type="number" placeholder="Semester" value={newStudent.sem} onChange={handleInputChange} required />
            <Input name="branch" placeholder="Branch" value={newStudent.branch} onChange={handleInputChange} required />
          </div>
          <Input name="mentor" placeholder="Mentor Username" value={newStudent.mentor} onChange={handleInputChange} required />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function StudentsTable({ initialStudents }: StudentsTableProps) {
  const [students, setStudents] = useState(initialStudents)

  const handleAddStudent = (student: Student) => {
    setStudents([...students, student])
  }

  return (
    <div>
      <AddStudent onAddStudent={handleAddStudent} />
      {/* Rest of the StudentsTable component */}
    </div>
  )
}
