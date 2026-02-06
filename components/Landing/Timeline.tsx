'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EVENTS = [
  { label: 'Workshop', side: 'left', progress: 0.21, length: 120, shouldFlip: true }, 
  { label: 'Fun Zone', side: 'right', progress: 0.25, length: 300 },
  { label: 'F5 Talks', side: 'left', progress: 0.34, length: 300 },
  { label: 'Coding', side: 'left', progress: 0.37, length: 150 },
  { label: 'Robotics', side: 'right', progress: 0.41, length: 100, shouldFlip: true },
  { label: 'Gaming', side: 'left', progress: 0.58, length: 280 },
  { label: 'Finance & Management', side: 'left', progress: 0.61, length: 150 },
  { label: 'Go Karting', side: 'right', progress: 0.64, length: 120, shouldFlip: true },
  { label: 'Brain Storming', side: 'left', progress: 0.70, length: 120, shouldFlip: true },
  { label: 'Cultural Night', side: 'right', progress: 0.73, length: 200 },
  { label: 'Standup Comedy', side: 'right', progress: 0.78, length: 120 },
  { label: 'Miscellaneous', side: 'left', progress: 0.83, length: 120 },
];

const TIMELINE_PATH = "M44.0151 82C191.015 39.5 275.054 21.6821 362.254 10.0821C471.254 -4.41792 296.753 18.5821 198.253 57.0821C99.7535 95.5821 360.254 4.58208 532.254 0.0820786C704.254 -4.41792 172.754 177.082 61.7535 307.082C-49.2465 437.082 580.515 457 631.753 643.582C685.966 840.992 -13.2465 1163.58 2.25353 913.082C17.7535 662.582 533.515 852.521 533.515 1183C533.515 1359 261.515 1449 110.254 1658.08C-50.9435 1880.9 321.087 2007.75 467.254 2146.58C586.007 2253.55 689.915 2465.4 155.515 2457C-4.48486 2457 70.5151 2288 187.515 2366C281.115 2428.4 260.515 2562.5 247.515 2658";

const SRIJAN_PATH = "M0.632769 86.772L11.2568 78.708C12.5368 80.9266 14.1154 82.7186 15.9928 84.084C17.8701 85.364 20.0888 86.004 22.6488 86.004C24.9528 86.004 26.7448 85.5346 28.0248 84.596C29.3048 83.572 29.9448 82.1213 29.9448 80.244C29.9448 79.3053 29.7314 78.452 29.3048 77.684C28.9634 76.916 28.3234 76.148 27.3848 75.38C26.4461 74.612 25.1661 73.8013 23.5448 72.948C21.9234 72.0946 19.8754 71.1133 17.4008 70.004C12.1954 67.6146 8.5261 65.012 6.39277 62.196C4.25944 59.2946 3.19277 55.796 3.19277 51.7C3.19277 49.0546 3.70477 46.6653 4.72877 44.532C5.75277 42.3986 7.1181 40.6066 8.82477 39.156C10.6168 37.62 12.6648 36.468 14.9688 35.7C17.3581 34.8466 19.9181 34.42 22.6488 34.42C27.0861 34.42 30.9261 35.2306 34.1688 36.852C37.4968 38.4733 40.0994 40.6493 41.9768 43.38L31.6088 51.7C30.6701 50.5053 29.3474 49.4386 27.6408 48.5C26.0194 47.5613 24.3128 47.092 22.5208 47.092C20.7288 47.092 19.3208 47.476 18.2968 48.244C17.2728 49.012 16.7608 50.036 16.7608 51.316C16.7608 51.9986 16.9314 52.6386 17.2728 53.236C17.6141 53.8333 18.2541 54.4733 19.1928 55.156C20.1314 55.8386 21.4114 56.6066 23.0328 57.46C24.7394 58.3133 26.9154 59.3373 29.5608 60.532C34.9368 63.0066 38.6061 65.7373 40.5688 68.724C42.5314 71.6253 43.5128 75.124 43.5128 79.22C43.5128 82.2066 43.0008 84.9373 41.9768 87.412C40.9528 89.8013 39.5021 91.8493 37.6248 93.556C35.7474 95.2626 33.5288 96.5426 30.9688 97.396C28.4088 98.3346 25.6354 98.804 22.6488 98.804C16.8461 98.804 12.1101 97.5666 8.44077 95.092C4.77144 92.6173 2.16877 89.844 0.632769 86.772ZM56.1698 36.084H70.2498V41.588H70.5058C72.8098 39.1133 74.9431 37.3213 76.9058 36.212C78.9538 35.0173 81.4711 34.42 84.4578 34.42C88.1271 34.42 91.9671 35.6573 95.9778 38.132L89.5778 50.932C86.9324 49.0546 84.3298 48.116 81.7698 48.116C74.0898 48.116 70.2498 53.876 70.2498 65.396V97.012H56.1698V36.084ZM118.875 36.084V97.012H104.795V36.084H118.875ZM102.619 9.58796C102.619 7.11329 103.515 4.97996 105.307 3.18796C107.099 1.39596 109.232 0.499962 111.707 0.499962C114.267 0.499962 116.443 1.39596 118.235 3.18796C120.112 4.97996 121.051 7.11329 121.051 9.58796C121.051 12.0626 120.155 14.2386 118.363 16.116C116.571 17.908 114.395 18.804 111.835 18.804C109.189 18.804 106.971 17.908 105.179 16.116C103.472 14.2386 102.619 12.0626 102.619 9.58796ZM150.75 36.084V130.036H136.67V36.084H150.75ZM134.494 9.58796C134.494 7.11329 135.39 4.97996 137.182 3.18796C138.974 1.39596 141.107 0.499962 143.582 0.499962C146.142 0.499962 148.318 1.39596 150.11 3.18796C151.987 4.97996 152.926 7.11329 152.926 9.58796C152.926 12.0626 152.03 14.2386 150.238 16.116C148.446 17.908 146.27 18.804 143.71 18.804C141.064 18.804 138.846 17.908 137.054 16.116C135.347 14.2386 134.494 12.0626 134.494 9.58796ZM164.321 66.42C164.321 61.8973 165.046 57.716 166.497 53.876C168.033 49.9506 170.123 46.58 172.769 43.764C175.499 40.8626 178.657 38.6013 182.241 36.98C185.91 35.3586 189.878 34.548 194.145 34.548C197.985 34.548 201.526 35.188 204.769 36.468C208.011 37.748 211.169 39.8813 214.241 42.868H214.369V36.084H228.449V97.012H214.369V90.228H214.241C211.169 93.2146 208.011 95.3906 204.769 96.756C201.611 98.1213 198.198 98.804 194.529 98.804C190.177 98.804 186.123 97.9933 182.369 96.372C178.699 94.6653 175.499 92.3613 172.769 89.46C170.123 86.5586 168.033 83.1453 166.497 79.22C165.046 75.2946 164.321 71.028 164.321 66.42ZM178.657 66.42C178.657 69.236 179.041 71.8813 179.809 74.356C180.662 76.7453 181.857 78.836 183.393 80.628C184.929 82.42 186.806 83.828 189.025 84.852C191.329 85.7906 193.889 86.26 196.705 86.26C199.521 86.26 202.038 85.7906 204.257 84.852C206.561 83.828 208.523 82.4626 210.145 80.756C211.766 78.964 213.003 76.8733 213.857 74.484C214.795 72.0946 215.265 69.492 215.265 66.676C215.265 63.9453 214.795 61.3853 213.857 58.996C213.003 56.6066 211.766 54.5586 210.145 52.852C208.523 51.06 206.561 49.652 204.257 48.628C202.038 47.604 199.563 47.092 196.833 47.092C194.102 47.092 191.585 47.604 189.281 48.628C187.062 49.652 185.142 51.0173 183.521 52.724C181.985 54.4306 180.79 56.4786 179.937 58.868C179.083 61.172 178.657 63.6893 178.657 66.42ZM260.25 36.084V42.612H260.506C262.724 40.052 265.284 38.0466 268.186 36.596C271.172 35.1453 274.756 34.42 278.938 34.42C286.02 34.42 291.268 36.6386 294.682 41.076C298.18 45.428 299.93 51.6146 299.93 59.636V97.012H285.85V62.964C285.85 57.076 284.911 52.98 283.034 50.676C281.156 48.2866 278.255 47.092 274.33 47.092C269.978 47.092 266.522 48.5426 263.962 51.444C261.487 54.3453 260.25 59.3373 260.25 66.42V97.012H246.17V36.084H260.25Z";

const J_DOT_ANCHOR = { x: 143.6, y: 9.6 };

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const maskCircleRef = useRef<SVGCircleElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isFilledRef = useRef(false);
  const [dots, setDots] = useState<{ x: number; y: number; label: string; side: string; progress: number; length?: number; shouldFlip?: boolean }[]>([]);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      
      const newDots = EVENTS.map((event) => {
        const point = path.getPointAtLength(length * event.progress);
        return {
          x: point.x,
          y: point.y,
          label: event.label,
          side: event.side,
          progress: event.progress,
          length: event.length,
          shouldFlip: event.shouldFlip,
        };
      });

      setDots(newDots);

      const endPoint = path.getPointAtLength(length); 
      setTextPosition({
          x: endPoint.x - J_DOT_ANCHOR.x,
          y: endPoint.y - J_DOT_ANCHOR.y
      });
    }
  }, []);


  useEffect(() => {
    if (pathRef.current && containerRef.current && dots.length > 0) {
      const path = pathRef.current;
      const length = path.getTotalLength();


      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });


      gsap.set(dotsRef.current, { scale: 1, opacity: 0.2 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%", 
          end: "bottom 80%", 
          scrub: 1, 
        },
        onUpdate: function() {

            const currentOffset = parseFloat(gsap.getProperty(path, "strokeDashoffset") as string);
            const progress = 1 - (currentOffset / length);
            

            dots.forEach((dot, index) => {
                const element = dotsRef.current[index];
                if (element) {
                    if (progress >= dot.progress) {

                        if (gsap.getProperty(element, "opacity") !== 1) {
                             gsap.to(element, { opacity: 1, scale: 1.2, duration: 0.3, ease: "back.out(1.7)" });
                        }
                    } else {

                         if (gsap.getProperty(element, "opacity") !== 0.2) {
                             gsap.to(element, { opacity: 0.2, scale: 1, duration: 0.3 });
                        }
                    }
                }
            });


            if (maskCircleRef.current) {
                if (progress > 0.99 && !isFilledRef.current) {
                     isFilledRef.current = true;
                     gsap.to(maskCircleRef.current, { attr: { r: 500 }, duration: 0.8, ease: "power2.in", overwrite: true });
                } else if (progress <= 0.99 && isFilledRef.current) {
                     isFilledRef.current = false;
                     // Reverse the animation smoothly when scrolling back
                     gsap.to(maskCircleRef.current, { attr: { r: 0 }, duration: 0.8, ease: "power2.out", overwrite: true });
                }
            }
        }
      });


      tl.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        duration: 1,
      });

      return () => {
          tl.kill();
          ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }
  }, [dots]);

  return (
    <section className="relative py-20 flex flex-col items-center overflow-hidden" style={{ gridColumn: '1 / -1', width: '100%' }}>
      {/* Timeline Title */}
      <h2 className="font-elnath text-3xl md:text-5xl lg:text-6xl uppercase tracking-[0.3em] text-amber-200/90 mb-16">
        Timeline
      </h2>


      <div ref={containerRef} className="relative w-full max-w-[500px] px-8" style={{ aspectRatio: '637/2658' }}>
        
        {/* The SVG Line */}
        <svg 
          viewBox="0 0 637 2660" 
          fill="none" 
          className="w-full h-full absolute top-0 left-0"
          style={{ overflow: 'visible' }} 
        >
          <defs>
             <mask id="srijan-fill-mask">
                 <circle ref={maskCircleRef} cx={J_DOT_ANCHOR.x} cy={J_DOT_ANCHOR.y} r="0" fill="white" />
             </mask>
          </defs>

          <path
            ref={pathRef}
            d={TIMELINE_PATH}
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-80"
          />

          {/* Srijan Text SVG Group */}
          <g transform={`translate(${textPosition.x}, ${textPosition.y})`}>
              {/* Layer A: Outline (Always Visible) */}
              <path 
                d={SRIJAN_PATH} 
                stroke="white" 
                strokeWidth="1.5" 
                fill="none" 
                className="opacity-50"
              />
              
              {/* Layer B: Fill (Revealed by Mask) */}
              <path 
                d={SRIJAN_PATH} 
                fill="white" 
                mask="url(#srijan-fill-mask)"
              />
          </g>
        </svg>

        {/* Render Calculated Dots and Labels */}
        {dots.map((dot, index) => {
            
            // for responsive layout
            const isLeft = dot.side === 'left';
            const isFlip = dot.shouldFlip;

            const mobileSideIsLeft = isFlip ? !isLeft : isLeft;

            let connectorClasses = `absolute top-1/2 -translate-y-1/2 h-[2px] border-t-2 border-dashed border-white/50 w-[min(var(--line-length),15vw)] lg:w-[var(--line-length)] transition-all duration-300 `;
            let labelClasses = `absolute top-1/2 -translate-y-1/2 text-white font-bold text-xs sm:text-sm lg:text-base tracking-widest uppercase whitespace-normal max-w-[40vw] lg:whitespace-nowrap lg:max-w-none `;

            if (mobileSideIsLeft) {
                connectorClasses += "right-full mr-2 ";
                labelClasses += "right-full text-right origin-right mr-[calc(min(var(--line-length),15vw)+1rem)] ";
                
                if (isFlip) {
                     connectorClasses += "lg:right-auto lg:mr-0 lg:left-full lg:ml-2 ";
                     labelClasses += "lg:right-auto lg:mr-0 lg:left-full lg:ml-[calc(var(--line-length)+1rem)] lg:text-left lg:origin-left ";
                } else {
                     labelClasses += "lg:mr-[calc(var(--line-length)+1rem)] ";
                }
            } else {
                connectorClasses += "left-full ml-2 ";
                labelClasses += "left-full text-left origin-left ml-[calc(min(var(--line-length),15vw)+1rem)] ";

                if (isFlip) {
                     connectorClasses += "lg:left-auto lg:ml-0 lg:right-full lg:mr-2 ";
                     labelClasses += "lg:left-auto lg:ml-0 lg:right-full lg:mr-[calc(var(--line-length)+1rem)] lg:text-right lg:origin-right ";
                } else {
                     labelClasses += "lg:ml-[calc(var(--line-length)+1rem)] ";
                }
            }

            return (
              <div
                key={index}
                ref={(el) => { dotsRef.current[index] = el; }}
                className="absolute w-3 h-3 md:w-4 md:h-4 bg-white rounded-full -ml-1.5 md:-ml-2 -mt-1.5 md:-mt-2 pointer-events-none origin-center"
                style={{ 
                  left: `${(dot.x / 637) * 100}%`, 
                  top: `${(dot.y / 2660) * 100}%`,
                  '--line-length': dot.length ? `${dot.length}px` : '7rem'
                } as React.CSSProperties}
              >
                <div className={connectorClasses} />
                <div className={labelClasses}>
                  {dot.label}
                </div>
              </div>
            );
        })}
      </div>
    </section>
  );
}
