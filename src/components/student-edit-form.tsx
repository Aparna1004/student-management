"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { useState } from "react"

interface StudentEditFormProps {
  student: any
  onCancel: () => void
}

export default function StudentEditForm({ student, onCancel }: StudentEditFormProps) {
  const [formData, setFormData] = useState({
    name: student.name,
    email: student.email,
    phone: student.phone,
    dateOfBirth: student.dateOfBirth,
    status: student.status,
    address: student.address,
    parentName: student.parentName,
    parentEmail: student.parentEmail,
    parentPhone: student.parentPhone,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Submitting form data:", formData)
    // After successful submission, exit edit mode
    onCancel()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Edit Student</h1>
        </div>
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Edit student's personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                  <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <FormLabel htmlFor="status">Status</FormLabel>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
              <CardDescription>Edit parent/guardian details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <FormLabel htmlFor="parentName">Parent Name</FormLabel>
                  <Input id="parentName" name="parentName" value={formData.parentName} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                  <FormLabel htmlFor="parentEmail">Parent Email</FormLabel>
                  <Input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <FormLabel htmlFor="parentPhone">Parent Phone</FormLabel>
                  <Input id="parentPhone" name="parentPhone" value={formData.parentPhone} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

