import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserButton } from "@clerk/nextjs";
import { initialProfile } from "@/utils/users";
import Link from "next/link";

const Navbar = async () => {
  //TODO: Something here
  const user = await initialProfile();
  return (
    <nav className="w-full p-6 flex justify-between items-center bg-white shadow z-10">
      <Link href="/">
        <h1 className="text-2xl tracking-wide font-bold">Lecturify ⚡✏️</h1>
      </Link>
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
