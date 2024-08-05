"use client";
import React from "react";
import LoginForm from "../components/LoginForm";

const Page = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 hover:bg-blue-600">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center ">
            Sign in to your account
          </h1>
          <LoginForm />
        </div>
      </div>
    </section>
  );
};

export default Page;
