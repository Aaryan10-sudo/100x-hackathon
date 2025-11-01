// components/explore/TopDestinationRevamp.jsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import LeftArrowIcon from "../ui/icons/LeftArrowIcon";
import RightArrowIcon from "../ui/icons/RightArrowIcon";

const topDestinations = [
  {
    name: "Pokhara",
    image: "/pokhara.jpg",
    description:
      "Known for its tranquil lakes and breathtaking views of the Annapurna range.",
  },
  {
    name: "Kathmandu",
    image: "/kathmandu.jpg",
    description:
      "The capital city filled with ancient temples, rich culture, and bustling markets.",
  },
  {
    name: "Lumbini",
    image: "/lumbini.jpg",
    description: "Birthplace of Lord Buddha and a UNESCO World Heritage Site.",
  },
  {
    name: "Annapurna Base Camp",
    image: "/annapurna-base-camp.jpg",
    description:
      "A trekker’s paradise offering jaw-dropping mountain vistas and Himalayan adventure.",
  },
  {
    name: "Chitwan National Park",
    image: "/chitwan-national-park.jpg",
    description:
      "Home to rhinos, tigers, and lush jungles — a perfect escape into the wild.",
  },
  {
    name: "Mustang",
    image: "/mustang.jpg",
    description:
      "A mystical region resembling Tibet, known for desert mountains and ancient monasteries.",
  },
  {
    name: "Everest Base Camp",
    image: "/everest-base-camp.jpg",
    description:
      "The legendary gateway to the world’s highest peak, Mount Everest.",
  },
];

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 flex flex-col animate-pulse h-[400px]">
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-6" />
    <div className="h-7 bg-gray-200 rounded w-3/4 mb-3" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
    <div className="h-4 bg-gray-200 rounded mb-6" />
    <div className="h-10 bg-gray-200 rounded w-1/3 mt-auto" />
  </div>
);

export default function TopDestinationRevamp() {
  const [interest, setInterest] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const presets = [
    "Mountain trekking",
    "Photography",
    "Culture & Heritage",
    "Peace & Wellness",
    "Offbeat Villages",
  ];

  const handlePresetClick = (p) => {
    setInterest(p);
    handleAIClick(p);
  };

  const handleAIClick = async (override) => {
    const q = override ?? interest;
    if (!q) {
      setError("Please enter an interest or select a preset.");
      return;
    }
    setLoading(true);
    setError(null);
    setAiSuggestions([]);
    try {
      const res = await axios.post("/api/generate", { interest: q });
      const data = res?.data;

      if (data?.destinations && Array.isArray(data.destinations)) {
        setAiSuggestions(data.destinations);
        // Store the suggestions in sessionStorage
        sessionStorage.setItem(
          "aiDestinations",
          JSON.stringify(data.destinations)
        );
      } else {
        console.warn("Unexpected AI response structure:", data);
        setError("Received unexpected data from AI. Please try again.");
        setAiSuggestions([]);
      }
    } catch (err) {
      console.error("AI Suggestion Error:", err);
      setError("Failed to fetch suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderSuggestion = (s, idx) => {
    if (!s || typeof s !== "object") {
      return (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.03 }}
          className="bg-red-50 p-4 rounded-lg shadow-sm text-red-700 border border-red-200"
        >
          Invalid suggestion data: {JSON.stringify(s)}
        </motion.div>
      );
    }

    const slug = s.name
      ? encodeURIComponent(s.name.toLowerCase().replace(/\s+/g, "-"))
      : `destination-${idx}`;
    const detailPageUrl = `/explore/${slug}`;

    return (
      <Link href={detailPageUrl} passHref>
        <motion.a
          key={s.name || idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full cursor-pointer group"
        >
          <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {s.image_url ? (
              <Image
                src={s.image_url}
                alt={s.name || "Destination"}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="transform transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="text-gray-400 text-6xl">📍</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{s.name}</h3>
            {(s.region || s.nearest_city) && (
              <p className="text-sm text-gray-500 mb-3">
                {s.region}{" "}
                {s.nearest_city ? `• Nearest: ${s.nearest_city}` : ""}
              </p>
            )}

            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
              {s.description}
            </p>

            <button className="mt-auto inline-flex items-center justify-center px-5 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-green-500 text-white font-medium hover:brightness-110 transition-all duration-200 shadow-md self-start">
              View Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </motion.a>
      </Link>
    );
  };

  return (
    <section className="pt-10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[40px] font-extrabold">Top Destinations</h2>
          <div className="hidden sm:flex gap-2 items-center">
            <div
              ref={prevRef}
              role="button"
              tabIndex={0}
              aria-label="Previous destination"
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center cursor-pointer  hover:border-blue-300 transition-colors duration-200"
            >
              <LeftArrowIcon />
            </div>
            <div
              ref={nextRef}
              role="button"
              tabIndex={0}
              aria-label="Next destination"
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center cursor-pointer  hover:border-blue-300 transition-colors duration-200"
            >
              <RightArrowIcon />
            </div>
          </div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              if (swiper.params.navigation) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            autoplay={{ delay: 4500, disableOnInteraction: true }}
            className="w-full pb-8"
          >
            {topDestinations.map((dest) => (
              <SwiperSlide key={dest.name}>
                <motion.article
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-gradient-to-br from-white/80 to-white/70 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transform transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute left-4 bottom-4 text-white">
                      <h3 className="text-2xl font-bold drop-shadow">
                        {dest.name}
                      </h3>
                      <p className="text-sm drop-shadow">{dest.description}</p>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-gray-600 mb-4">{dest.description}</p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium hover:scale-105 transition">
                        Explore
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                        Local guides
                      </button>
                    </div>
                  </div>
                </motion.article>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="pointer-events-none hidden lg:block absolute -right-10 top-10 w-60 h-60 rounded-full bg-gradient-to-br from-pink-300/30 to-indigo-300/20 blur-3xl" />
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto text-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-3"
          >
            Find Your Ideal Destination
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 mb-6"
          >
            Tell our AI what kind of travel experience you’re looking for —
            adventure, relaxation, spirituality, or nature.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto bg-white p-2 pr-1 rounded-full shadow-lg border border-gray-100 focus-within:ring-2 focus-within:ring-emerald-300 transition-all duration-200">
              <input
                type="text"
                placeholder="e.g. mountain trekking, peace, or photography"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="border-0 outline-none px-4 py-2 w-full bg-transparent text-gray-800 placeholder-gray-400"
                aria-label="Travel interest"
              />
              <button
                onClick={() => handleAIClick()}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2 rounded-full font-semibold hover:brightness-105 disabled:opacity-60 transition-all duration-200 shadow-md whitespace-nowrap" // Adjusted padding, added whitespace-nowrap
                aria-label="Ask AI for suggestions"
              >
                {loading ? "Analyzing..." : "Ask AI"}{" "}
                {/* Changed text from "Ask-AI" to "Ask AI" */}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 bg-red-50 p-4 rounded-lg mt-4 text-center border border-red-200">
              {error}
            </p>
          )}

          <div className="mt-8 w-full container mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : aiSuggestions.length === 0 ? (
              <div className="text-gray-500 text-center py-10 border border-dashed border-gray-200 rounded-xl bg-white">
                <p className="text-lg font-medium mb-2">No suggestions yet!</p>
                <p>Try a preset or type your interest above to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiSuggestions.map((s, i) => renderSuggestion(s, i))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
