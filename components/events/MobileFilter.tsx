"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { Category } from "@/components/events/types/events";

interface MobileFilterProps {
  categories: Category[];
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  statuses: string[];
  activeStatus: string;
  setActiveStatus: (status: string) => void;
  totalEvents: number; // NEW: Added to props
}

type DropdownSection = "categories" | "status" | null;

const MobileFilter: React.FC<MobileFilterProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  statuses,
  activeStatus,
  setActiveStatus,
  totalEvents,
}) => {
  const [openSection, setOpenSection] = useState<DropdownSection>(null);

  const isCategoriesOpen = openSection === "categories";
  const isStatusOpen = openSection === "status";

  const toggleSection = (section: DropdownSection) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const categoriesRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = categoriesRef.current;
    if (!el) return;

    if (isCategoriesOpen) {
      gsap.to(el, {
        height: "auto",
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [isCategoriesOpen]);

  useEffect(() => {
    const el = statusRef.current;
    if (!el) return;

    if (isStatusOpen) {
      gsap.to(el, {
        height: "auto",
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [isStatusOpen]);

  return (
    <div className="lg:hidden flex flex-col gap-2 pb-4 w-full">
      
      {/* NEW: Total Events Indicator */}
      <div className="px-2 mb-2">
        <div className="font-euclid text-sm text-center text-gray-300">
          Showing <span className="text-white">{totalEvents}</span> {totalEvents === 1 ? "event" : "events"}
        </div>
      </div>

      {/* Categories Dropdown */}
      <div className="px-2 py-2">
        <button
          onClick={() => toggleSection("categories")}
          className="w-full font-euclid text-lg flex items-center justify-between text-white transition-colors"
        >
          <p>Categories</p>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${
              isCategoriesOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        <div ref={categoriesRef} className="overflow-hidden h-0 opacity-0">
          <div className="flex flex-wrap gap-3 pt-4 pb-2">
            {categories.map((cat) => (
              <div
                key={cat}
                className={`shrink-0 group relative transition-all duration-300 ${
                  activeCategory === cat
                    ? "filter drop-shadow-[0_0_5px_rgba(240,0,0,0.6)]"
                    : ""
                }`}
              >
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-6 py-2 rounded-full text-sm transition-all duration-200 font-euclid ${
                    activeCategory === cat
                      ? "bg-red-500 text-white font-medium"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {cat}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Dropdown */}
      <div className="px-2 py-2">
        <button
          onClick={() => toggleSection("status")}
          className="w-full font-euclid text-lg flex items-center justify-between text-white transition-colors"
        >
          <p>Status</p>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${
              isStatusOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        <div ref={statusRef} className="overflow-hidden h-0 opacity-0">
          <div className="flex flex-wrap gap-3 pt-4 pb-2">
            {statuses.map((status) => (
              <div
                key={status}
                className={`shrink-0 group relative transition-all duration-300 ${
                  activeStatus === status
                    ? "filter drop-shadow-[0_0_5px_rgba(240,0,0,0.6)]"
                    : ""
                }`}
              >
                <button
                  onClick={() => setActiveStatus(status)}
                  className={`whitespace-nowrap px-6 py-2 rounded-full text-sm transition-all duration-200 font-euclid ${
                    activeStatus === status
                      ? "bg-red-500 text-white font-medium"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {status}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilter;