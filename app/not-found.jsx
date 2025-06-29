import GoBackButton from "@/components/GoBackButton";
import TVNotFound404 from "@/components/TVNotFound404";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <TVNotFound404 />
        <Link href={"/dashboard"} className="top-0">
          <GoBackButton />
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
