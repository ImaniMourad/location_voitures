"use client";
import "./css/style.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { ThemeProvider, useTheme } from "../context/context";
import Header from "@/components/ui/header";
import HeaderClient from "@/components/ui/headerClient";
import React from "react";
import Sidebar from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { jwtDecode } from "jwt-decode";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const nacelle = localFont({
  src: [
    {
      path: "../public/fonts/nacelle-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/nacelle-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/nacelle-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/nacelle-semibolditalic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-nacelle",
  display: "swap",
});

const metadata = {
  title: "LocAuto Pro",
  description: "Generated by create next app",
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useTheme();
  const pathname = usePathname();
  const unprotectedRoutes = ["/", "/signup", "/signin", "/reset-password"];
  const isProtectedRoute = !unprotectedRoutes.includes(pathname);
  const isHomePage = pathname === "/";

  // Récupérer le rôle depuis le JWT token
  const getUserRole = () => {
    try {
      const token = localStorage.getItem('jwtToken'); // Ajustez selon où vous stockez votre token
      if (!token) return null;
      const decoded = jwtDecode(token);
      return (decoded as { user_type: string }).user_type; // Assurez-vous que votre token contient bien un champ 'user_type'
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  };

  const userRole = getUserRole();
  const isAdmin = userRole === 'Admin';
  const isClient = userRole === 'Client';

  const renderHeader = () => {
    if (isHomePage) {
      return <Header />;
    }
    if (isClient) {
      return <HeaderClient />;
    }
    return null;
  };

  return (
    <body
      className={`${inter.variable} ${nacelle.variable} ${
        isDarkMode ? "bg-gray-950 text-gray-200" : "bg-gray-300 text-gray-50"
      } font-inter text-base antialiased`}
    >
      {isProtectedRoute ? (
        <ProtectedRoute>
          <div className="flex min-h-screen">
            {isAdmin && (
              <div>
                <Sidebar />
              </div>
            )}
            <div className="flex flex-col w-full">
              {renderHeader()}
              <div className="w-[100%] mx-auto">{children}</div>
            </div>
          </div>
        </ProtectedRoute>
      ) : (
        <>
          {renderHeader()}
          <div className="w-[100%] mx-auto">{children}</div>
        </>
      )}
    </body>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <ThemeProvider>
        <LayoutContent>{children}</LayoutContent>
      </ThemeProvider>
    </html>
  );
}