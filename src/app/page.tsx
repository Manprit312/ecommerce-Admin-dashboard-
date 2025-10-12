"use client"
import ECommerce from "@/components/Dashboard/E-commerce";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import { isAuthenticated } from "@/utils/auth";



export default function Home() {

  const router = useRouter();
  useEffect(() => {
    // If no admin token → redirect to signin
    if (!isAuthenticated()) {
      router.replace("/auth/signin");
    }
  }, [])
  return (
    <>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </>
  );
}
