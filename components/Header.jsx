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
import Logo from "@/public/NexWealthLogo.png";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkuser";

const Header = async() => {
  await checkUser();
  return (
    <div className=" bg-[#F8FAFC] fixed top-0 w-full  backdrop-blur-lg z-50 px-2 border-b border-gray-200">
      <nav className="container mx-auto py-1 px-2 flex items-center justify-between">
        <Link href={"/"}>
          <Image
            src={Logo}
            alt="NexWealth Logo"
            height={200}
            width={200}
            className="h-18 auto object-contain"
          />
        </Link>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button
                className={
                  "cursor-pointer bg-green-500 text-white py-3 px-6 rounded-lg text-base font-medium shadow-md transition-all duration-300 hover:bg-[#009A5C] hover:shadow-lg"
                }
                variant={"outline"}
              >
                <LayoutDashboard size={18} />
                <span className="hidden md:inline shiny-text">DashBoard</span>
              </Button>
            </Link>
            <Link href={"/transaction/create"}>
              <Button
                className={
                  "cursor-pointer bg-green-500 text-white py-3 px-6 rounded-lg text-base font-medium shadow-md transition-all duration-300 hover:bg-[#009A5C] hover:shadow-lg"
                }
              >
                <PenBox size={18} />
                <span className="hidden md:inline shiny-text">
                  Add Transaction
                </span>
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-20 w-20", // keep for fallback
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              {/* after login it will redirect to dashboard */}
              <Button
                className={
                  "cursor-pointer bg-green-500 text-white py-3 px-6 rounded-lg text-base font-medium shadow-md transition-all duration-300 hover:bg-[#009A5C] hover:shadow-lg"
                }
                variant={"outline"}
              >
                <span className="shiny-text">Login</span>
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </div>
  );
};

export default Header;
