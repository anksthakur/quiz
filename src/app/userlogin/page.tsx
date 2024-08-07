"use client";
import React from "react";
import LoginForm from "../components/LoginForm";

const Page = () => {
  return (
    <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Sign in to your account
          </h1>
          <LoginForm />
        </div>
      </div>
    </section>
  );
};

export default Page;
