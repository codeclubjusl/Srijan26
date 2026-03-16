"use client";

import React from "react";
import { Search } from "lucide-react";
import { CLIP_PATH } from "./constants/events";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  // Pass the clip-path as a CSS variable so we can apply it only on desktop (md: breakpoint)
  const desktopClipStyle = { "--desktop-clip": CLIP_PATH } as React.CSSProperties;

  return (
    <header className="sticky top-5 md:top-0 z-30 border-b border-white/10 px-6 py-4 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="font-elnath text-4xl font-bold tracking-wide">
          EVENTS
        </h1>

        <div
          style={desktopClipStyle}
          className="flex items-center gap-4 max-w-120 w-full bg-white/30 py-2 px-6 rounded-full md:rounded-none md:pl-10 md:pr-16 md:[clip-path:var(--desktop-clip)] transition-all"
        >
          <Search className="font-euclid text-gray-400 w-5 h-5 shrink-0" />
          <input
            type="text"
            placeholder="Search events by name or tag..."
            className="font-euclid bg-transparent py-1 w-full focus:outline-none text-sm text-white placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;