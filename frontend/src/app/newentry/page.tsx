"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FreelancerFormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  expertise: string;
}

const AddFreelancerPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [load,setLoad]=useState(true)
  const [formData, setFormData] = useState<FreelancerFormData>({
    name: "",
    email: "",
    phone: "",
    age: "",
    expertise: "",
  });
  useEffect(()=>{
        const checkReg = async (): Promise<void> => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/check_reg`, {
              credentials: "include"
            });
            const rd = await res.json();
            
            if (rd.success && rd.user?.role === "freelancer") {
              setLoad(false);
            } else {
              toast.error("Only freelancer accounts can manage freelancer profiles");
              router.push('/user');
            }
          } catch (error) {
            console.error('Registration check failed:', error);
            router.push('/login');
          }
        };
        checkReg();
  },[router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/newFL`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.code ? "Freelancer profile updated successfully!" : "Freelancer profile created successfully!");
        router.push("/freelancer");
      }
      else {
        toast.error(data.message || "Failed to add freelancer");
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
if(load)return <></>
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-gray-900 py-12">
      <div className="relative w-full max-w-xl">
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500 rounded-full opacity-10 animate-pulse delay-150"></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Add Freelancer
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Enter the freelancer profile details below
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-400"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-400"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-400"
                  placeholder="+91 69787 23234"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="18"
                  max="100"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-400"
                  placeholder="25"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expertise (separate with commas)
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-400"
                  placeholder="TV Repair,AC Repair,Electrician"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add multiple skills separated by commas (e.g., &quot;Gas repair, AC repair, TV repair&quot;)
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 text-white font-medium bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding Freelancer..." : "Add Freelancer"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFreelancerPage;
