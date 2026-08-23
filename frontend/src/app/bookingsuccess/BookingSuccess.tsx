import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"; // Assuming Card components exist in ui/card
import { Button } from "@/components/ui/button"; // Assuming Button exists in ui/button
import { useRouter } from "next/navigation";

// Define the type for booking details
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

interface BookingSuccessProps {
  bookingDetails: BookingDetails;
}

// Component to display the booking success details
const BookingSuccess: React.FC<BookingSuccessProps> = ({ bookingDetails }) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 shadow-xl shadow-black/20">
        <CardHeader>
          <CardTitle className="text-slate-50">Booking Successful!</CardTitle>
          <CardDescription className="text-slate-400">
            Thank you for choosing our service. Here are your booking details:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-slate-300">
            <strong>Booked By:</strong> {bookingDetails.customerUsername}
          </p>
          <p className="text-slate-300">
            <strong>Technician:</strong> {bookingDetails.technicianName}
          </p>
          <p className="text-slate-300">
            <strong>Service:</strong> {bookingDetails.serviceType}
          </p>
          <p className="text-slate-300 break-all sm:break-normal">
            <strong>Email:</strong> {bookingDetails.email}
          </p>
          <p className="text-slate-300">
            <strong>Phone:</strong> {bookingDetails.phone}
          </p>
          <p className="text-slate-300">
            <strong>Age:</strong> {bookingDetails.age}
          </p>
          <p className="text-slate-300">
            <strong>Expertise:</strong> {bookingDetails.expertise}
          </p>
          <p className="text-slate-300">
            <strong>Date:</strong> {bookingDetails.date}
          </p>
          <p className="text-slate-300">
            <strong>Time:</strong> {bookingDetails.time}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button variant="default" onClick={() => router.push("/user")} className="w-full sm:w-auto">
            Go to Dashboard
          </Button>
          <Button variant="secondary" onClick={() => router.push("/user")} className="w-full sm:w-auto">
            Book Another Service
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingSuccess;
