"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setMessage({ type: "error", text: "Invalid email or password!" });
      } else {
        setMessage({ type: "success", text: "Login successful! Redirecting..." });
        setTimeout(() => {
          window.location.href = "/dashboard"; // Redirect to dashboard
        }, 2000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
      console.error("[Login Error]", error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-16 w-96 h-96 bg-pink-300 dark:bg-pink-700 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 dark:bg-blue-700 rounded-full opacity-30 blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Log In</h1>
        {message.text && (
          <div
            className={`p-3 rounded text-center mb-4 ${
              message.type === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 dark:hover:bg-blue-800 transition"
          >
            Log In
          </button>
        </form>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-pink-500 dark:text-pink-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
