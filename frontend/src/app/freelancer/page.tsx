"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FreelancerProfile {
  name: string;
  email: string;
  phone: string;
  expertise: string[];
  age: number;
}

interface Booking {
  _id: string;
  customerUsername: string;
  freelancerName: string;
  serviceType: string;
  status: "pending" | "accepted" | "completed";
  createdAt: string;
  rating?: number | null;
}

interface SessionUser {
  username: string;
  role: "user" | "freelancer";
}

export default function FreelancerDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadBookings = async () => {
    const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/freelancer/bookings`, {
      credentials: "include",
    });
    const bookingsData = await bookingsResponse.json();

    if (bookingsData.success) {
      setBookings(bookingsData.bookings ?? []);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/check_reg`, {
          credentials: "include",
        });
        const sessionData = await sessionResponse.json();

        if (!sessionData.success) {
          router.push("/login");
          return;
        }

        if (sessionData.user?.role !== "freelancer") {
          router.push("/user");
          return;
        }

        setUser(sessionData.user);

        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/freelancer/me`, {
          credentials: "include",
        });
        const profileData = await profileResponse.json();

        if (profileData.success) {
          setProfile(profileData.profile ?? null);
        }

        await loadBookings();
      } catch (error) {
        console.error("Failed to load freelancer dashboard", error);
        router.push("/login");
        return;
      }

      setIsLoading(false);
    };

    loadDashboard();
  }, [router]);

  const handleAccept = async (bookingId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BHOST}/freelancer/bookings/${bookingId}/accept`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (!data.success) {
        return;
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: "accepted" } : booking
        )
      );
    } catch (error) {
      console.error("Failed to accept booking", error);
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-5xl px-4 pt-24 space-y-6 sm:px-6 sm:pt-20">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">Freelancer account</p>
          <h1 className="text-3xl font-bold text-slate-50">
            Welcome, {user?.username}
          </h1>
          <p className="text-slate-400 mt-2">
            This dashboard is your freelancer space. Search is reserved for normal users.
          </p>
        </div>

        {!profile && (
          <Card className="border-slate-800 bg-slate-900/90 shadow-xl shadow-black/20">
            <CardHeader>
              <CardTitle>Complete your freelancer profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400">
                Your account is ready, but your public freelancer details have not been added yet.
              </p>
              <Button onClick={() => router.push("/newentry")}>
                Add Freelancer Details
              </Button>
            </CardContent>
          </Card>
        )}

        {profile && (
          <Card className="border-slate-800 bg-slate-900/90 shadow-xl shadow-black/20">
            <CardHeader>
              <CardTitle>Your Freelancer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="font-medium text-slate-100">{profile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Age</p>
                  <p className="font-medium text-slate-100">{profile.age}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium text-slate-100">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium text-slate-100">{profile.phone}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {profile.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={() => router.push("/newentry")}>
                Edit Freelancer Details
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-800 bg-slate-900/90 shadow-xl shadow-black/20">
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-5 py-8 text-center text-slate-400">
                No one has booked you yet.
              </p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className={`rounded-2xl border p-5 shadow-sm transition-colors ${
                      booking.status === "accepted"
                        ? "border-emerald-900/80 bg-emerald-950/60"
                        : "border-amber-900/80 bg-amber-950/50"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-100">
                          {booking.customerUsername} booked {booking.freelancerName}
                        </p>
                        <p className="text-sm text-slate-300 mt-2">
                          Service: {booking.serviceType}
                        </p>
                        <p className="mt-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                              booking.status === "accepted"
                                ? "bg-emerald-600 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </p>
                        <p className="text-sm text-slate-400 mt-2">
                          Booked on {new Date(booking.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                      {booking.status === "pending" ? (
                        <Button
                          className="w-full shrink-0 bg-slate-900 hover:bg-slate-800 sm:w-auto"
                          onClick={() => handleAccept(booking._id)}
                        >
                          Accept
                        </Button>
                      ) : null}
                    </div>
                    {booking.status === "completed" && booking.rating ? (
                      <p className="mt-3 text-sm text-slate-300">
                        Rating: {"★".repeat(booking.rating)}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
