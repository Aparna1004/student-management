"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Plus, Search, SortAsc, SortDesc } from "lucide-react"
import Link from "next/link"
import { addStudent } from "@/server/auth"

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

export default function StudentsTable({ initialStudents }: StudentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Student | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [students, setStudents] = useState(initialStudents)
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

  const itemsPerPage = 5

  const filteredStudents = useMemo(() => {
    let result = [...students]

    if (searchTerm) {
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (sortField) {
      result.sort((a, b) => {
        const valueA = a[sortField]?.toString().toLowerCase() || ""
        const valueB = b[sortField]?.toString().toLowerCase() || ""

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return result
  }, [students, searchTerm, sortField, sortDirection])

  const paginatedStudents = useMemo(() => {
    return filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filteredStudents, currentPage])

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
    setCurrentPage(1)
  }

  const handleExportCSV = () => {
    const csvContent = [
      ["ID", "Roll No", "Name", "Email", "Phone", "Address", "DOB", "Sem", "Branch", "Mentor"],
      ...filteredStudents.map(s => [s.id, s.roll_no, s.name, s.email, s.phone, s.address, s.dob, s.sem, s.branch, s.mentor])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "students.csv"
    link.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value })
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const addedStudent = await addStudent(
        newStudent.name,
        newStudent.roll_no,
        newStudent.email,
        newStudent.phone,
        newStudent.address,
        newStudent.dob,
        newStudent.sem,
        newStudent.branch,
        newStudent.mentor
      );
      
      setStudents([...students, addedStudent]);
      setOpen(false);
      setNewStudent({
        name: "",
        roll_no: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        sem: 1,
        branch: "",
        mentor: "",
      });
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };
  

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">Students</h2>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {filteredStudents.length} total
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

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
              <form onSubmit={handleAddStudent} className="grid gap-4">
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
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search students..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {["roll_no", "name", "email", "phone", "address", "dob", "sem", "branch", "mentor"].map((field) => (
              <TableHead key={field} className="cursor-pointer" onClick={() => handleSort(field as keyof Student)}>
                <div className="flex items-center gap-1">
                  {field.toUpperCase()}
                  {sortField === field && (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedStudents.map(student => (
            <TableRow key={student.id}>
              <TableCell>{student.roll_no}</TableCell>
              <TableCell><Link href={`/students/${student.id}`} className="hover:underline text-primary">{student.name}</Link></TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.phone}</TableCell>
              <TableCell>{student.address}</TableCell>
              <TableCell>{student.dob}</TableCell>
              <TableCell>{student.sem}</TableCell>
              <TableCell>{student.branch}</TableCell>
              <TableCell>{student.mentor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
