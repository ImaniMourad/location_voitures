"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const path = pathname.split("/");

  //if the path is less than 3, it means we are not in the admin page
  if (path.length < 3) return null;

  const activePath = path[2].charAt(0).toUpperCase() + path[2].slice(1);
  const [activeItem, setActiveItem] = useState<string | null>(activePath);

  const menuItems = [
    {
      title: "Statistics",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M4 20h4V10H4v10zM10 20h4V4h-4v16zM16 20h4v-6h-4v6z" />
        </svg>
      ),
      path: "/admin/statistics",
    },
    {
      title: "Vehicles",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M5 11h14l-1.4-5H6.4L5 11zM5 16c-1.1 0-2-.9-2-2V9c0-.5.2-1 .6-1.4l1.6-3c.3-.5.9-.6 1.3-.6h10c.5 0 1 .2 1.3.6l1.6 3c.4.4.6.9.6 1.4v5c0 1.1-.9 2-2 2H5zm2 2c1.1 0 2-.9 2-2H5c-1.1 0-2 .9-2 2h4zm10 0c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z" />
        </svg>
      ),
      path: "/admin/vehicles",
    },
    {
      title: "Clients",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-2.3 0-7 1.2-7 3.5V20h14v-2.5c0-2.3-4.7-3.5-7-3.5z" />
        </svg>
      ),
      path: "/admin/clients",
    },
    //reservations
    {
      title: "Reservations",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17 2H7c-1.1 0-2 .9-2 2v18l7-3 7 3V4c0-1.1-.9-2-2-2zm-5 15l-5-3V4h10v10l-5 3z" />
        </svg>
      ),
      path: "/admin/reservations",
    },
    {
      title: "Log Out",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M16 13v-2h-4V9l-5 3 5 3v-2h4zm1 7H7c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v5h-2V6H7v12h10v-5h2v5c0 1.1-.9 2-2 2z" />
        </svg>
      ),
      path: "/logout",
    },
  ];

  return (
    <div className="h-screen w-64 bg-[#0f1725] text-white sticky top-0 left-0 z-50">
      <div className="p-4 flex flex-col items-center text-center">
        <Image
          src="/images/fatih.jpg"
          alt="Autocar Brand"
          width={110}
          height={110}
          className="rounded-full"
        />
        <span className="font-medium text-lg mt-2">Pizza quatre fromages</span>
        <hr className="w-full border border-white/20 my-4" />
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link href={item.path} passHref>
                <button
                  onClick={() => setActiveItem(item.title)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    activeItem === item.title
                      ? "bg-purple-600"
                      : "hover:bg-white/10"
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
