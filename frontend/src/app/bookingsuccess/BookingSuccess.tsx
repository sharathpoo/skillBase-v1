import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"; // Assuming Card components exist in ui/card
import { Button } from "@/components/ui/button"; // Assuming Button exists in ui/button

// Define the type for booking details
type BookingDetails = {
  technicianName: string;
  serviceType: string;
  date: string;
  time: string;
};

interface BookingSuccessProps {
  bookingDetails: BookingDetails;
}

// Component to display the booking success details
const BookingSuccess: React.FC<BookingSuccessProps> = ({ bookingDetails }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Booking Successful!</CardTitle>
          <CardDescription>
            Thank you for choosing our service. Here are your booking details:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            <strong>Technician:</strong> {bookingDetails.technicianName}
          </p>
          <p className="text-gray-600">
            <strong>Service:</strong> {bookingDetails.serviceType}
          </p>
          <p className="text-gray-600">
            <strong>Date:</strong> {bookingDetails.date}
          </p>
          <p className="text-gray-600">
            <strong>Time:</strong> {bookingDetails.time}
          </p>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button variant="default" onClick={() => console.log("Navigate to Dashboard")}>
            Go to Dashboard
          </Button>
          <Button variant="secondary" onClick={() => console.log("Book Another Service")}>
            Book Another Service
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingSuccess;
