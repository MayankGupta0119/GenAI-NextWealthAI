import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import BarLogo from "@/public/logo1.png";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkuser";

const Header = async () => {
  await checkUser();
  return (
    <div className="bg-green-950 fixed top-0 w-full backdrop-blur-lg z-50 px-2 border-b border-gray-200">
      <nav className="container mx-auto py-1 px-2 flex items-center justify-between">
        <Link href={"/"}>
          <Image
            src={BarLogo}
            alt="NextWealthAI Logo"
            height={200}
            width={200}
            className="h-13 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href={"/transaction/create"}>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-20 w-20",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md cursor-pointer">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </div>
  );
};

export default Header;
