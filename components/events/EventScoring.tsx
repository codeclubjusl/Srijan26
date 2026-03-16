import React from "react";
import SwipeReveal from "./SwipeReveal";

interface Props {
  scoring: string[];
  color: string;
  className?: string;
}

export default function EventScoring({ scoring, color, className }: Props) {
  // Safety check: if the array is empty or undefined, don't render anything
  if (!scoring || scoring.length === 0) return null;

  // Helper function to process strings with **bold** markers only
  const renderWithBold = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, i) => {
      // If the chunk starts and ends with **, render it bold
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} style={{ color }} className="font-euclid font-semibold">
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
      <div className={` ${className} space-y-4`}>
        <h2 className="font-elnath text-3xl uppercase border-b pb-2" style={{ color }}>
          Event Scoring
        </h2>
        
        <div className="text-white space-y-3">
          {scoring.map((item, index) => {
            // CONDITIONAL CHECK: If the string starts with "# ", it's an intro text/heading.
            const isHeading = item.startsWith("# ");
            
            // Remove the "# " prefix if it exists before rendering
            const textToRender = isHeading ? item.slice(2) : item;

            if (isHeading) {
              return (
                <p key={index} className="leading-relaxed text-xl pb-1 mt-8">
                  {renderWithBold(textToRender)}
                </p>
              );
            }

            // Render as a bullet point
            return (
              <div key={index} className="flex items-start gap-3">
                <span
                  className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="leading-relaxed">
                  {renderWithBold(textToRender)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </SwipeReveal>
  );
}