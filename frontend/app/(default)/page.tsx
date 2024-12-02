export const metadata = {
  title: "Home - Open PRO",
  description: "Page description",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Fetch from "@/components/fetch";
import ContactForm from "@/components/contactus";

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Fetch />
      <br />
      <Workflows />
      <Features />
      <Testimonials />
      <ContactForm />
      <br />
    </>
  );
}
