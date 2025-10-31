import { ArrowUpRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

function NavBarTeam({ setActiveDropdown }) {
  const { data, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const res = await apiClient.get("/teamMember");
      return res.data.data;
    },
  });

  const members = data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-sora text-white">Our Team</h2>
        <Link href="/about" onClick={() => setActiveDropdown(null)}>
          <div className="text-[#FF4E58] flex items-center gap-2 cursor-pointer hover:text-[#d62a4e] transition-colors duration-300">
            <p>View All Team Members</p>
            <ChevronRight strokeWidth={3} size={15} />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-56 w-full rounded-lg overflow-hidden relative"
              >
                <div className="relative h-56 w-full rounded-lg overflow-hidden group cursor-pointer bg-zinc-700 animate-pulse"></div>
              </div>
            ))
          : members.slice(0, 3).map(member => (
              <Link href={`/teams/${member._id}`} key={member._id}>
                <div className="relative h-56 w-full rounded-lg overflow-hidden group cursor-pointer">
                  <Image
                    height={500}
                    width={500}
                    src={member.image}
                    alt={member.name}
                    className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute right-3 top-3 bg-[#FF4E58] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="text-white" size={18} />
                  </div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-gray-200 text-sm italic">
                      {member.designation}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}

export default NavBarTeam;
