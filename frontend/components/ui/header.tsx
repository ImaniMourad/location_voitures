"use client";

import Link from "next/link";
import Logo from "./logo";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/context/context";
import useAuth from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useState } from "react";
import { Button } from "./button";
import { ShoppingCart } from "@/components/shopping-cart";

export default function Header() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [reservations, setReservations] = useState(2);

  return (
    <header className="z-30 w-[95%] mx-auto mt-2 md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-sm">
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          {/* Navigation */}
          <ul className="flex flex-1 items-center justify-end gap-4">
            {/* Dark Mode Switch */}
            <li className="flex items-center gap-2">
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                className={`${
                  isDarkMode
                    ? "bg-indigo-600"
                    : "bg-gray-300 border border-gray-500"
                }`}
              />
              <Label
                htmlFor="dark-mode"
                className={`${
                  isDarkMode ? "text-indigo-300" : "text-yellow-400"
                }`}
              >
                {isDarkMode ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
              </Label>
            </li>
            <>
              <li>
                <Link
                  href="/signin"
                  className="btn-sm relative bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] py-[5px] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
                >
                  Sign Up
                </Link>
              </li>
            </>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className="relative text-slate-50 cursor-pointer"
                  >
                    <ShoppingCart />
                    {reservations > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                        {reservations}
                      </span>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="justify-between">
                    Active Reservations
                    <span className="font-bold text-indigo-600">{reservations}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    View All Reservations
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
