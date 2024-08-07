"use client";
import React from "react";
import LoginForm from "../components/LoginForm";
import Link from "next/link";

const Page = () => {
  return (
    <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Sign in to your account
          </h1>
          <LoginForm />
          <Link
            href="/"
            className="w-full block text-center text-white border border-primary-600 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Go To Home Page
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Page;
