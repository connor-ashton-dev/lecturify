import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="w-full p-6 flex justify-between bg-white shadow-md">
      <h1>Lecturify</h1>
      <div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default Navbar;
