import React from "react";
import Link from "next/link"; // Swap to "react-router-dom" if not using Next.js
import SwipeReveal from "./SwipeReveal";

interface Props {
  updates?: string[];
  color: string;
  className?: string;
}

export default function EventUpdates({ updates, color, className }: Props) {
  if (!updates || updates.length === 0) return null;

  const renderFormattedText = (text: string) => {
    if (!text) return null;

    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);

    return parts.map((part, i) => {
      // Bold
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} style={{ color }} className="font-euclid font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Links (Important Button Style) - Preserved and enhanced with brightness hover, padding, shadow, arrow
      if (part.startsWith("[") && part.endsWith(")")) {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const linkText = match[1];
          const url = match[2];
          
          // Determine if the link is internal (SPA) or external
          const isInternal = url.startsWith("/") || url.startsWith("#");

          // Shared styles for both internal and external buttons - Preserved and enhanced with hover:brightness-125
          const buttonClasses = 
            "group inline-flex items-center justify-center gap-2 px-5 py-1.5 mx-1 mt-2 text-sm font-bold uppercase tracking-wider rounded-full transition-all duration-300 hover:shadow-xl hover:brightness-125 active:translate-y-0";
          
          const buttonStyles = {
            backgroundColor: color,
            color: "#111", // Dark text ensures contrast against vibrant theme colors
            boxShadow: `0 4px 20px -6px ${color}`, // Subtle theme-colored glow - Preserved
          };

          const buttonContent = (
            <>
              <span>{linkText}</span>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          );

          // Render SPA Link for internal routes
          if (isInternal) {
            return (
              <Link
                key={i}
                href={url}
                className={buttonClasses}
                style={buttonStyles}
              >
                {buttonContent}
              </Link>
            );
          }

          // Render standard anchor tag for external routes
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses}
              style={buttonStyles}
            >
              {buttonContent}
            </a>
          );
        }
      }

      return part;
    });
  };

  return (
    <SwipeReveal>
      <div className={`${className} space-y-6`}>
        {/* NEW FLASHY HEADING - Nested div for spacing control */}
        <div className="space-y-2">
          <h2
            // Added flex, items-center, and gap-4 to align the icon and text
            className="font-elnath text-3xl uppercase border-b pb-2 mb-10 flex items-center gap-4"
            style={{ color }}
          >
            {/* Alert Triangle SVG */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-8 h-8 md:w-10 md:h-10 shrink-0"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Event Updates
          </h2>
        </div>

        {/* Text container: space-y-6 preserved for increased line spacing */}
        <div className="text-white space-y-3">
          {updates.map((item, index) => {
            const isHeading = item.startsWith("# ");
            const textToRender = isHeading ? item.slice(2) : item;

            if (isHeading) {
              return (
                <p
                  key={index}
                  className="leading-relaxed text-xl pb-1 mt-6 font-semibold"
                >
                  {renderFormattedText(textToRender)}
                </p>
              );
            }

            return (
              <div key={index} className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                />
                <span className="leading-1 inline-block w-full">
                  {renderFormattedText(textToRender)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </SwipeReveal>
  );
}