"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { CircleDollarSign, Info, ShieldCheck } from "lucide-react";

const Hero = () => {
  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left side content */}
        <div className="space-y-5">
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-[#11998E] to-[#38EF7D] bg-clip-text text-transparent">
              Manage Your Finances,
            </span>
            <br />
            Your Expenses with AI
          </h1>

          {/* Description paragraph */}
          <p className="text-gray-600 text-lg">
            An AI-powered financial assistant to help you track, analyze, and
            optimize your financial health. Track your expenses, investments,
            and savings with ease.
          </p>

          {/* Legal information section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-2 rounded-full">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Legal Information</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Your data is securely stored and encrypted. We never share
                  your financial information with third parties.
                </p>
              </div>
            </div>
          </div>

          {/* CTA button */}
          <div>
            <Link href="/dashboard">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md cursor-pointer">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side - Image instead of placeholder */}
        <div className="hidden md:block relative h-[500px] rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-green-50/30 mix-blend-overlay z-10 rounded-2xl"></div>
          <Image
            src="/right_side.jpeg"
            alt="Financial management illustration"
            fill
            className="object-cover rounded-2xl"
            style={{
              objectFit: "contain",
              backgroundBlendMode: "soft-light",
            }}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
