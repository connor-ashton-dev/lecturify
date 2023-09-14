import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserButton } from "@clerk/nextjs";
import { initialProfile } from "@/utils/users";

const Navbar = async () => {
  console.log("im here");
  const user = await initialProfile();
  console.log("USER", user);
  return (
    <nav className="w-full p-6 flex justify-between items-center bg-white shadow-md">
      <h1 className="text-2xl font-bold">Lecturify ⚡✏️</h1>
      <div>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
