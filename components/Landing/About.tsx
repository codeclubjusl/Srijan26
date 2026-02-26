"use client";

import { useRef, useEffect } from "react";
import { AnimatedSectionTitle } from "./AnimatedSectionTitle";

export const About = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the video is visible
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full overflow-hidden pt-20 pb-10 flex flex-col gap-16 sm:gap-24 relative z-10">
      {/* Jadavpur University Section */}
      <div className="flex flex-col gap-6 lg:gap-8">
        <div className="flex flex-col ml-10 sm:ml-18 lg:ml-24 gap-1 sm:gap-2 items-start">
          <AnimatedSectionTitle
            text="ABOUT"
            className="text-4xl md:text-5xl lg:text-7xl font-elnath text-yellow flex justify-start"
          />
          <AnimatedSectionTitle
            text="JADAVPUR UNIVERSITY"
            className="text-4xl md:text-5xl lg:text-7xl font-elnath text-yellow flex justify-start"
          />
        </div>
        <div className="font-euclid text-base sm:text-lg md:text-xl lg:text-[22px] text-white/80 leading-relaxed max-w-5xl mx-10 sm:mx-18 lg:mx-24 justify-start">
          <p className="mb-4">
            Founding members of National Council of Bengal, in 1906 set the goal &quot;To achieve self reliance through empowerment of Youth by imparting Best of Global Knowledge&quot;, and Jadavpur University, founded on 24th December 1955, continues to do the same today.
          </p>
          <p>
            The university&apos;s commitment to research, innovation, community engagement, a legendary network of alumnus, and its unwavering contribution to imparting knowledge and refining the taste of culture and technology has marked its distinguished reputation not only in the Indian subcontinent but also at an international level.
          </p>
        </div>
      </div>

      {/* Srijan Section */}
      <div className="about-srijan-wrapper flex flex-col gap-10 lg:gap-16 w-full max-w-[1500px] mx-auto mt-8">
        {/* Title: Centered across both columns */}
        <AnimatedSectionTitle
          text="ABOUT SRIJAN"
          className="text-4xl md:text-5xl lg:text-7xl font-elnath text-yellow flex justify-center text-center whitespace-nowrap w-full"
        />

        {/* Content: Two Columns */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-16 px-6 sm:px-10 lg:px-24 w-full">
          
          {/* Left: Video */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden border-[2px] border-[#EBD87D]/40 shadow-[0_0_40px_rgba(251,191,36,0.15)] group transition-all duration-300 hover:border-[#EBD87D]/80">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
              <video 
                ref={videoRef}
                loop 
                muted 
                playsInline
                preload="metadata"
                className="w-full h-full object-cover relative z-0"
              >
                <source src="/videos/landing/srijan_about.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Right: Text */}
          <div className="flex flex-col items-center justify-center gap-6 lg:gap-8 w-full lg:w-1/2">
            <div className="font-euclid text-base sm:text-lg md:text-xl lg:text-[22px] text-white/80 leading-relaxed text-center max-w-2xl">
              <p className="mb-4">
                In the heart of Kolkata, where passion ignites, Srijan flourishes — an annual tribute to creativity and excellence, cradled by Jadavpur. From its inception in 2007 as a humble spark, it has flourished into an spectacular festival of technology and management.
              </p>
              <p>
                In this four-day spectacle, Srijan transcends from being merely a festival, it becomes a chorus of the most brilliant minds, echoing through the halls of Jadavpur&apos;s heritage. Join us at Jadavpur University to engage in 35+ events ranging from Coding Competitions, B-Plan competitions, Case Studies, Equity Research Events, Robotics Competitions, Web Design, Rap Battles and many more to have an experience of a lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
