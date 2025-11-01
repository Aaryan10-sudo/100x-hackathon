"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <div className="relative bg-zinc-950 py-20 lg:py-32 overflow-hidden">
      {/* Background Image (Subtle and full-width) */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/store/thanga.jpg"
          alt="Traditional Background Texture"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-zinc-950/80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="bg-black/70 border border-zinc-800 rounded-3xl p-8 md:p-16 text-center shadow-xl backdrop-blur-sm"
        >
          {/* Main Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#FF4E58] mb-4 tracking-tighter">
            One Decision Can Change Your Life
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-10">
            Join our community, explore authentic local goods, or start
            promoting your business to the world.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/start-journey">
              <button className="px-8 py-3 cursor-pointer bg-[#FF4E58] text-white font-bold rounded-full text-lg shadow-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2 group">
                Start Exploring
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <Link href="/promote-business">
              <button className="px-8 py-3 border-2 cursor-pointer border-zinc-500 text-zinc-300 font-semibold rounded-full text-lg hover:bg-zinc-700/50 transition-colors flex items-center justify-center gap-2">
                Promote Your Business
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-zinc-400">
            <p className="text-sm">Need immediate assistance?</p>
            <p className="text-lg font-medium text-white hover:text-[#FF4E58] transition-colors">
              <a href="mailto:contact@flowneststudio.com">
                contactus@gmail.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
