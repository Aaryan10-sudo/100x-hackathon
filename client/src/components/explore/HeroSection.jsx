import React from "react";

const BACKGROUND_IMAGE_URL = "/explore-hero.jpg";

const HeroSection = () => {
  return (
    <div className="relative h-[70vh]  w-full flex items-center justify-center text-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${BACKGROUND_IMAGE_URL}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 70%",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/50"></div>
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center mb-4">
          <h1 className="text-4xl font-beverage md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Explore Nepal
          </h1>
        </div>

        <p className="text-lg md:text-xl text-white mt-4 leading-relaxed font-medium px-4 drop-shadow-md">
          Experience the land of majestic mountains, ancient temples, and warm
          hospitality. Let AI guide you to your perfect destination.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
