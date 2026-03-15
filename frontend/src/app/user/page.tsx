"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface Freelancer {
  userId: string;
  name: string;
  email: string;
  phone: string;
  expertise: string[];
  age: number;
}

interface SessionUser {
  username: string;
  role: "user" | "freelancer";
}

interface UserBooking {
  _id: string;
  freelancerName: string;
  serviceType: string;
  status: "pending" | "accepted" | "completed";
  createdAt: string;
  rating?: number | null;
}

export default function UserDashboard() {
  const router = useRouter();
  const [load, setLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [myBookings, setMyBookings] = useState<UserBooking[]>([]);
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    const checkReg = async (): Promise<void> => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/check_reg`, {
          credentials: "include",
        });
        const rd = await res.json();

        if (rd.success) {
          if (rd.user?.role === "freelancer") {
            router.replace("/freelancer");
            return;
          }
          setSessionUser(rd.user);

          const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/user/bookings`, {
            credentials: "include",
          });
          const bookingsData = await bookingsResponse.json();
          if (bookingsData.success) {
            setMyBookings(bookingsData.bookings ?? []);
          }

          setLoad(false);
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Registration check failed:", error);
        router.replace("/login");
      }
    };

    checkReg();
  }, [router]);

  const handleBook = async (freelancer: Freelancer) => {
    const serviceType =
      searchQuery.trim() || freelancer.expertise[0] || "General Service";

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          freelancerUserId: freelancer.userId,
          freelancerName: freelancer.name,
          freelancerEmail: freelancer.email,
          freelancerPhone: freelancer.phone,
          serviceType,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Unable to create booking.");
        return;
      }

      setMyBookings((currentBookings) => [data.booking, ...currentBookings]);

    const bookingPayload = {
      technicianName: freelancer.name,
      customerUsername: sessionUser?.username ?? "Unknown User",
      serviceType,
      email: freelancer.email,
      phone: freelancer.phone,
      age: String(freelancer.age),
      expertise: freelancer.expertise.join(", "),
    };

    sessionStorage.setItem("selectedBooking", JSON.stringify(bookingPayload));

    const params = new URLSearchParams({
      name: freelancer.name,
      customer: bookingPayload.customerUsername,
      email: freelancer.email,
      phone: freelancer.phone,
      age: String(freelancer.age),
      expertise: freelancer.expertise.join(", "),
      service: serviceType,
    });

    router.push(`/bookingsuccess?${params.toString()}`);
    } catch (err) {
      console.error("Booking error:", err);
      setError("Unable to create booking. Please try again.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/findFL?skill=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (!data.success) {
        setFreelancers([]);
        return;
      }
      setFreelancers(data.data);
    } catch (err) {
      setError("Error fetching freelancers. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitRating = async (bookingId: string) => {
    if (!selectedRating) {
      setError("Please choose a star rating before marking the task done.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BHOST}/user/bookings/${bookingId}/complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ rating: selectedRating }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Unable to complete booking.");
        return;
      }

      setMyBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId ? data.booking : booking
        )
      );
      setRatingBookingId(null);
      setSelectedRating(0);
      setError("");
    } catch (err) {
      console.error("Completion error:", err);
      setError("Unable to complete booking. Please try again.");
    }
  };

  if (load) return null;

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="pt-24 mb-4 text-center text-sm text-slate-400 sm:pt-20">
          Signed in as{" "}
          <span className="font-semibold text-slate-100">{sessionUser?.username}</span>
          {" "}with{" "}
          <span className="font-semibold text-slate-100">{sessionUser?.role}</span> access
        </div>
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-50 sm:mb-8">Find Freelancers</h1>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Input
            type="text"
            placeholder="Enter skill (e.g., tv repair, mixer repair, ac repair)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full flex-1 border-slate-300 bg-white text-black placeholder:text-gray-400"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>

        {error && (
          <div className="text-red-500 mb-4 text-center">{error}</div>
        )}

        <div className="space-y-4">
          {freelancers.map((freelancer, index) => (
            <Card key={index} className="border-slate-800 bg-slate-900/90 shadow-xl shadow-black/20">
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-100">{freelancer.name}</h2>
                    <p className="text-slate-400">Age: {freelancer.age}</p>
                  </div>
                  <div className="text-left text-slate-300 sm:text-right">
                    <p className="text-sm">{freelancer.email}</p>
                    <p className="text-sm">{freelancer.phone}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {freelancer.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleBook(freelancer)}
                    className="w-full shrink-0 sm:w-auto"
                  >
                    Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {freelancers.length === 0 && !isLoading && !error && (
            <div className="text-center text-slate-400 py-8">
              No freelancers found. Try searching for a different skill.
            </div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-slate-50">My Bookings</h2>
          <div className="space-y-4">
            {myBookings.length === 0 ? (
              <Card className="border-slate-800 bg-slate-900/90 shadow-xl shadow-black/20">
                <CardContent className="pt-6 text-slate-400">
                  You have not booked any freelancer yet.
                </CardContent>
              </Card>
            ) : (
              myBookings.map((booking) => (
                <Card
                  key={booking._id}
                  className={`shadow-lg ${
                    booking.status === "completed"
                      ? "border-sky-900/80 bg-sky-950/50"
                      : booking.status === "accepted"
                      ? "border-emerald-900/80 bg-emerald-950/60"
                      : "border-amber-900/80 bg-amber-950/50"
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-100">
                          {booking.freelancerName}
                        </p>
                        <p className="text-sm text-slate-300 mt-2">
                          Service: {booking.serviceType}
                        </p>
                        <p className="text-sm text-slate-400 mt-2">
                          Booked on {new Date(booking.createdAt).toLocaleString("en-IN")}
                        </p>
                        {booking.status === "completed" && booking.rating ? (
                          <p className="mt-3 text-sm text-slate-300">
                            Rating: {"★".repeat(booking.rating)}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        <Badge
                          variant="outline"
                          className={
                            booking.status === "completed"
                              ? "w-fit border-sky-500 bg-sky-600 text-white hover:bg-sky-600"
                              : booking.status === "accepted"
                              ? "w-fit border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-600"
                              : "w-fit border-amber-400 bg-amber-500 text-white hover:bg-amber-500"
                          }
                        >
                          {booking.status}
                        </Badge>

                        {booking.status === "accepted" && ratingBookingId !== booking._id ? (
                          <Button
                            onClick={() => {
                              setRatingBookingId(booking._id);
                              setSelectedRating(0);
                              setError("");
                            }}
                            className="w-full sm:w-auto"
                          >
                            Done
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    {booking.status === "accepted" && ratingBookingId === booking._id ? (
                      <div className="mt-5 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                        <p className="text-sm font-medium text-slate-200">
                          Rate the freelancer
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setSelectedRating(star)}
                              className={`text-2xl transition-transform hover:scale-110 ${
                                star <= selectedRating ? "text-yellow-400" : "text-slate-600"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                          <Button onClick={() => submitRating(booking._id)} className="w-full sm:w-auto">
                            Submit Rating
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setRatingBookingId(null);
                              setSelectedRating(0);
                            }}
                            className="w-full sm:w-auto"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
