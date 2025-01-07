import React from "react";
import BookingSuccess from "./BookingSuccess";

// Mock booking details to pass to the component
const Page = () => {
  const bookingDetails = {
    technicianName: "John Doe",
    serviceType: "Air Conditioner Repair",
    date: "2024-01-15",
    time: "10:00 AM",
  };

  return <BookingSuccess bookingDetails={bookingDetails} />;
};

export default Page;
