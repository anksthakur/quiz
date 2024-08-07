"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginForm from "../components/LoginForm";

// Function to set cookies
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const expiresStr = `expires=${expires.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expiresStr}; path=/; Secure; SameSite=Strict`;
};

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Example user details
  const userDetails = [
    {
      username: "admin",
      password: "Admin@123",
      token: "your-auth-token", // Replace with your actual token or generate it dynamically
    },
  ];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = userDetails.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      // Set user details and token in cookies
      setCookie("authToken", user.token, 1);
      setCookie("username", user.username, 1);

      // Redirect to admin page
      router.push("/admin");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center md:text-left">
            Sign in to your account
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              className="w-full text-white border border-primary-600 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Sign in
            </button>
            
          </form>
          <h1 className="text-white flex justify-center">-----OR-----</h1>
          <LoginForm/>
          <Link
              href="/admin"
              className="w-full block text-center text-white border border-primary-600 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Go To Home Page
            </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
