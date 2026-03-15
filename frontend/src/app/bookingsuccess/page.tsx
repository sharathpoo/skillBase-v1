"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BookingSuccess from "./BookingSuccess";

type BookingDetails = {
  technicianName: string;
  customerUsername: string;
  serviceType: string;
  email: string;
  phone: string;
  age: string;
  expertise: string;
  date: string;
  time: string;
};

export default function Page() {
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    const savedBooking = sessionStorage.getItem("selectedBooking");
    const now = new Date();

    if (savedBooking) {
      const parsedBooking = JSON.parse(savedBooking) as Omit<BookingDetails, "date" | "time">;
      setBookingDetails({
        ...parsedBooking,
        date: now.toLocaleDateString("en-IN"),
        time: now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      return;
    }

    setBookingDetails({
      technicianName: searchParams.get("name") ?? "Unknown Freelancer",
      customerUsername: searchParams.get("customer") ?? "Unknown User",
      serviceType: searchParams.get("service") ?? "General Service",
      email: searchParams.get("email") ?? "Not provided",
      phone: searchParams.get("phone") ?? "Not provided",
      age: searchParams.get("age") ?? "Not provided",
      expertise: searchParams.get("expertise") ?? "Not provided",
      date: now.toLocaleDateString("en-IN"),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }, [searchParams]);

  if (!bookingDetails) return null;

  return <BookingSuccess bookingDetails={bookingDetails} />;
}
