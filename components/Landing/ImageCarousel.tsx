"use client";

const demoImages: CarouselImage[] = [
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80",
    label: "Torres del Paine",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80",
    label: "Swiss Alps",
  },
  {
    src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=700&q=80",
    label: "Dolomites, Italy",
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80",
    label: "Starlit Peaks",
  },
  {
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&q=80",
    label: "Himalayan Dawn",
  },
  {
    src: "https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=700&q=80",
    label: "Lake & Summits",
  },
];
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";

export interface CarouselImage {
  src: string;
  label: string;
}

interface CardStyle {
  transform: string;
  zIndex: number;
  opacity: number;
  filter: string;
  pointerEvents: "auto" | "none";
}

// All offsets are expressed as fractions of card width so they scale naturally
function getCardStyle(pos: number, cardW: number, cardH: number): CardStyle {
  const side = cardW * 0.34; // how far left/right the ±1 cards sit
  const far = cardW * 0.58; // how far left/right the ±2 cards sit
  const depth1 = cardH * 0.5;
  const depth2 = cardH * 0.92;
  const depth3 = cardH * 1.46;

  switch (pos) {
    case 0:
      return {
        transform: `translateX(0px) translateZ(0px) scale(1) rotateY(0deg)`,
        zIndex: 10,
        opacity: 1,
        filter: "brightness(1)",
        pointerEvents: "none",
      };
    case 1:
      return {
        transform: `translateX(${side}px) translateZ(-${depth1}px) rotateY(-15deg) scale(0.88)`,
        zIndex: 8,
        opacity: 0.85,
        filter: "brightness(0.75)",
        pointerEvents: "auto",
      };
    case -1:
      return {
        transform: `translateX(-${side}px) translateZ(-${depth1}px) rotateY(15deg) scale(0.88)`,
        zIndex: 8,
        opacity: 0.85,
        filter: "brightness(0.75)",
        pointerEvents: "auto",
      };
    case 2:
      return {
        transform: `translateX(${far}px) translateZ(-${depth2}px) rotateY(-25deg) scale(0.75)`,
        zIndex: 5,
        opacity: 0.5,
        filter: "brightness(0.5)",
        pointerEvents: "auto",
      };
    case -2:
      return {
        transform: `translateX(-${far}px) translateZ(-${depth2}px) rotateY(25deg) scale(0.75)`,
        zIndex: 5,
        opacity: 0.5,
        filter: "brightness(0.5)",
        pointerEvents: "auto",
      };
    default:
      return {
        transform: `translateX(0px) translateZ(-${depth3}px) scale(0.6)`,
        zIndex: 1,
        opacity: 0,
        filter: "brightness(0.3)",
        pointerEvents: "none",
      };
  }
}

function getPos(index: number, current: number, total: number): number {
  let pos = (((index - current) % total) + total) % total;
  if (pos > total / 2) pos -= total;
  return Math.max(-3, Math.min(3, pos));
}

interface CarouselProps {
  images?: CarouselImage[];
}

export function Carousel({ images = demoImages }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const sceneRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const n = images.length;

  // Measure the scene container and update on resize
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const h = w * (9 / 16); // maintain 16:9 ratio
      setDims({ w, h });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const navigate = useCallback(
    (dir: number) => setCurrent((prev) => (((prev + dir) % n) + n) % n),
    [n],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) navigate(dx < 0 ? 1 : -1);
  };

  const { w: cardW, h: cardH } = dims;

  return (
    <div
      className="full-bleed py-30 flex flex-col items-center justify-center px-4 sm:px-16 md:px-32 overflow-hidden"
    >
      {/*
        The scene wrapper takes up most of the viewport width (capped at a
        comfortable max) and drives all card sizing through ResizeObserver.
      */}
      <div
        className="w-full"
        style={{ maxWidth: "min(820px, 90vw)" }}
        ref={sceneRef}
      >
        <div
          className="relative w-full"
          style={{
            height: cardH || "auto",
            aspectRatio: cardH ? undefined : "16/9",
            perspective: cardW ? cardW * 3.5 : 1400,
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {cardW > 0 &&
              images.map((img, i) => {
                const pos = getPos(i, current, n);
                const cardStyle = getCardStyle(pos, cardW, cardH);

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (pos === 1) navigate(1);
                      else if (pos === -1) navigate(-1);
                    }}
                    style={{
                      position: "absolute",
                      width: cardW,
                      height: cardH,
                      borderRadius: Math.max(12, cardW * 0.025),
                      overflow: "hidden",
                      cursor: pos !== 0 ? "pointer" : "default",
                      boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
                      transition: "all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
                      backfaceVisibility: "hidden",
                      ...cardStyle,
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.label}
                      loading="lazy"
                      className="w-full h-full object-cover block"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35))",
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-white/80 text-center min-h-[1em] transition-opacity duration-300">
        {images[current]?.label}
      </p>

      {/* Controls */}
      <div className="mt-5 flex justify-center items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 hover:scale-110 text-xl"
          aria-label="Previous"
        >
          <ArrowLeft />
        </button>

        <div className="flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? 10 : 7,
                height: i === current ? 10 : 7,
                borderRadius: "50%",
                background:
                  i === current ? "#f0b040" : "rgba(255,255,255,0.35)",
                boxShadow: i === current ? "0 0 8px #f0b040aa" : "none",
                transition: "all 0.3s",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => navigate(1)}
          className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 hover:scale-110 text-xl"
          aria-label="Next"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
