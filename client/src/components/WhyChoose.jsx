"use client";

import React from "react";
import {
  DollarSign,
  ShieldCheck,
  LifeBuoy,
  Clock,
  Briefcase,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: DollarSign,
    title: "Best Price Guaranteed",
    description:
      "We promise unbeatable pricing on all services, ensuring you get the best value without compromising quality.",
    color: "text-[#FF4E58]",
  },
  {
    icon: ShieldCheck,
    title: "Certified & Trusted Service",
    description:
      "Our certified team provides reliable and safe services prioritizing your confidence and peace of mind.",
    color: "text-[#FF4E58]",
  },
  {
    icon: Users, // Used Users instead of the custom icon, as it's closer to the image
    title: "Professional Rescue Team",
    description:
      "Our experienced rescue team is available 24/7, trained to handle emergencies efficiently.",
    color: "text-[#FF4E58]",
  },
  {
    icon: Clock,
    title: "24/7 Customer Service",
    description:
      "Round-the-clock support team to assist, guide, and resolve any issues during your journey.",
    color: "text-[#FF4E58]",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const WhyChooseUs = () => {
  return (
    <div className="relative py-20 lg:py-32 bg-[#121212] overflow-hidden">
      {/* Background Image/Overlay for visual effect */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('/everest.webp')", // Replace with your actual background image
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(100%) brightness(0.5)",
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-7xl text-center">
        {/* Title Section */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
        >
          WHY CHOOSE FLYEAST
          <br />
          NEPAL?
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-16"
        >
          An enhanced safety record provides peace of mind while you explore the
          breathtaking heights of the Himalayas.
        </motion.p>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            // The icons in the image are custom SVGs inside a pink ring. We'll simulate this.
            return (
              <motion.div
                key={index}
                className="p-6 md:p-8 backdrop-blur-sm cursor-default rounded-2xl shadow-xl border border-white/5 text-left transition-all duration-300 hover:bg-zinc-800/80"
                variants={itemVariants}
              >
                <div className="flex items-start space-x-6">
                  {/* Icon Ring Simulation */}
                  <div
                    className={`p-2 rounded-full  bg-black/10  border border-red-400`}
                  >
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
