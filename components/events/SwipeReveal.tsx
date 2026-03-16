"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function SwipeReveal({ children, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Pre-set the initial clipped state (Enable it before animation)
    gsap.set(".clip-reveal-content", {
      clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    });

    // 2. Perform the animation
    gsap.to(".clip-reveal-content", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 0.5,
      ease: "power2.out",
      // 3. Disable/Remove clip-path after completion
      clearProps: "clipPath", 
    });
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full ${className}`}
    >
      <div className="clip-reveal-content will-change-[clip-path] w-full h-full">
        {children}
      </div>
    </div>
  );
}