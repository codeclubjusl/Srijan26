// This is your final, optimized component.
import React from "react";
import SwipeReveal from "./SwipeReveal";

interface Props {
  prizeDetails?: string[];
  color: string;
  className?: string;
}

export default function EventPrizeDetails({ prizeDetails, color, className }: Props) {
  if (!prizeDetails || prizeDetails.length === 0) return null;

  const renderWithBold = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} style={{ color }} className="font-euclid font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <SwipeReveal>
      <div className={` ${className || ''} space-y-4`}>
        <h2 className="font-elnath text-3xl uppercase border-b pb-2" style={{ color }}>
          Prize Details
        </h2>
        
        <div className="text-white space-y-3">
          {prizeDetails.map((detail, index) => {
            const isHeading = detail.startsWith("# ");
            const textToRender = isHeading ? detail.slice(2) : detail;

            if (isHeading) {
              return (
                <p key={index} className="leading-relaxed text-xl pb-1 mt-8">
                  {renderWithBold(textToRender)}
                </p>
              );
            }

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