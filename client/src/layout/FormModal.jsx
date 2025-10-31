"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Calendar,
  ChevronDown,
  Globe,
  Mail,
  Mountain,
  Phone,
  Send,
  User,
  X,
} from "lucide-react";
// Note: Removed local type imports as per request for plain JSX/JS
// import { apiClient } from "@/lib/api-client"; // API client removed as per request
import { useBookingStore } from "@/store/BookingStore";
import { toast } from "react-toastify";
import countries from "world-countries";
import { IoMdGlobe } from "react-icons/io";
import { motion } from "framer-motion";
import Addons from "../intineryBars/Addons";

// --- DUMMY DATA ---
const DUMMY_CATEGORIES = [
  {
    _id: "cat1",
    name: "Trekking",
    subCategories: [
      { _id: "sub1a", name: "Everest Region" },
      { _id: "sub1b", name: "Annapurna Region" },
    ],
  },
  {
    _id: "cat2",
    name: "Tours",
    subCategories: [
      { _id: "sub2a", name: "Cultural Tours" },
      { _id: "sub2b", name: "Jungle Safari" },
    ],
  },
];

const DUMMY_PACKAGES = [
  {
    id: "pkg1",
    name: "Everest Base Camp Trek (Dummy)",
    fixedDates: [{ pricePerPerson: 1500 }],
    price: 1500,
  },
  {
    id: "pkg2",
    name: "Annapurna Circuit Trek (Dummy)",
    fixedDates: [{ pricePerPerson: 1200 }],
    price: 1200,
  },
  {
    id: "pkg3",
    name: "Kathmandu Tour (Dummy)",
    fixedDates: [{ pricePerPerson: 500 }],
    price: 500,
  },
];

const DUMMY_ADDONS = [
  { _id: "add1", name: "Extra Porter", price: 200 },
  { _id: "add2", name: "Single Supplement", price: 300 },
];
// --- END DUMMY DATA ---

function FormModal({ isFormOpen, setIsFormOpen }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { bookingData, setBookingData } = useBookingStore();
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(false);

  // Format countries for the select dropdown
  const formattedCountries = countries.map(country => ({
    label: country.name.common,
    value: country.cca2,
    dialCode: country.idd.root + (country.idd.suffixes?.[0] || ""),
  }));

  // Set default country (Nepal)
  const defaultCountry = formattedCountries.find(c => c.label === "Nepal");
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFormOpen]);

  // --- MOCK FETCH FUNCTIONS ---
  const fetchCategories = useCallback(async () => {
    // MOCK API CALL
    setCategories(DUMMY_CATEGORIES);
  }, []);

  const fetchSubCategories = useCallback(async () => {
    // MOCK API CALL: Get subcategories from selected category
    if (!selectedCategory?._id) return;
    const category = DUMMY_CATEGORIES.find(c => c._id === selectedCategory._id);
    setSubCategories(category?.subCategories || []);
  }, [selectedCategory]);

  const fetchPackages = useCallback(async () => {
    // MOCK API CALL: Filter packages based on subcategory
    if (!selectedSubCategory?._id) return;
    const pkg = DUMMY_PACKAGES.filter(p =>
      p.name.includes(selectedCategory?.name)
    );
    setPackages(pkg);
  }, [selectedSubCategory, selectedCategory]);

  const fetchAddons = useCallback(async () => {
    // MOCK API CALL: Get addons for selected package
    if (!selectedPackage?.id) return;
    setAddons(DUMMY_ADDONS);
  }, [selectedPackage]);
  // --- END MOCK FETCH FUNCTIONS ---

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories();
    }
  }, [selectedCategory, fetchSubCategories]);

  useEffect(() => {
    if (selectedSubCategory) {
      fetchPackages();
    }
  }, [selectedSubCategory, fetchPackages]);

  useEffect(() => {
    if (selectedPackage) {
      fetchAddons();
    }
  }, [selectedPackage, fetchAddons]);

  const handleCategoryChange = e => {
    const category = categories.find(cat => cat._id === e.target.value);
    setSelectedCategory(category || null);
    setSelectedSubCategory(null);
    setSelectedPackage(null);
  };

  const handleSubCategoryChange = e => {
    const subCategory = subCategories.find(sub => sub._id === e.target.value);
    setSelectedSubCategory(subCategory || null);
    setSelectedPackage(null);
  };

  const handlePackageChange = e => {
    const pkg = packages.find(p => p.id === e.target.value);
    setSelectedPackage(pkg || null);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;

    // Handle date inputs
    if (name === "arrivalDate") {
      const arrivalDate = value ? new Date(value) : null;
      let departureDate = null;

      if (arrivalDate) {
        // Calculate departure date (15 days after arrival - this logic is carried over from original TSX)
        departureDate = new Date(arrivalDate);
        departureDate.setDate(departureDate.getDate() + 15);
      }

      setBookingData({
        selectedDate: arrivalDate,
        endDate: departureDate,
      });
    } else if (name === "departureDate") {
      setBookingData({
        endDate: value ? new Date(value) : null,
      });
    } else {
      setBookingData({ [name]: value });
    }
  };

  const calculateTotal = () => {
    // Using mock fixedDates structure
    const basePrice = selectedPackage?.fixedDates?.[0]?.pricePerPerson || 0;
    const adults = Number(bookingData.adults || 1);
    const children = Number(bookingData.children || 0);
    const addonsTotal = (bookingData.addons || []).reduce(
      (sum, addon) => sum + (addon.price || 0),
      0
    );

    // Assuming children price is 70% of basePrice
    return basePrice * adults + basePrice * 0.7 * children + addonsTotal;
  };

  const totalPrice = calculateTotal();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedCategory || !selectedSubCategory || !selectedPackage) {
      toast.error("Please select all required fields");
      return;
    }

    try {
      setLoading(true);

      // --- MOCK SUBMISSION (SIMULATE API CALL) ---
      console.log("MOCK API SUBMISSION:", {
        packageId: selectedPackage.id,
        totalAmount: totalPrice,
        name: bookingData.name,
        email: bookingData.email,
        addons: (bookingData.addons || []).map(addon => addon._id),
      });

      // Simulate a successful API response with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate a redirect (replace with actual logic if needed)
      // window.location.href = "MOCK_STRIPE_URL";

      toast.success("MOCK Booking submitted successfully!");
      setIsFormOpen(false);

      // Reset the form (partially reset store state)
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedPackage(null);
      setBookingData({
        name: "",
        email: "",
        phone: "",
        country: "",
        selectedDate: null,
        endDate: null,
        message: "",
        packageId: undefined,
        price: 0,
        adults: 1,
        children: 0,
        code: "",
      });
    } catch (error) {
      console.error("MOCK: Error creating booking:", error);
      toast.error("MOCK: Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = e => {
    const country =
      formattedCountries.find(c => c.value === e.target.value) ||
      defaultCountry;
    if (country) {
      setSelectedCountry(country);
      setBookingData({
        ...bookingData,
        country: country.label,
        code: country.dialCode,
      });
    }
  };

  const handleAddonChange = (addon, isChecked) => {
    setBookingData({
      ...bookingData,
      addons: isChecked
        ? [...(bookingData.addons || []), addon]
        : (bookingData.addons || []).filter(a => a._id !== addon._id),
    });
  };

  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  return (
    <div
      className={`fixed inset-0 z-[9999] ${isFormOpen ? "block" : "hidden"}`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsFormOpen(false)}
      ></div>

      {/* Modal Container */}
      <div className="relative h-full w-full flex items-end justify-end  overflow-y-auto">
        {/* Modal Content */}
        <motion.div
          initial={{
            y: "100%",
          }}
          whileInView={{
            y: 0,
          }}
          exit={{
            y: "-100%",
          }}
          transition={{ duration: 0.01, ease: "linear" }}
          className="modalBg rounded-2xl shadow-2xl w-full  max-h-[90vh] overflow-y-auto relative z-10"
        >
          {/* Header */}
          <div className="sticky modalBg top-0 border-b border-white/10 p-6 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl lg:text-4xl font-bold text-gray-200">
                  Customize Your Trip
                </h2>
                <p className="text-gray-300 mt-1 lg:text-xl">
                  Let's plan your perfect adventure
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

          {/* Form Body */}
          <form
            onSubmit={handleSubmit}
            className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10"
          >
            {/* Personal Details - Left Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-200">
                  Personal Details
                </h3>
                <div className="h-px bg-[#EA3359] flex-1 ml-4"></div>
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-4">
                  <label className="text-lg font-medium text-gray-200">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={bookingData.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-5 mt-2 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-4">
                  <label className="text-lg font-medium text-gray-200">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="size-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email || ""}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-5 mt-2 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-4">
                  <label className="text-lg font-medium text-gray-200">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="size-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 mt-2 py-5 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all"
                      placeholder="+1234567890"
                      required
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-4">
                  <label className="text-lg font-medium text-gray-200">
                    Country
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <IoMdGlobe className="text-gray-500" />
                    </div>
                    <select
                      name="country"
                      value={selectedCountry?.value || ""}
                      onChange={handleCountryChange}
                      className="w-full pl-10 pr-4 mt-2 py-5 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent appearance-none"
                      required
                    >
                      {formattedCountries.map(country => (
                        <option
                          key={country.value}
                          value={country.value}
                          className="bg-black text-white"
                        >
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Details - Middle Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-200">
                  Trip Details
                </h3>
                <div className="h-px bg-[#EA3359] flex-1 ml-4"></div>
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div className="space-y-4">
                  <label className="text-lg font-medium text-gray-200">
                    Category
                  </label>
                  <select
                    name="category"
                    value={selectedCategory?._id || ""}
                    onChange={handleCategoryChange}
                    className="w-full mt-2 px-4 py-5 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent appearance-none"
                    required
                  >
                    <option value="" className="bg-black">
                      Select a Category
                    </option>
                    {categories.map(item => (
                      <option
                        key={item._id}
                        value={item._id}
                        className="bg-black"
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-Category */}
                <div className="space-y-4">
                  <label className="text-lg font-medium text-gray-200">
                    Sub-Category
                  </label>
                  <select
                    name="subCategory"
                    value={selectedSubCategory?._id || ""}
                    onChange={handleSubCategoryChange}
                    disabled={!selectedCategory}
                    className="w-full px-4 mt-2 py-5 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent appearance-none"
                    required
                  >
                    <option value="" className="bg-black">
                      Select a Sub-Category
                    </option>
                    {subCategories.map(sub => (
                      <option
                        key={sub._id}
                        value={sub._id}
                        className="bg-black"
                      >
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Package */}
                <div className="space-y-4">
                  <label className="text-lg font-medium text-gray-200">
                    Package
                  </label>
                  <select
                    name="package"
                    value={selectedPackage?.id || ""}
                    onChange={handlePackageChange}
                    disabled={!selectedSubCategory}
                    className="w-full px-4 mt-2 py-5 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent appearance-none"
                    required
                  >
                    <option value="" className="bg-black">
                      Select a Package
                    </option>
                    {packages.map(exp => (
                      <option key={exp.id} value={exp.id} className="bg-black">
                        {exp.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Addons */}
                {addons?.length > 0 && (
                  <div className="space-y-4">
                    <Addons
                      variant="light"
                      handleAddonChange={handleAddonChange}
                      addons={addons}
                    />
                  </div>
                )}

                {/* Arrival Date */}
                <div className="space-y-4">
                  <label className="text-lg font-medium text-gray-200">
                    Arrival Date
                  </label>
                  <div className="relative">
                    <Calendar className="size-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="date"
                      min={todayFormatted}
                      name="arrivalDate"
                      value={
                        bookingData.selectedDate
                          ? new Date(bookingData.selectedDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="w-full mt-2 pl-10 pr-4 py-5 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Departure Date */}
                <div className="space-y-4">
                  <label className="text-lg font-medium text-gray-200">
                    Departure Date
                  </label>
                  <div className="relative">
                    <Calendar className="size-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="date"
                      name="departureDate"
                      value={
                        bookingData.endDate
                          ? new Date(bookingData.endDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 mt-2 py-5 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary - Right Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-200">
                  Trip Summary
                </h3>
                <div className="h-px bg-[#EA3359] flex-1 ml-4"></div>
              </div>

              <div className="space-y-6">
                {/* Number of Adults & Children */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-lg font-medium text-gray-200">
                      Adults
                    </label>
                    <input
                      type="number"
                      name="adults"
                      min="1"
                      value={bookingData.adults || 1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-5 mt-2 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-lg font-medium text-gray-200">
                      Children
                    </label>
                    <input
                      type="number"
                      name="children"
                      min="0"
                      value={bookingData.children || 0}
                      onChange={handleInputChange}
                      className="w-full px-4 mt-2 py-5 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                  <label className="text-lg font-medium text-gray-200">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={bookingData.message || ""}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-5 mt-2 text-gray-100 bg-white/5 border border-gray-300/30 rounded-lg focus:ring-2 focus:ring-[#EA3359] focus:border-transparent transition-all resize-none"
                    placeholder="Special requirements or notes..."
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-white/5 p-6 rounded-lg border border-gray-300/30">
                  <h4 className="font-semibold text-xl mb-4 text-gray-200">
                    Price Breakdown
                  </h4>
                  <div className="space-y-4">
                    {selectedPackage && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">
                          Base Price (x{bookingData.adults || 1} adults)
                        </span>
                        <span className=" text-gray-100 text-lg font-semibold">
                          $
                          {
                            //todo remove selectedPackage.fixedDates[0]?.pricePerPerson ||
                            (
                              (selectedPackage?.fixedDates?.[0]
                                ?.pricePerPerson || 0) *
                              (bookingData.adults || 1)
                            ).toFixed(2)
                          }
                        </span>
                      </div>
                    )}
                    {bookingData.children > 0 && selectedPackage && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">
                          Children (x{bookingData.children || 0})
                        </span>
                        <span className="text-lg text-gray-200 font-semibold">
                          $
                          {(
                            (selectedPackage?.fixedDates?.[0]?.pricePerPerson ||
                              0) *
                            0.7 *
                            (bookingData.children || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {bookingData.addons?.length > 0 && (
                      <div className="border-t border-gray-300/30 pt-3">
                        <p className="font-medium text-gray-200 mb-2">
                          Add-ons:
                        </p>
                        {bookingData.addons?.map(addon => (
                          <div
                            key={addon._id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-300">{addon.name}</span>
                            <span className="font-medium">
                              ${addon.price?.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="border-t border-gray-300/30 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-200">Total Amount:</span>
                        <span className="text-[#EA3359]">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col space-y-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-gradient-to-r from-[#EA3359] to-[#d62a33] text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
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
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="size-5" />
                        Submit Booking Request
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="w-full py-5 border border-gray-300/30 text-gray-200 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default FormModal;
