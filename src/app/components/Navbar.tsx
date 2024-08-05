"use client"
import React from "react";
import Link from "next/link";


const Navbar = () => {


  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <ul className="flex gap-5 sm:flex-row sm:space-x-8 text-sm font-medium">
          <li>
            <Link href="/" className="text-gray-900 dark:text-white hover:underline">Home</Link>
          </li>
          <li>
            <Link href="/adminlogin" className="text-gray-900 dark:text-white hover:underline">Admin</Link>
          </li>
          <li>
            <Link href="/userlogin" className="text-gray-900 dark:text-white hover:underline">User</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
