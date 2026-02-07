"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { CLIP_PATH } from "./constants";

export function HamburgerButton({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative px-10 h-10 flex items-center justify-center overflow-hidden bg-red"
      style={{
        clipPath: CLIP_PATH,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
       <AnimatePresence>
        {isHovered && (
            <motion.div
             key="hamburger-hover"
             className="absolute inset-0 bg-white/10 pointer-events-none" 
             style={{ clipPath: CLIP_PATH }}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
            />
        )}
       </AnimatePresence>
      <div className="relative z-10">
        <Image src="/icons/hamburger.svg" alt="Menu" width={32} height={32} />
      </div>
    </motion.button>
  );
}
