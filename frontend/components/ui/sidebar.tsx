"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomerProfile from "../profileSelf";
import { useTheme } from "../../context/context";
import EditProfile from "../edit-profile";

interface Customer {
  cin: string;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  password?: string;
}

type AlertType = {
  visible: boolean;
  message: string;
  type_alert: "" | "success" | "error";
};

export default function Sidebar() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const path = pathname.split("/");

  // If the path is less than 3, it means we are not in the admin page
  if (path.length < 3) return null;

  const activePath = path[2].charAt(0).toUpperCase() + path[2].slice(1);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
    const [isAlertVisible, setIsAlertVisible] = useState<AlertType>({
          visible: false,
          message: "",
          type_alert: "",
        });
    

   const handleEditClick = () => {
    setEditProfile(true);
    setShowProfile(false);
  }


  useEffect(() => {
    setActiveItem(activePath);
  }, [activePath]);

  const handleLogoutClick = () => {
    localStorage.clear();
    router.push("/");
  };

  const handleLogout = () => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleConfirmLogout = () => {
    handleLogoutClick();
    setShowConfirmation(false);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleUpdateCustomer = (updatedCustomer: any) => {
    setCustomer(updatedCustomer);
  };

  const handleErrorMessage = (message: string) => {
    setIsAlertVisible({
      visible: true,
      message: message,
      type_alert: "error",
    });
    setTimeout(() => {
      setIsAlertVisible({ visible: false, message: "", type_alert: "" });
    }, 2500);
  };

  const menuItems = [
    {
      title: "Profile",
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
      path: "/admin/profile",
      onClick: handleProfileClick,
    },
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
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <div
        className={`h-screen w-64 ${
          isDarkMode ? "bg-[#0f1725] text-white" : "bg-[#f5f5f5] text-black"
        } sticky top-0 left-0 z-50`}
      >
        <nav className="p-4">
          <ul className="space-y-2 mt-12">
            {menuItems.map((item) => (
              <li key={item.title}>
                {item.path === "/logout" || item.title === "Profile" ? (
                  <button
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      activeItem === item.title
                        ? "bg-purple-600"
                        : "hover:bg-white/10"
                    }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </button>
                ) : (
                  <Link href={item.path} passHref>
                    <button
                      onClick={() => setActiveItem(item.title)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        activeItem === item.title
                          ? "bg-purple-600 text-white"
                          : "hover:bg-black/10"
                      }`}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </button>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px] bg-[#0f1725] text-white border-purple-600">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <p className="py-4">Are you sure you want to log out?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmLogout}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[400px] bg-gray-800 text-white border-blue-600 p-0">
          <CustomerProfile customer={customer}  setCustomer={setCustomer}   handleEditClick={handleEditClick} setShowProfile={setShowProfile} />
        </DialogContent>
      </Dialog>
          {editProfile && (
            <EditProfile
              customerData={customer || { cin: '', lastName: '', firstName: '', email: '', phoneNumber: '' }}
              handleUpdateCustomer={handleUpdateCustomer}
              handleCancel={() => setEditProfile(false)}
              onErrorMessage={handleErrorMessage}
            />
          )}
    </>
  );
}
