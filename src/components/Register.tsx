"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/server/auth"; // Import the server action
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Register() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const response = await registerUser(form.name, form.username, form.email, form.password);

    alert(response.message);

    if (response.success) {
      router.push("/login"); // Redirect to login after successful registration
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Create an Account</h2>
        <p className="text-center text-gray-500 mb-4">Join us today!</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border-gray-300 focus:ring-blue-500"
          />
          <Input
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="border-gray-300 focus:ring-blue-500"
          />
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="border-gray-300 focus:ring-blue-500"
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="border-gray-300 focus:ring-blue-500"
          />

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
