"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

export const menuGroups = [
  // {
  //   name: "DASHBOARD",
  //   menuItems: [
  //     {
  //       icon: (
  //         <svg
  //           className="fill-current"
  //           width="24"
  //           height="24"
  //           viewBox="0 0 24 24"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z"
  //             fill="currentColor"
  //           />
  //         </svg>
  //       ),
  //       label: "Dashboard",
  //       route: "#",
  //       children: [
  //         { label: "Overview", route: "/" },
  //         { label: "Sales Analytics", route: "/dashboard/analytics" },
  //         { label: "Orders", route: "/dashboard/orders" },
  //       ],
  //     },
  //   ],
  // },
  {
  name: "Reports",
  menuItems: [
    {
      icon: (
        <svg
          className="fill-current"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3V21H21V3H3ZM9 17H7V11H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"
            fill="currentColor"
          />
        </svg>
      ),
      label: "Dashboard",
      route: "/reports",
    },
  ],
},
  {
    name: "Hero Section",
    menuItems: [
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 5H21C21.5523 5 22 5.44772 22 6V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V6C2 5.44772 2.44772 5 3 5ZM4 7V17H20V7H4ZM6 9H18V11H6V9ZM6 13H12V15H6V13Z"
              fill="currentColor"
            />
          </svg>
        ),
        label: "Hero Section",
        route: "/sliders",

      },
     
    ],
  },
  {
    name: "PRODUCTS",
    menuItems: [
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 16V8L12 2L3 8V16L12 22L21 16ZM12 4.44L18.5 8.5L12 12.56L5.5 8.5L12 4.44ZM5 10.28L11 14.11V19.56L5 15.72V10.28ZM13 19.56V14.11L19 10.28V15.72L13 19.56Z"
              fill="currentColor"
            />
          </svg>
        ),
        label: "Products",
        route: "#",
        children: [
          { label: "All Products", route: "/products" },
          { label: "Add Product", route: "/products/add" },
          // { label: "Categories", route: "/products/categories" },
          // { label: "Inventory", route: "/products/inventory" },
        ],
      },
    ],
  },
   {
    name: "Orders",
    menuItems: [
      {
        icon: (
         <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 4H4V6H20V4ZM4 8H20L19 20H5L4 8ZM7 10L7.5 18H16.5L17 10H7Z"
              fill="currentColor"
            />
          </svg>
        ),
        label: "Orders",
        route: "/orders",

      },
     
    ],
  },
{
  name: "Enquiry",
  menuItems: [
    {
      icon: (
        <svg
          className="fill-current"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H6L2 22V6C2 4.9 2.9 4 4 4ZM4 6V18.17L5.17 17H20V6H4ZM6 8H18V10H6V8ZM6 12H14V14H6V12Z"
            fill="currentColor"
          />
        </svg>
      ),
      label: "Enquiry",
      route: "/enquiry",
    },
  ],
},
{
  name: "Content",
  menuItems: [
    {
      icon: (
        <svg
          className="fill-current"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4ZM4 6V18H20V6H4ZM12 13H6V11H12V13ZM18 9H6V7H18V9ZM18 17H6V15H18V17Z"
            fill="currentColor"
          />
        </svg>
      ),
      label: "Blogs",
      route: "/blogs",
    },
  ],},

{
  name: "Reports",
  menuItems: [
    {
      icon: (
       <svg
  className="fill-current"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M3 5H21V7H3V5ZM3 11H21V13H3V11ZM3 17H21V19H3V17Z"
    fill="currentColor"
  />
</svg>

      ),
      label: "Categories",
      route: "/categories",
    },
  ],
}
  ,
  
  {
    name: "ORDERS & CUSTOMERS",
    menuItems: [
      // {
      //   icon: (
      //     <svg
      //       className="fill-current"
      //       width="24"
      //       height="24"
      //       viewBox="0 0 24 24"
      //       xmlns="http://www.w3.org/2000/svg"
      //     >
      //       <path
      //         d="M20 4H4V6H20V4ZM4 8H20L19 20H5L4 8ZM7 10L7.5 18H16.5L17 10H7Z"
      //         fill="currentColor"
      //       />
      //     </svg>
      //   ),
      //   label: "Orders",
      //   route: "#",
      //   children: [
      //     { label: "All Orders", route: "/orders" },
      //     { label: "Pending Orders", route: "/orders/pending" },
      //     { label: "Completed Orders", route: "/orders/completed" },
      //   ],
      // },
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20H4Z"
              fill="currentColor"
            />
          </svg>
        ),
        label: "Customers",
        route: "/customers",
      },
    ],
  },
  // {
  //   name: "SETTINGS & OTHERS",
  //   menuItems: [
  //     {
  //       icon: (
  //         <svg
  //           className="fill-current"
  //           width="24"
  //           height="24"
  //           viewBox="0 0 24 24"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             d="M12 2C13.11 2 14 2.89 14 4V5H10V4C10 2.89 10.89 2 12 2ZM19 7H5C3.9 7 3 7.9 3 9V20C3 21.11 3.9 22 5 22H19C20.11 22 21 21.11 21 20V9C21 7.9 20.11 7 19 7ZM12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19Z"
  //             fill="currentColor"
  //           />
  //         </svg>
  //       ),
  //       label: "Settings",
  //       route: "#",
  //       children: [
  //         { label: "General", route: "/settings/general" },
  //         { label: "Payment", route: "/settings/payment" },
  //         { label: "Shipping", route: "/settings/shipping" },
  //       ],
  //     },
  //     {
  //       icon: (
  //         <svg
  //           className="fill-current"
  //           width="24"
  //           height="24"
  //           viewBox="0 0 24 24"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             d="M3 13H21V11H3V13ZM3 6H21V4H3V6ZM3 20H21V18H3V20Z"
  //             fill="currentColor"
  //           />
  //         </svg>
  //       ),
  //       label: "Reports",
  //       route: "#",
  //       children: [
  //         { label: "Sales Report", route: "/reports/sales" },
  //         { label: "Inventory Report", route: "/reports/inventory" },
  //       ],
  //     },
  //   ],
  // },
];


const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
          }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <div className="relative pr-4.5">
            <Link href="/products" className="flex items-center space-x-3">
              {/* Mint Circle with 'A' */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1daa61]/20">
                <span className="text-[#1daa61] font-bold text-xl">A</span>
              </div>

              {/* Company Name */}
              <span className="text-[#1daa61] font-semibold text-2xl sm:text-xl leading-tight">
                Arya <span className="text-gray-800 font-semibold">Enterprises</span>
              </span>
            </Link>
          </div>


          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>


                <ul className="mb-6 flex flex-col gap-2">
                  {group?.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
