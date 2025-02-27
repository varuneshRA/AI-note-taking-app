"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Layout, Shield } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import UploadPdfDailog from "./UploadPdfDailog";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

function SideBar() {
  const { user } = useUser();
  const path = usePathname();
  const router = useRouter();

  const GetUserInfo = useQuery(api.user.GetUserInfo, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const isUpgraded = GetUserInfo?.upgrade;

  // Automatically redirect to workspace after payment
  useEffect(() => {
    if (isUpgraded && path === "/dashboard/upgrade") {
      router.push("/dashboard");
    }
  }, [isUpgraded, path, router]);

  return (
    <div className="shadow-md h-screen p-7">
      <Image src={"/logo.svg"} alt="logo" width={50} height={50} className="mt-2" />
      {/* Display Version at Top */}
      <h2 className="text-2xl font-bold mt-3">{isUpgraded ? "Pro Version" : "Free Version"}</h2>

      <div className="mt-10">
        <UploadPdfDailog isMaxFile={fileList?.length >= 5 && !isUpgraded}>
          <Button className="w-full">+ Upload PDF</Button>
        </UploadPdfDailog>

        {/* Workspace Link */}
        <Link href={"/dashboard"}>
          <div
            className={`flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer ${
              path == "/dashboard" && "bg-slate-100"
            }`}
          >
            <Layout />
            <h2>Workspace</h2>
          </div>
        </Link>

        {/* Upgrade Link - Disabled if user is upgraded */}
        <div
          className={`flex gap-2 items-center p-3 mt-1 rounded-lg ${
            isUpgraded ? "cursor-not-allowed opacity-50" : "hover:bg-slate-100 cursor-pointer"
          } ${path == "/dashboard/upgrade" && "bg-slate-100"}`}
        >
          <Shield />
          {isUpgraded ? (
            <h2 className="text-gray-400">Upgrade</h2>
          ) : (
            <Link href={"/dashboard/upgrade"}>
              <h2>Upgrade</h2>
            </Link>
          )}
        </div>

        

        {/* Progress Bar for Free Users */}
        {!isUpgraded && (
          <div className="absolute bottom-24 w-[80%]">
            <Progress value={(fileList?.length / 5) * 100} />
            <p className="text-sm mt-1">{fileList?.length} out of 5 PDFs Uploaded</p>
            <p className="text-sm text-gray-400 mt-2">Upgrade to Upload more PDFs</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBar;
