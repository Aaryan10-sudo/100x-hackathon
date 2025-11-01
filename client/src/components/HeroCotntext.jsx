"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowBigDownDash } from "lucide-react";

const HeroContent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);

    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          src="/video/trekking.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover the Himalayas
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Experience the adventure of a lifetime
          </p>
          <button className="bg-[#FF4E58] hover:bg-[#ff2d3a] text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
            Explore Treks
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowBigDownDash className="text-white w-8 h-8" />
      </div>
    </div>
  );
};

export default HeroContent;
