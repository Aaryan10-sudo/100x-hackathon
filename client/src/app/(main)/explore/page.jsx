// app/explore/page.jsx
"use client";

import React from "react";
import Image from "next/image"; // Make sure to import Image for the Buddhist flag
import HeroSection from "@/components/explore/HeroSection";
import TopDestinationRevamp from "@/components/explore/TopDestination"; // Corrected import

const ExplorePage = () => {
  return (
    <section className="flex flex-col">
      <HeroSection />

      {/* Top Destinations - Added some top padding to separate from the flag */}
      <div className="pt-16">
        <TopDestinationRevamp /> {/* Using TopDestinationRevamp */}
      </div>
    </section>
  );
};

export default ExplorePage;
