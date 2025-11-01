"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import { MapPin, Mail, Phone, Star } from "lucide-react";

// ✅ Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

// ✅ Demo data with real Unsplash images
const profiles = [
  {
    id: 1,
    slug: "mountain-view-lodge",
    name: "Mountain View Lodge",
    type: "Hotel & Stay",
    location: "Ghandruk, Kaski",
    email: "info@mountainlodge.com",
    phone: "+977 9801234567",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1501117716987-c8e2a0a3a78f",
    description:
      "A cozy mountain lodge offering stunning Annapurna views and warm hospitality.",
  },
  {
    id: 2,
    slug: "everest-handicrafts",
    name: "Everest Handicrafts",
    type: "Local Shop",
    location: "Thamel, Kathmandu",
    email: "contact@everestcrafts.com",
    phone: "+977 9812345678",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657",
    description:
      "Authentic Nepali handicrafts made by local artisans using sustainable materials.",
  },
  {
    id: 3,
    slug: "pokhara-cafe-delight",
    name: "Pokhara Café Delight",
    type: "Café & Restaurant",
    location: "Lakeside, Pokhara",
    email: "hello@pokharacafe.com",
    phone: "+977 9823456789",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
    description:
      "A cozy café offering local coffee and Himalayan-inspired desserts by Phewa Lake.",
  },
  {
    id: 4,
    slug: "taste-of-nepal",
    name: "Taste of Nepal",
    type: "Restaurant",
    location: "Lakeside, Pokhara",
    email: "order@tasteofnepal.com",
    phone: "+977 9845123456",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    description:
      "Traditional Nepali and Thakali cuisine made from locally sourced ingredients.",
  },
  {
    id: 5,
    slug: "himalayan-trekkers",
    name: "Himalayan Trekkers",
    type: "Trekking Agency",
    location: "Lazimpat, Kathmandu",
    email: "info@himalayatrekkers.com",
    phone: "+977 9809876543",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    description:
      "Professional trekking guides for Annapurna, Everest, and Langtang regions.",
  },
  {
    id: 6,
    slug: "village-homestay",
    name: "Village Homestay",
    type: "Homestay",
    location: "Bandipur, Tanahun",
    email: "stay@villagehomestay.com",
    phone: "+977 9812233445",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    description:
      "Experience authentic Nepali lifestyle with our family-run village homestay.",
  },
];

export default function ProfilesSection() {
  return (
    <section className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white py-20 px-6 md:px-20 relative">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#FF4E58] mb-2">
          Where locals shine and Nepal comes alive
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          your gateway to real experiences.
        </p>
      </div>

      <div className="relative">
        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          speed={800}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {profiles.map((profile) => (
            <SwiperSlide key={profile.id}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-[#FF4E58]/20 transition-all duration-500 group">
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-xs px-3 py-1 rounded-full">
                    {profile.type}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-[#FF4E58]">
                      {profile.name}
                    </h3>
                    <div className="flex items-center text-yellow-400 text-sm">
                      <Star size={14} fill="currentColor" />
                      <span className="ml-1">{profile.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mt-2">
                    {profile.description}
                  </p>

                  <div className="border-t border-zinc-800 mt-4 pt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin size={15} /> {profile.location}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail size={15} /> {profile.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone size={15} /> {profile.phone}
                    </div>
                  </div>

                  <Link href={`/store/${profile.slug}`}>
                    <button className="mt-5 w-full bg-[#FF4E58] hover:bg-[#ff636d] text-white font-medium py-2.5 rounded-xl transition-all duration-300">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Large Transparent Arrows Outside */}
        <div className="custom-prev absolute -left-10 md:-left-14 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-[#FF4E58] transition-colors duration-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>

        <div className="custom-next absolute -right-10 md:-right-14 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-[#FF4E58] transition-colors duration-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        {/* Pagination Dots */}
        <div className="custom-pagination mt-12 flex justify-center"></div>
      </div>
    </section>
  );
}
