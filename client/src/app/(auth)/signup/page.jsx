"use client";

import { useState } from "react";
import { Mail, Phone, Globe, MapPin, Store, Lock, User } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    category: "",
    city: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white p-6">
      <div className="relative bg-zinc-900/70 border border-zinc-800 rounded-3xl shadow-[0_0_40px_rgba(255,78,88,0.15)] w-full max-w-2xl p-10 backdrop-blur-xl">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="mx-auto w-14 h-14 bg-[#FF4E58]/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-[#FF4E58] text-2xl font-bold">LC</span>
          </div>
          <h2 className="text-3xl font-bold text-[#FF4E58]">
            Create Your Store
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Join LocalConnect and showcase your business to the world 🌍
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Store Name */}
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Store Name
            </label>
            <div className="relative">
              <Store
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="name"
                placeholder="e.g. Everest Handicrafts"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-10 py-3 text-white focus:ring-2 focus:ring-[#FF4E58] outline-none transition"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-2 text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-10 py-3 text-white focus:ring-2 focus:ring-[#FF4E58] outline-none transition"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-2 text-gray-300">Phone</label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="phone"
                placeholder="+977 9801234567"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-10 py-3 text-white focus:ring-2 focus:ring-[#FF4E58] outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2 text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-10 py-3 text-white focus:ring-2 focus:ring-[#FF4E58] outline-none transition"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm mb-2 text-gray-300">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#FF4E58] outline-none transition"
            >
              <option value="">Select a category</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel & Stay</option>
              <option value="crafts">Local Crafts</option>
              <option value="trekking">Trekking Agency</option>
              <option value="shop">Shop</option>
            </select>
          </div>

          {/* Address */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-300">City</label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Kathmandu"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-10 py-3 text-white focus:ring-2 focus:ring-[#FF4E58] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Country
              </label>
              <div className="relative">
                <Globe
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="country"
                  placeholder="e.g. Nepal"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-10 py-3 text-white focus:ring-2 focus:ring-[#FF4E58] outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#FF4E58] hover:bg-[#ff636d] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-[0_0_25px_#FF4E58]"
          >
            Create Account
          </button>

          {/* Already have account */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-[#FF4E58] hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
