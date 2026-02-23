import { MarqueeSlider } from "./MarqueeSlider";

const SPEAKERS = [
  {
    image: "/shirt2.png",
    name: "Speaker 1",
    description: "Description for Speaker 1",
    socials: [
      { href: "/", label: "linkedin" },
      { href: "/", label: "youtube" },
    ],
  },
  {
    image: "/shirt2.png",
    name: "Speaker 2",
    description: "Description for Speaker 2",
    socials: [
      { href: "/", label: "linkedin" },
      { href: "/", label: "youtube" },
    ],
  },
  {
    image: "/shirt2.png",
    name: "Speaker 3",
    description: "Description for Speaker 3",
    socials: [
      { href: "/", label: "linkedin" },
      { href: "/", label: "youtube" },
    ],
  },
];

export const PastSpeakers = () => {
  return (
    <MarqueeSlider name="Past Speakers" titleAlignment="right" itemCount={SPEAKERS.length}>
      {SPEAKERS.map((speaker) => (
        // <a
        //   key={speaker.name}
        //   href={speaker.link}
        //   target="_blank"
        //   rel="noopener noreferrer"
        //   className={`bg-no-repeat bg-cover bg-center block h-[33vw] w-[33vw] m-4`}
        //   style={{
        //     backgroundImage: `url(${speaker.image})`,
        //   }}
        // ></a>
        <li key={speaker.name} className={`block h-[33vw] w-[33vw] m-4`}>
          
        </li>
      ))}
    </MarqueeSlider>
  );
};
