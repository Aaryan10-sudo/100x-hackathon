"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { MapPin } from "lucide-react";

const stores = [
  {
    id: 1,
    slug: "everest-handicrafts",
    name: "Everest Handicrafts",
    location: "Thamel, Kathmandu",
    type: "Local Shop",
    description:
      "Authentic Nepali handicrafts made by local artisans using sustainable materials.",
    image:
      "https://images.unsplash.com/photo-1602080757880-9f9f4b5b3e48?auto=format&fit=crop&w=1000&q=80",
    products: [
      {
        name: "Handmade Shawl",
        price: "Rs. 1200",
        image:
          "https://images.unsplash.com/photo-1593032465172-fd27d8d3e3f2?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Wooden Buddha Statue",
        price: "Rs. 3500",
        image:
          "https://images.unsplash.com/photo-1614850714590-7f50b4a7a9a0?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Lokta Paper Journal",
        price: "Rs. 600",
        image:
          "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Traditional Necklace",
        price: "Rs. 950",
        image:
          "https://images.unsplash.com/photo-1578898887932-dce8e76a0498?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: 2,
    slug: "pokhara-cafe-delight",
    name: "Pokhara Café Delight",
    location: "Phewa Lake, Pokhara",
    type: "Café & Tour Service",
    description:
      "Enjoy organic coffee and pastries by the lakeside. Also offers local sightseeing tours.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
    products: [
      {
        name: "Organic Coffee",
        price: "Rs. 350",
        image:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Homemade Cake",
        price: "Rs. 450",
        image:
          "https://images.unsplash.com/photo-1589308078054-832a89e2a5c9?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Pokhara Boat Ride (1 hour)",
        price: "Rs. 1200",
        image:
          "https://images.unsplash.com/photo-1586878220916-17b6ec69b9e0?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Local Breakfast Set",
        price: "Rs. 550",
        image:
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: 3,
    slug: "mountain-view-lodge",
    name: "Mountain View Lodge",
    location: "Ghandruk, Kaski",
    type: "Hotel & Stay",
    description:
      "A cozy mountain lodge offering stunning Annapurna views and warm hospitality.",
    image:
      "https://images.unsplash.com/photo-1600298882018-6e4e3e934a4e?auto=format&fit=crop&w=1000&q=80",
    products: [
      {
        name: "Deluxe Room",
        price: "Rs. 5000/night",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Local Dinner Set",
        price: "Rs. 1200",
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Guided Trek (Half Day)",
        price: "Rs. 3000",
        image:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Hot Shower + WiFi",
        price: "Included",
        image:
          "https://images.unsplash.com/photo-1582719478175-2f7967d3f85d?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
];

export default function StorePage() {
  const { slug } = useParams();
  const store = stores.find((s) => s.slug === slug);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-gray-400 text-xl">
        ❌ No store found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* ===== Header Section ===== */}
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <img
            src={store.image}
            alt={store.name}
            className="w-full lg:w-1/2 h-80 object-cover rounded-3xl border border-zinc-800 shadow-2xl hover:scale-105 transition-transform duration-700"
          />

          <div className="flex-1 space-y-5">
            <h1 className="text-4xl md:text-5xl font-bold text-[#FF4E58]">
              {store.name}
            </h1>
            <p className="text-gray-300 text-lg font-medium">{store.type}</p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MapPin size={16} /> {store.location}
            </div>
            <p className="text-gray-400 leading-relaxed text-base">
              {store.description}
            </p>
            <a
              href="/store"
              className="inline-block mt-4 bg-[#FF4E58] hover:bg-[#ff636d] text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-md"
            >
              ← Back to Stores
            </a>
          </div>
        </div>

        {/* ===== Products Section ===== */}
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
            🛍️ Featured Products & Services
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {store.products.map((product, index) => (
              <div
                key={index}
                className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-4 hover:border-[#FF4E58]/60 hover:shadow-[#FF4E58]/20 hover:shadow-2xl transition-all duration-500 group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-2xl mb-5 group-hover:scale-105 transition-transform duration-700"
                />
                <h3 className="text-xl font-semibold text-[#FF4E58] mb-2 text-center">
                  {product.name}
                </h3>
                <p className="text-gray-300 text-center text-base font-medium">
                  {product.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
