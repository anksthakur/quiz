"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Navbar";

const LayoutPath = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoginPath = pathname.startsWith("/login");
  
  return (
    <div className="flex">
      { !isLoginPath && <Navbar />}
      {children}
    </div>
  );
};

export default LayoutPath;