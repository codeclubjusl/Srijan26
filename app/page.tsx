import { HeroSection } from "@/components/Landing/HeroSection";
import { Carousel } from "@/components/Landing/ImageCarousel";
import { PastSponsors } from "@/components/Landing/PastSponsors";
import Timeline from "@/components/Landing/Timeline";
import LiveEvents from "@/components/Landing/LiveEvents";
import WavyGradient from "@/components/WavyGradient";

export default function Home() {
  return (
    <>
      {/* Background Gradient */}
      <WavyGradient
        color1="#bc6116"
        color2="#8f0c03"
        color3="#1A0000"
        direction={20}
        speed={1.5}
        waveHeight={0.45}
        noiseIntensity={5}
        waveAmplitude={1}
      />
      <HeroSection />
      <Timeline />
      <LiveEvents />
      <PastSponsors />
      <Carousel
        baseWidth={320}
        autoplay
        autoplayDelay={2000}
        pauseOnHover
        loop
        round={false}
      />
    </>
  );
}
