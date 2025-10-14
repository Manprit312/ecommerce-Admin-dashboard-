"use client";
import React from "react";
import { useRouter } from "next/navigation";
const ECommerce: React.FC = () => {
  const router=useRouter()
  router.push("/products")
  return (
    <>
     
    </>
  );
};

export default ECommerce;
