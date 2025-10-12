"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import { Toaster } from "react-hot-toast";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {

      const token = localStorage.getItem("adminToken");
      if (!token) router.replace("/auth/signin");
    
  }, [router]);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Toaster position="top-right" reverseOrder={false} />
        {loading ? <Loader /> : children}
      </body>
    </html>
  );
}
