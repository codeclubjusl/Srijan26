import Balls from "@/components/Balls";
import { HeroSection } from "@/components/Landing/HeroSection";
import Timeline from "@/components/Landing/Timeline";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Balls />
      <Timeline />
      {/* Free scrolling space -- remove later */}
      <div className="h-[100vh] w-full" />
    </>
  );
}
