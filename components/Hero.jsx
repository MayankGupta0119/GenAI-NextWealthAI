"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import BannerImage from "@/public/banner.jpg";
import Image from "next/image";
const splitText = (text) =>
  text.split("").map((char, i) =>
    char === " " ? (
      <span
        key={i}
        style={{ "--i": i }}
        className="bg-gradient-to-r from-green-400 via-green-500 to-purple-600 bg-clip-text text-transparent"
      >
        {"\u00A0"}
      </span>
    ) : (
      <span
        key={i}
        style={{ "--i": i }}
        className="bg-gradient-to-r from-[#11998E]  to-[#38EF7D] bg-clip-text text-transparent"
      >
        {char}
      </span>
    )
  );
const Hero = () => {
  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="split-text text-5xl md:text-7xl lg:text-[86px] font-extrabold tracking-normal pr-2 pb-2">
          {splitText("Manage Your Finances With AI-Powered Insights")}
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
          <div>
            <Image
              src={BannerImage}
              alt="Banner"
              className="  w-[650px] max-w-full h-150"
            />
          </div>
          <div>
            {/* <p
              className="text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed font-semibold tracking-wide text-center md:text-left md:leading-relaxed md:pr-8 lg:pr-16 lg:text-3xl lg:leading-snug lg:max-w-xl lg:mx-0 lg:tracking-normal lg:font-normal md:font-semibold md:tracking-normal  md:max-w-lg md:mx-auto lg:py-0 lg:text-left  lg:text-gray-800  lg:px-4 
            "
            >
              {" "}
              An AI Powered Financial Assistant to help you track, analyze, and
              optimize your financial health.
              <br />
              Track your expenses, investments, and savings with ease.
            </p> */}
            
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
          <Link href="/dashboard">
            <Button className="px-8 cursor-pointer" size="lg">
              Get Started
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="px-8 cursor-pointer" size="lg">
              Watch Demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
