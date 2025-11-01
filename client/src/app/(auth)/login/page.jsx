"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white overflow-hidden">
      {/* Left Side - Image (60%) */}
      <div className="relative w-full md:w-[60%] h-64 md:h-auto overflow-hidden">
        <img
          src="/store/basket.jpg"
          alt="Nepal Traditional Tourism"
          className="object-cover w-full h-full object-center scale-105 brightness-75"
        />
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Overlay Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-[#FF4E58] mb-4 drop-shadow-[0_0_15px_rgba(255,78,88,0.5)]">
            Discover the Heart of Nepal
          </h1>
          <p className="text-gray-300 max-w-md text-lg leading-relaxed">
            Join our mission to connect travelers with authentic local
            businesses, cultures, and experiences — from mountain lodges to
            handmade crafts.
          </p>
        </div>
      </div>

      {/* Right Side - Form (40%) */}
      <div className="flex items-center justify-center w-full md:w-[40%] p-8 relative">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF4E58]/10 via-transparent to-transparent blur-2xl pointer-events-none"></div>

        {/* Login Box */}
        <div className="relative bg-zinc-900/70 border-2 border-black rounded-3xl w-full max-w-md p-10 space-y-6 backdrop-blur-xl">
          {/* Logo / Title */}
          <div className="text-center mb-6">
            <div className="mx-auto w-14 h-14 bg-[#FF4E58]/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-[#FF4E58] text-2xl font-bold">LC</span>
            </div>
            <h2 className="text-3xl font-bold text-[#FF4E58]">
              Welcome Back 🇳🇵
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Explore Nepal’s authentic products and local stories.
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#FF4E58] focus:border-[#FF4E58] outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#FF4E58] focus:border-[#FF4E58] outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-[#FF4E58] transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-[#FF4E58] w-4 h-4 rounded"
                />
                Remember me
              </label>
              <a href="#" className="hover:text-[#FF4E58] transition">
                Forgot password?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#FF4E58] text-white py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer"
            >
              Login
            </button>
          </form>

          {/* Signup */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-[#FF4E58] hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
