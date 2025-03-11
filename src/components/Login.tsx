"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authenticateUser } from "@/server/auth";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    const user = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(user);
    if(user){
      router.push("/dashboard");
    }
  },[]);  

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const response = await authenticateUser(form.username, form.password);
    if (response.success) {
      document.cookie = `user=${form.username}; path=/`; // Store in cookies

      alert("Login successful!");
      router.push("/dashboard");
    } else {
      alert(response.message);
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-emerald-600 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <p className="text-center text-gray-500 mb-4">Welcome back!</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-green-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
