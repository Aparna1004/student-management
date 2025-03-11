"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Calendar, FileText, BarChart, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function LandingPage() {
  const features = [
    { icon: Users, title: "Student Management", desc: "Manage student profiles, admissions, and academic records." },
    { icon: Calendar, title: "Attendance Tracking", desc: "Automate attendance tracking and generate reports." },
    { icon: FileText, title: "Course Management", desc: "Create and manage courses, assignments, and materials." },
    { icon: BarChart, title: "Performance Analytics", desc: "Gain insights with detailed analytics and reports." },
    { icon: Award, title: "Grading System", desc: "Customize grading systems and automate report cards." },
    { icon: Users, title: "Parent Portal", desc: "Keep parents informed with real-time student updates." },
  ];

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 lg:px-10 h-16 flex items-center border-b bg-white shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
          <GraduationCap className="h-6 w-6 text-green-600" />
          <span>EduManage</span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <Link href={'/login'}><Button variant="outline" size="sm" >Log in</Button></Link>
          <Link href={'/register'}><Button size="sm" className="bg-green-600 hover:bg-green-700">Sign up</Button></Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-6 md:px-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-gray-900">
                  Simplify Student Management with <span className="text-green-600">EduManage</span>
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-lg">
                  The all-in-one platform for educational institutions to manage students, courses, attendance, and performance effortlessly.
                </p>
                <Link href={"/login"}><Button size="lg" className="px-8 bg-green-600 hover:bg-green-700">Get Started</Button></Link>
              </div>
              <div className="mx-auto lg:ml-auto">
                <Image
                  src="/dashboard.png"
                  alt="Student Management Dashboard"
                  width={500}
                  height={500}
                  className="rounded-lg shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 bg-gray-100">
          <div className="container mx-auto px-6 md:px-10 text-center">
            <div className="mb-10">
              <div className="inline-block rounded-lg bg-green-600 px-4 py-1 text-white text-sm">Features</div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 mt-4">
                Everything You Need to Manage Your Institution
              </h2>
              <p className="max-w-[700px] mx-auto text-gray-600 mt-3 md:text-lg">
                Our comprehensive suite of tools helps you streamline administrative tasks and focus on what matters most - education.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                  {React.createElement(feature.icon, { className: "h-12 w-12 text-green-600" })}
                  <h3 className="text-xl font-bold mt-3">{feature.title}</h3>
                  <p className="text-gray-600 text-center mt-2">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white py-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-green-600" />
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} EduManage. All rights reserved.</p>
          </div>
          <nav className="flex gap-4">
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition">Terms</Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition">Privacy</Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-green-600 transition">Cookies</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}