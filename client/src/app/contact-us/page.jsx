"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Calendar, User, Send, X } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const DUMMY_DESTINATIONS = [
  "Everest Base Camp",
  "Annapurna Circuit",
  "Langtang Valley",
  "Kathmandu Cultural Tour",
  "Chitwan Safari",
];

const DUMMY_DAYS_OPTIONS = [
  { label: "Less than 7 days", value: "3-7" },
  { label: "7 - 14 days", value: "7-14" },
  { label: "15 - 21 days", value: "15-21" },
  { label: "More than 21 days", value: "21+" },
];

function ContactFormModal({ isFormOpen, setIsFormOpen }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    persons: 1,
    days: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Contact Form Submitted:", formData);
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success("Message sent successfully! We will contact you soon.");
      setIsFormOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        destination: "",
        persons: 1,
        days: "",
        message: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] ${isFormOpen ? "block" : "hidden"}`}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setIsFormOpen(false)}
      ></div>

      <div className="relative h-full w-full flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="modalBg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10"
        >
          <div className="sticky modalBg top-0 border-b border-white/10 p-6 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-200">
                  Plan Your Dream Trip
                </h2>
                <p className="text-gray-300 mt-1">
                  Tell us about your adventure needs.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-300" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-lg font-medium text-gray-200">
                  Full Name
                </label>
                <div className="relative">
                  <User className="size-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all"
                    placeholder="Your Full Name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-lg font-medium text-gray-200">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="size-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-lg font-medium text-gray-200">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="size-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all"
                    placeholder="Phone (e.g., +123 456 7890)"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-lg font-medium text-gray-200">
                  Trip Destination
                </label>
                <div className="relative">
                  <MapPin className="size-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent appearance-none"
                    required
                  >
                    <option value="" className="bg-black text-gray-400">
                      Select Destination
                    </option>
                    {DUMMY_DESTINATIONS.map(dest => (
                      <option key={dest} value={dest} className="bg-black">
                        {dest}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-lg font-medium text-gray-200">
                  Number of Persons
                </label>
                <div className="relative">
                  <User className="size-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="number"
                    name="persons"
                    min="1"
                    value={formData.persons}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-lg font-medium text-gray-200">
                  Trip Duration (Days)
                </label>
                <div className="relative">
                  <Calendar className="size-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    name="days"
                    value={formData.days}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent appearance-none"
                    required
                  >
                    <option value="" className="bg-black text-gray-400">
                      Select Duration
                    </option>
                    {DUMMY_DAYS_OPTIONS.map(opt => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-black"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6 md:col-span-2">
              <label className="text-lg font-medium text-gray-200">
                Your Message/Requirements
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all resize-none"
                placeholder="Let us know about your special requests or ideal travel dates..."
              ></textarea>
            </div>

            <div className="mt-8 md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#EA3359] to-[#d62a33] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default ContactFormModal;
