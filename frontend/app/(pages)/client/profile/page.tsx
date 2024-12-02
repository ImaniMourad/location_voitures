import PageIllustration from "@/components/page-illustration";
import CustomerProfile from "@/components/profileClient";

export default function ProfilePage() {
  const customerData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Casablanca, Morocco",
    membership: "Premium",
    photo: "/images/default-avatar.png",
  };

  return (
    <div>
      <CustomerProfile customer={customerData} />
      </div>
  );
}
