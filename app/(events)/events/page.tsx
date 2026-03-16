"use client";

import { useState } from "react";
import { ReactLenis } from "lenis/react";
import WavyGradient from "@/components/WavyGradient";
import Header from "@/components/events/Header";
import Sidebar from "@/components/events/Sidebar";
import MobileFilter from "@/components/events/MobileFilter";
import EventGrid from "@/components/events/EventGrid";
import { CATEGORIES, STATUSES } from "@/components/events/constants/events";
import { EVENTS_DATA } from "@/data/eventsList";
import { Category } from "@/components/events/types/events";

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = EVENTS_DATA.filter((event) => {
    const matchesCategory =
      activeCategory === "All" || event.category === activeCategory;
    const matchesStatus =
      activeStatus === "All" || event.status === activeStatus;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch && matchesStatus;
  });

  return (
    <ReactLenis root>
      <div className="relative min-h-screen text-white font-sans selection:bg-orange-400 selection:text-white">
        <WavyGradient
          color1="#F09400"
          color2="#A80000"
          color3="#1A0000"
          direction={20}
          speed={1.5}
          waveHeight={0.45}
          noiseIntensity={5}
          waveAmplitude={1}
        />

        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <main className="w-full mx-auto flex flex-col lg:flex-row gap-8 p-6">
          <Sidebar
            categories={CATEGORIES}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            statuses={STATUSES}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            totalEvents={filteredEvents.length} // NEW: Passing total events
          />
          
          <MobileFilter
            categories={CATEGORIES}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            statuses={STATUSES}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            totalEvents={filteredEvents.length} // NEW: Passing total events
          />

          <div className="flex-1 min-w-0">
            <EventGrid filteredEvents={filteredEvents} />
          </div>
        </main>
      </div>
    </ReactLenis>
  );
}