export const metadata = {
  title: "Home - Open PRO",
  description: "Page description",
};

import PageIllustration from "@/components/page-illustration";
import Fetch from "@/components/fetch";

export default function Home() {
  return (
    <>
      <PageIllustration />
      <br /><br /><br /><br /><br />
      <Fetch />
    </>
  );
}
