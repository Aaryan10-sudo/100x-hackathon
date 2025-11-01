"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function GradientText({
  className,
  children,
  as: Component = "span",
  ...props
}) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn(
        "relative inline-flex overflow-hidden bg-white dark:bg-black",
        className
      )}
      {...props}
    >
      {children}
      <span className="pointer-events-none absolute inset-0 mix-blend-lighten dark:mix-blend-darken">
        <span className="pointer-events-none absolute -top-1/2 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-1_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-1))] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute right-0 top-0 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-2_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-2))] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute bottom-0 left-0 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-3_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-3))] mix-blend-overlay blur-[1rem]"></span>
        <span className="pointer-events-none absolute -bottom-1/2 right-0 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-4_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-4))] mix-blend-overlay blur-[1rem]"></span>
      </span>
    </MotionComponent>
  );
}

const destinations = [
  {
    id: "1",
    name: "Santorini",
    country: "Greece",
    description:
      "Experience the stunning sunsets and white-washed buildings of this iconic Greek island paradise.",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    rating: 4.9,
    reviews: 342,
    price: "NPR. 2,499",
    duration: "7 days",
    groupSize: "2-8",
    category: "Beach",
    featured: true,
  },
  {
    id: "2",
    name: "Kyoto",
    country: "Japan",
    description:
      "Discover ancient temples, traditional gardens, and the serene beauty of Japan's cultural heart.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    rating: 4.8,
    reviews: 289,
    price: "NPR. 3,299",
    duration: "10 days",
    groupSize: "2-6",
    category: "Culture",
    featured: true,
  },
  {
    id: "3",
    name: "Swiss Alps",
    country: "Switzerland",
    description:
      "Adventure awaits in the majestic mountains with world-class skiing and breathtaking views.",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    rating: 4.9,
    reviews: 421,
    price: "NPR. 4,199",
    duration: "8 days",
    groupSize: "2-10",
    category: "Adventure",
    featured: true,
  },
  {
    id: "4",
    name: "Bali",
    country: "Indonesia",
    description:
      "Relax in tropical paradise with pristine beaches, lush rice terraces, and spiritual temples.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    rating: 4.7,
    reviews: 567,
    price: "NPR. 1,899",
    duration: "9 days",
    groupSize: "2-12",
    category: "Beach",
  },
  {
    id: "5",
    name: "Iceland",
    country: "Iceland",
    description:
      "Witness the Northern Lights, geothermal wonders, and dramatic volcanic landscapes.",
    image:
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
    rating: 4.8,
    reviews: 398,
    price: "NPR. 3,799",
    duration: "6 days",
    groupSize: "2-8",
    category: "Nature",
  },
  {
    id: "6",
    name: "Paris",
    country: "France",
    description:
      "Fall in love with the City of Light, from the Eiffel Tower to charming cafés and museums.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    rating: 4.6,
    reviews: 612,
    price: "NPR. 2,899",
    duration: "5 days",
    groupSize: "2-6",
    category: "Culture",
  },
];

const categories = ["All", "Beach", "Culture", "Adventure", "Nature"];

function TopDestinations() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);

  const filteredDestinations =
    selectedCategory === "All"
      ? destinations
      : destinations.filter(dest => dest.category === selectedCategory);

  return (
    <div className="min-h-screen bg-zinc-950 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-rose-950 text-rose-300 border-rose-800">
            Explore the World
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-100">
            Top Destinations
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover breathtaking places around the globe, handpicked for
            unforgettable experiences
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                "rounded-full transition-all duration-300",
                selectedCategory === category
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900"
                  : "bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 border-gray-700 hover:text-white"
              )}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(destination.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card className="overflow-hidden h-full bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:shadow-2xl hover:shadow-rose-900/30 transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                    animate={{
                      scale: hoveredCard === destination.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  {destination.featured && (
                    <Badge className="absolute top-4 right-4 bg-rose-600 text-white border-0 hover:bg-rose-700">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {destination.country}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {destination.name}
                    </h3>
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {destination.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-100">
                        {destination.rating}
                      </span>
                      <span className="text-gray-500">
                        ({destination.reviews})
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-950/50 text-blue-300 border-blue-800"
                    >
                      {destination.category}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{destination.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{destination.groupSize} people</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="text-2xl font-bold text-rose-400">
                        {destination.price}
                      </p>
                    </div>
                    <Button className="bg-rose-600 hover:bg-rose-700 text-white group-hover:shadow-lg group-hover:shadow-rose-900 transition-all duration-300">
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-gray-100 border-gray-700 hover:text-white"
          >
            View All Destinations
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default function TopDestinationsDemo() {
  return <TopDestinations />;
}
