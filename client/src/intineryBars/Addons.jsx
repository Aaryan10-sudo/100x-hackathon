import React from "react";
import { useBookingStore } from "@/store/BookingStore";

function Addons({ handleAddonChange, addons, variant = "light" }) {
  const { bookingData } = useBookingStore();

  return (
    <div>
      <div className="space-y-6 w-full">
        <h3
          className={`text-xl font-semibold ${
            variant === "light" ? "text-gray-800" : "text-white"
          } `}
        >
          Add-On Services
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {addons.map(addon => {
            const isSelected = bookingData.addons.some(
              a => a._id === addon._id
            );
            return (
              <label
                htmlFor={addon._id}
                key={addon._id}
                className={`p-4 border rounded-lg transition-all ${
                  isSelected
                    ? ` ${
                        variant === "dark" ? "border-[#EA3359]/30 " : ""
                      } bg-pink-50/20`
                    : ` border-gray-200 ${
                        variant === "dark"
                          ? "border-[#EA3359]/30"
                          : "border-gray-200"
                      } `
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={addon._id}
                      checked={isSelected}
                      onChange={e => handleAddonChange(addon, e.target.checked)}
                      className="mt-1 h-6 w-6 text-[#EA3359] border-gray-300 rounded"
                    />
                    <div>
                      <label
                        htmlFor={addon._id}
                        className={`font-medium text-xl ${
                          variant === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {addon.name}
                      </label>
                      {addon.description && (
                        <div
                          className={` ${
                            variant === "dark"
                              ? "text-gray-300"
                              : "text-gray-500"
                          } mt-1`}
                        >
                          {addon.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="font-medium text-xl text-[#EA3359] whitespace-nowrap">
                    +${addon.price}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Addons;
