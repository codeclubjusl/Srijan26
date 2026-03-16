import React from "react";
import { Calendar } from "lucide-react";
import SwipeReveal from "./SwipeReveal";

interface Props {
  id: string;
  title: string;
  description: string;
  color: string;
  lastDate?: string;
  className?: string;
}

export default function EventTitleBlock({
  title,
  description,
  color,
  lastDate,
  className,
}: Props) {
  // Helper function to process strings with **bold** markers
  const renderWithBold = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, i) => {
      // If the chunk starts and ends with **, render it bold
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} style={{ color }} className="font-euclid font-semibold opacity-80">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Otherwise, render normal text
      return part;
    });
  };

  return (
    <SwipeReveal>
      <div className={` ${className} flex flex-col gap-2`}>
        <p className="font-bold mb-2 uppercase tracking-wider text-sm md:text-base flex items-center gap-2 text-white/70">
          <Calendar size={16} stroke={color} />
          Last Registration Date : {""}
          <span className="lg:text-2xl text-lg" style={{ color }}>
            {lastDate ? lastDate : "To be decided yet"}
          </span>
        </p>

        <h1
          style={{ color }}
          className="font-elnath text-4xl md:text-5xl xl:text-7xl font-bold uppercase tracking-wide"
        >
          {title}
        </h1>

        <p className="text-sm -mt-2 md:text-base text-white/70 leading-relaxed">
          {renderWithBold(description)}
        </p>
      </div>
    </SwipeReveal>
  );
}