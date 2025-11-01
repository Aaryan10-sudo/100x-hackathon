"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const DestinationDetailPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    try {
      const stored = sessionStorage.getItem("aiDestinations");
      if (!stored) return setLoading(false);
      const data = JSON.parse(stored);
      const found = data.find(
        (d) =>
          encodeURIComponent(d.name.toLowerCase().replace(/\s+/g, "-")) === slug
      );
      setDestination(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <p className="text-2xl animate-pulse">Loading destination...</p>
      </div>
    );

  if (!destination)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <p className="text-2xl font-semibold mb-4">Destination Not Found</p>
        <button
          onClick={() => router.push("/explore")}
          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition"
        >
          Back to Explore
        </button>
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden"
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.3 }}
      >
        {destination.image_url && (
          <Image
            src={destination.image_url}
            alt={destination.name}
            fill
            className="object-cover brightness-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-gray-900/95 backdrop-blur-sm" />
      </motion.div>

      {/* Header */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-5 bg-black/40 backdrop-blur-md z-30 border-b border-white/10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-100 hover:text-cyan-300 transition"
        >
          <ChevronLeft className="w-6 h-6" /> Back
        </button>
      </div>

      {/* Main Section */}
      <div className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-5xl mx-auto space-y-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent mb-4">
            {destination.name}
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed max-w-3xl mx-auto">
            {destination.description}
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            {
              title: "Best Time to Visit",
              value: destination.best_time_to_visit || "All year round",
            },
            {
              title: "Nearest City",
              value: destination.nearest_city || "Unknown",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg backdrop-blur-lg hover:bg-white/15 transition"
            >
              <h3 className="text-cyan-300 font-semibold text-lg mb-1">
                {item.title}
              </h3>
              <p className="text-gray-100 text-base">{item.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Highlights */}
        {destination.highlights?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-xl"
          >
            <h3 className="text-3xl font-semibold mb-6 text-green-300 text-center">
              Highlights 🌄
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-200">
              {destination.highlights.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-white/5 p-4 rounded-lg"
                >
                  <span className="text-green-400">✔</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Itinerary */}
        {destination.itinerary && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-xl"
          >
            <h3 className="text-3xl font-semibold mb-6 text-orange-300 text-center">
              Itinerary 🗓️
            </h3>
            <div className="space-y-4">
              {Object.entries(destination.itinerary).map(([day, desc]) => (
                <div key={day} className="bg-white/5 p-5 rounded-xl">
                  <p className="font-semibold text-orange-400 capitalize mb-2">
                    {day.replace("_", " ")}
                  </p>
                  <p className="text-gray-100">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Embedded Map */}
      </div>

      <div>
        {destination.map_url && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className=""
          >
            <h3 className="text-3xl font-semibold mb-6 text-black text-center">
              Location Map 🗺️
            </h3>
            <div className="overflow-hidden shadow-xl h-[400px] md:h-[500px]">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  destination.name
                )}&output=embed`}
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                className="border-0"
              ></iframe>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetailPage;
