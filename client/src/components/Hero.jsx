"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Fade from "embla-carousel-fade"; // Ensure this import is correct
import Autoplay from "embla-carousel-autoplay"; // Ensure this import is correct
import Link from "next/link";
import { motion } from "framer-motion";

const mockApi = {
  success: true,
  count: 2,
  data: [
    {
      _id: "ebc123",
      name: "Everest Base Camp Trek",
      overview:
        "The Everest Base Camp Trek is a legendary adventure offering breathtaking views of Himalayan giants including Mt. Everest, Lhotse, and Ama Dablam.",
      coverImage: "/scenery.jpg",
      slug: "everest-base-camp-trek",
    },
    {
      _id: "lang123",
      name: "Langtang Valley Trek",
      overview:
        "The Langtang Valley Trek offers spectacular Himalayan scenery just north of Kathmandu, combining mountain views with rich Tamang culture.",
      coverImage: "/hero.jpg",
      slug: "langtang-valley-trek",
    },
  ],
};

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      delay: 0.5,
    },
  },
};

const EmblaCarousel = ({ options = { loop: true } }) => {
  const plugins = [
    Fade(),
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  ];

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options, plugins);

  const slides = mockApi.data;

  useEffect(() => {
    if (!emblaMainApi) return;
    emblaMainApi.on("init", emblaMainApi.reInit);
  }, [emblaMainApi]);

  return (
    <div className="w-full h-[90vh] md:h-screen relative">
      <div className="overflow-hidden h-full" ref={emblaMainRef}>
        <div
          className="flex touch-pan-y touch-pinch-zoom -ml-[1rem] h-full"
          style={{ touchAction: "pan-y pinch-zoom" }}
        >
          {slides.map((data, index) => (
            <div
              className={`flex-[0_0_100%] min-w-0 pl-[1rem] h-full`}
              key={index}
            >
              <div className="h-full relative flex w-full font-semibold select-none">
                <div className="absolute inset-0 bg-black">
                  <Image
                    src={data.coverImage}
                    alt={data.name}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>

                <div className="absolute inset-0 bg-black/50 z-[70]"></div>

                <div className="z-[80] flex flex-col justify-end pb-16 w-full items-start text-white h-full px-4 sm:px-20">
                  <motion.div
                    className="max-w-2xl"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.3 } },
                    }}
                  >
                    <motion.h2
                      variants={textVariants}
                      className="text-4xl uppercase sm:text-5xl md:text-[4.5rem] lg:text-[5rem] mb-4 text-white"
                    >
                      {data.name}
                    </motion.h2>
                    <motion.p
                      variants={textVariants}
                      className="sm:text-xl mb-10 mt-6 text-zinc-300 font-light line-clamp-2 max-w-[600px]"
                      dangerouslySetInnerHTML={{ __html: data.overview }}
                    ></motion.p>
                    <motion.div variants={buttonVariants}>
                      <Link href={`/package-details/${data.slug}`}>
                        <button className="bg-[#e91e63] text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 hover:bg-[#d62a4e]">
                          View Details
                        </button>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;