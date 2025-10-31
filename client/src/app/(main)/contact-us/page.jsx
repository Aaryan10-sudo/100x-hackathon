"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Calendar, User, Send } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const DUMMY_DESTINATIONS = [
  "Manaslu Circuit Trek",
  "Everest Base Camp",
  "Annapurna Circuit",
  "Langtang Valley",
  "Custom Trek/Tour",
];

const DUMMY_TOURIST_COUNT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const DUMMY_DAYS_OPTIONS = [
  { label: "Less than 7 days", value: "3-7" },
  { label: "7 - 14 days", value: "7-14" },
  { label: "15 - 21 days", value: "15-21" },
  { label: "More than 21 days", value: "21+" },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "Manaslu Circuit Trek", // Default to Manaslu for dynamic feel
    persons: 1,
    days: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Contact Form Submitted:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        destination: "Manaslu Circuit Trek",
        persons: 1,
        days: "",
        message: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#121212]">
      {/* Background Image with Dynamic Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/heroimages/manaslutrek.webp"
          alt="Manaslu Trekking Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Section with Framer Motion */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 text-white"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-3 tracking-tight">
              Start Your Himalayan Journey
            </h1>
            <p className="text-xl text-gray-300 max-w-xl mx-auto">
              Tell us your requirements and let our experts craft the perfect, unforgettable trip.
            </p>
          </motion.div>
          
          {/* Form Container with Framer Motion */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-900/90 backdrop-blur-md p-8 lg:p-12 rounded-2xl shadow-2xl border border-zinc-700"
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Full Name</label>
                  <div className="relative">
                    <User className="size-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 text-white bg-black/30 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-[#EA3359]"
                      placeholder="Your Full Name"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="size-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 text-white bg-black/30 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-[#EA3359]"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Contact Number</label>
                  <div className="relative">
                    <Phone className="size-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 text-white bg-black/30 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-[#EA3359]"
                      placeholder="Phone Number (e.g., +123 456 7890)"
                      required
                    />
                  </div>
                </div>

                {/* Trip Destination */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Trip Destination</label>
                  <div className="relative">
                    <MapPin className="size-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <select
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 text-white bg-black/30 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-[#EA3359] appearance-none"
                      required
                    >
                      <option value="" disabled className="bg-zinc-900 text-gray-400">Select Destination</option>
                      {DUMMY_DESTINATIONS.map((dest) => (
                        <option key={dest} value={dest} className="bg-zinc-900">
                          {dest}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Number of Tourist (Dropdown) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Number of Tourists</label>
                  <div className="relative">
                    <User className="size-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <select
                      name="persons"
                      value={formData.persons}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 text-white bg-black/30 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-[#EA3359] appearance-none"
                      required
                    >
                      {DUMMY_TOURIST_COUNT.map((count) => (
                        <option key={count} value={count} className="bg-zinc-900">
                          {count} {count > 1 ? 'persons' : 'person'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Trip Duration (Days Dropdown) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Trip Duration (Days)</label>
                  <div className="relative">
                    <Calendar className="size-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <select
                      name="days"
                      value={formData.days}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 text-white bg-black/30 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-[#EA3359] appearance-none"
                      required
                    >
                      <option value="" disabled className="bg-zinc-900 text-gray-400">Select Duration</option>
                      {DUMMY_DAYS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-zinc-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-300">Your Message/Requirements</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 text-white bg-black/30 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-[#EA3359] resize-none"
                    placeholder="Let us know about your special requests, ideal travel dates, or questions..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="mt-4 md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-[#EA3359] to-[#d62a33] text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.005]"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="size-5" />
                        Send Enquiry
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;