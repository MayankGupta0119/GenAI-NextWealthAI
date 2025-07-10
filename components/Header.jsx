"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import BarLogo from "@/public/logo1.png";
import { Button } from "./ui/button";
import { LayoutDashboard, Loader2, PenBox } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState({
    dashboard: false,
    transaction: false,
  });

  // Reset loading state when pathname changes (navigation completes)
  useEffect(() => {
    setLoading({
      dashboard: false,
      transaction: false,
    });
  }, [pathname]);

  const handleNavigation = (path) => {
    if (pathname === path) return;

    if (path === "/dashboard") {
      setLoading((prev) => ({ ...prev, dashboard: true }));
      router.push(path);
    } else if (path === "/transaction/create") {
      setLoading((prev) => ({ ...prev, transaction: true }));
      router.push(path);
    }
  };

  return (
    <div className="bg-green-950 fixed top-0 w-full backdrop-blur-lg z-50 px-2 border-b border-gray-200">
      <nav className="container mx-auto py-1 px-2 flex items-center justify-between">
        <Link href={"/"}>
          <Image
            src={BarLogo}
            alt="NextWealthAI Logo"
            height={150}
            width={135}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2"
              onClick={() => handleNavigation("/dashboard")}
              disabled={loading.dashboard}
            >
              {loading.dashboard ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <LayoutDashboard size={18} className="mr-2" />
              )}
              <span className="hidden md:inline">Dashboard</span>
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2"
              onClick={() => handleNavigation("/transaction/create")}
              disabled={loading.transaction}
            >
              {loading.transaction ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <PenBox size={18} className="mr-2" />
              )}
              <span className="hidden md:inline">Add Transaction</span>
            </Button>

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
