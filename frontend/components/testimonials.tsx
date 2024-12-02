"use client";

import { useState } from "react";
import useMasonry from "@/utils/useMasonry";
import Image, { StaticImageData } from "next/image";
import TestimonialImg01 from "@/public/images/testimonial-01.jpg";
import TestimonialImg02 from "@/public/images/testimonial-02.jpg";
import TestimonialImg03 from "@/public/images/testimonial-03.jpg";
import TestimonialImg04 from "@/public/images/testimonial-04.jpg";
import TestimonialImg05 from "@/public/images/testimonial-05.jpg";
import TestimonialImg06 from "@/public/images/testimonial-06.jpg";
import TestimonialImg07 from "@/public/images/testimonial-07.jpg";
import TestimonialImg08 from "@/public/images/testimonial-08.jpg";

const testimonials = [
  {
    img: TestimonialImg01,
    name: "Sarah M.",
    company: "CityDrive Rentals",
    content:
      "I had an amazing experience with CityDrive Rentals. The car was in perfect condition, and the booking process was seamless. Highly recommend for anyone looking to rent a car hassle-free!",
    categories: [1, 2],
  },
  {
    img: TestimonialImg02,
    name: "James K.",
    company: "AutoLux",
    content:
      "AutoLux provided excellent customer service, and their fleet of cars is top-notch. Renting a luxury car for my business trip was so easy, and the car was immaculate.",
    categories: [1, 3],
  },
  {
    img: TestimonialImg03,
    name: "Emily R.",
    company: "DriveEasy",
    content:
      "DriveEasy made my family vacation stress-free. The car was spacious and comfortable, perfect for long drives. Their prices are unbeatable too!",
    categories: [1, 4],
  },
  {
    img: TestimonialImg04,
    name: "Michael T.",
    company: "BudgetWheels",
    content:
      "If you're on a budget but still want reliable transportation, BudgetWheels is the way to go. I rented a car for a weekend getaway, and it was a great experience overall.",
    categories: [2, 4],
  },
  {
    img: TestimonialImg05,
    name: "Laura H.",
    company: "ZoomCar",
    content:
      "ZoomCar offers a fantastic selection of vehicles, and their mobile app makes it super easy to book. I was impressed with their professionalism and efficiency.",
    categories: [1, 3, 5],
  },
  {
    img: TestimonialImg06,
    name: "David L.",
    company: "RideOn",
    content:
      "Renting a car with RideOn was smooth and straightforward. Their team was friendly and helpful, and the car exceeded my expectations. Great service!",
    categories: [1, 5],
  },
  {
    img: TestimonialImg07,
    name: "Olivia W.",
    company: "PrimeRent",
    content:
      "PrimeRent delivered exceptional service when I needed a car for an event. The vehicle was spotless, and the process was quick and easy.",
    categories: [2, 3],
  },
  {
    img: TestimonialImg08,
    name: "Ethan B.",
    company: "GoMobile",
    content:
      "GoMobile has the most user-friendly booking platform. I had my car ready in no time, and the entire experience was stress-free.",
    categories: [1, 4],
  },
];

export default function Testimonials() {
  const masonryContainer = useMasonry();
  const [category, setCategory] = useState<number>(1);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="border-t py-12">
        <div className="mx-auto max-w-3xl pb-12 text-center">
        <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
            What Our Customers Are Saying
          </h2>
          <p className="text-lg text-gray-600">
            Discover why people love renting cars from us!
          </p>
        </div>

        <div>
          <div className="flex justify-center pb-12">
            <div className="relative inline-flex flex-wrap justify-center rounded-md bg-gray-200 p-1">
              <button
                className={`px-4 py-2 text-sm font-medium ${category === 1 ? "bg-blue-500 text-white" : "text-gray-700"}`}
                onClick={() => setCategory(1)}
              >
                All
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${category === 2 ? "bg-blue-500 text-white" : "text-gray-700"}`}
                onClick={() => setCategory(2)}
              >
                Budget Cars
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${category === 3 ? "bg-blue-500 text-white" : "text-gray-700"}`}
                onClick={() => setCategory(3)}
              >
                Luxury Cars
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${category === 4 ? "bg-blue-500 text-white" : "text-gray-700"}`}
                onClick={() => setCategory(4)}
              >
                Family Cars
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${category === 5 ? "bg-blue-500 text-white" : "text-gray-700"}`}
                onClick={() => setCategory(5)}
              >
                Business Trips
              </button>
            </div>
          </div>

          <div
            className="mx-auto grid max-w-sm items-start gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3"
            ref={masonryContainer}
          >
            {testimonials
              .filter((testimonial) => testimonial.categories.includes(category))
              .map((testimonial, index) => (
                <div key={index} className="group">
                  <Testimonial testimonial={testimonial} category={category}>
                    {testimonial.content}
                  </Testimonial>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonial({
  testimonial,
  category,
  children,
}: {
  testimonial: {
    img: StaticImageData;
    name: string;
    company: string;
    content: string;
    categories: number[];
  };
  category: number;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`relative rounded-lg bg-white p-5 shadow-lg ${
        !testimonial.categories.includes(category) ? "hidden" : ""
      }`}
    >
      <div className="flex flex-col gap-4">
        <p className="text-gray-700">{children}</p>
        <div className="flex items-center gap-3">
          <Image
            className="rounded-full"
            src={testimonial.img}
            width={36}
            height={36}
            alt={testimonial.name}
          />
          <div className="text-sm font-medium text-gray-900">
            <span>{testimonial.name}</span>
            <span className="text-gray-600"> - </span>
            <span>{testimonial.company}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
