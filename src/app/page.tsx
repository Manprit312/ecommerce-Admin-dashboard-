
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";

// ⛔ Do NOT import ECommerce or DefaultLayout directly
const DefaultLayout = dynamic(() => import("@/components/Layouts/DefaultLaout"), {
  ssr: false,
});
const ECommerce = dynamic(() => import("@/components/Dashboard/E-commerce"), {
  ssr: false,
});

export default function Home() {
    const router = useRouter();

  useEffect(() => {
  
      const token = localStorage.getItem("adminToken");
      if (!token) router.replace("/auth/signin");
    
  }, [router]);
  return (
    <DefaultLayout>
      <ECommerce />
    </DefaultLayout>
  );
}
