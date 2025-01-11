"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { useTheme } from "@/context/context";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReservationDropdown } from "@/components/shopping-cart";
import CustomerProfile from "@/components/profileSelf";
import EditProfile from "@/components/edit-profile";
import { jwtDecode } from "jwt-decode";
import Alert from "@/components/ui/alert";
import ReservationDetails from "@/app/(pages)/client/reservationDetails/page";


interface JWTPayload {
  cin?: string;
  sub?: string;
}

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

export default function HeaderClient() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [isOpenReservation, setIsOpenReservation] = useState(false);
  const [reservationOpened, setReservationOpened] = useState<number>(0);
  // Initialize customer with default empty values instead of null
  const [customer, setCustomer] = useState<Customer>({
    cin: "",
    lastName: "",
    firstName: "",
    email: "",
    phoneNumber: "",
  });
  const [isAlertVisible, setIsAlertVisible] = useState<AlertType>({
    visible: false,
    message: "",
    type_alert: "",
  });

  const handleLogout = () => {
    setShowConfirmation(true);
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    router.push("/");
    setShowConfirmation(false);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleEditClick = () => {
    setEditProfile(true);
    setShowProfile(false);
  };

  // Update the handler to accept non-null Customer
  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomer(updatedCustomer);
    setEditProfile(false);
    setShowProfile(true);
    setIsAlertVisible({
      visible: true,
      message: "Profile updated successfully",
      type_alert: "success",
    });
    setTimeout(() => {
      setIsAlertVisible({ visible: false, message: "", type_alert: "" });
    }, 2500);
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

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        if (!jwtToken) {
          handleErrorMessage("Not authenticated. Please login again.");
          return;
        }

        let cin: string;
        try {
          const decodedToken = jwtDecode<JWTPayload>(jwtToken);
          cin = decodedToken.cin || decodedToken.sub || "";
          if (!cin) {
            throw new Error("CIN not found in token");
          }
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          handleErrorMessage("Invalid authentication token");
          return;
        }

        const response = await fetch(`http://localhost:8081/User/${cin}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Customer = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        handleErrorMessage("Failed to load profile data");
      }
    }

    fetchCustomerData();
  }, []);

  const handleClickedReservation = (id: number) => {
    setIsOpenReservation(true);
    setReservationOpened(id);
  };

  return (
    <>
      {isAlertVisible.visible && (
        <Alert
          type_alert={isAlertVisible.type_alert}
          message={isAlertVisible.message}
        />
      )}

      <header className="z-30 w-[95%] mx-auto mt-2 md:mt-5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div
            className={`relative flex h-14 items-center justify-between gap-3 rounded-2xl px-3 
          ${
            isDarkMode
              ? "bg-gray-900/90 before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box]"
              : "bg-gray-100 before:[background:linear-gradient(to_right,theme(colors.gray.200),theme(colors.gray.300),theme(colors.gray.200))_border-box]"
          } 
          before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent 
          before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] 
          after:absolute after:inset-0 after:-z-10 after:backdrop-blur-sm`}
          >
            {/* Logo */}
            <div className="flex flex-1 items-center">
              <Logo />
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 items-center justify-center gap-4">
              <Link
                href="/client"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-purple-600 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                </svg>
                Home
              </Link>
            </nav>

            {/* Right side items */}
            <div className="flex flex-1 items-center justify-end gap-4">
              {/* Profile */}
              <button
                onClick={handleProfileClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-purple-600 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-2.3 0-7 1.2-7 3.5V20h14v-2.5c0-2.3-4.7-3.5-7-3.5z" />
                </svg>
                Profile
              </button>

              {/* Shopping Cart */}
              {/* { isOpenReservationDropdown && */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative text-slate-50 cursor-pointer">
                    <ReservationDropdown handleClickedReservation={handleClickedReservation} />
                  </div>
                </DropdownMenuTrigger>
              </DropdownMenu>
              {/* } */}
              {/* Logout */}
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-purple-600 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16 13v-2h-4V9l-5 3 5 3v-2h4zm1 7H7c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v5h-2V6H7v12h10v-5h2v5c0 1.1-.9 2-2 2z" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-purple-600">
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
            </DialogHeader>
            <p className="py-4">Are you sure you want to log out?</p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
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
            <CustomerProfile
              customer={customer}
              setCustomer={setCustomer}
              handleEditClick={handleEditClick}
              setShowProfile={setShowProfile}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        {editProfile && (
          <EditProfile
            customerData={customer} // No need for null check since customer is always defined
            handleUpdateCustomer={handleUpdateCustomer}
            handleCancel={() => setEditProfile(false)}
            onErrorMessage={handleErrorMessage}
          />
        )}
         {isOpenReservation && (
          <ReservationDetails reservationId={reservationOpened} handleCancel={() => setIsOpenReservation(false)} />
        )}
      </header>
    </>
  );
}
