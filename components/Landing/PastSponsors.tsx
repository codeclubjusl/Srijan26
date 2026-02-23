import { MarqueeSlider } from "./MarqueeSlider";

const SPONSORS = [
  {
    name: "aliff-logo",
    image: "images/sponsors/aliff-logo.webp",
    link: "https://aliffgroup.com",
  },
  {
    name: "bong-pizza",
    image: "images/sponsors/bong-pizza.webp",
    link: "https://www.instagram.com/bongpizza/",
  },
  {
    name: "calcutta-cacophony-logo",
    image: "images/sponsors/calcutta-cacophony-logo.webp",
    link: "https://www.instagram.com/calcutta_cacophony/",
  },
  {
    name: "canara-bank-logo",
    image: "images/sponsors/canara-bank-logo.webp",
    link: "https://canarabank.com",
  },
  {
    name: "comedy-company-logo",
    image: "images/sponsors/comedy-company-logo.webp",
    link: "https://www.instagram.com/thecomedycompanykol/",
  },
  {
    name: "drivers-club-logo",
    image: "images/sponsors/drivers-club-logo.webp",
    link: "https://www.instagram.com/driversclubkolkata/",
  },
  {
    name: "evepaper-logo",
    image: "images/sponsors/evepaper-logo.webp",
    link: "https://evepaper.com",
  },
  {
    name: "eve-placement-logo",
    image: "images/sponsors/eve-placement-logo.webp",
    link: "https://eveplacement.com",
  },
  {
    name: "friends-fm-logo",
    image: "images/sponsors/friends-fm-logo.webp",
    link: "https://friendsfm.in",
  },
  {
    name: "ims-logo",
    image: "images/sponsors/ims-logo.webp",
    link: "https://www.imsindia.com",
  },
  {
    name: "interview-buddy",
    image: "images/sponsors/interview-buddy.webp",
    link: "https://interviewbuddy.in",
  },
  {
    name: "kitkat-logo",
    image: "images/sponsors/kitkat-logo.webp",
    link: "https://www.nestle.in/brands/chocolatesconfectionery/kitkat",
  },
  {
    name: "mio-amore-logo",
    image: "images/sponsors/mio-amore-logo.svg",
    link: "https://mioamoreshop.com",
  },
  {
    name: "nescafe-logo",
    image: "images/sponsors/nescafe-logo.webp",
    link: "https://www.nescafe.com/in",
  },
  {
    name: "paharpur-logo",
    image: "images/sponsors/paharpur-logo.webp",
    link: "https://www.paharpur.com",
  },
  {
    name: "redbull-logo",
    image: "images/sponsors/redbull-logo.webp",
    link: "https://www.redbull.com/in-en",
  },
  {
    name: "spykar-logo",
    image: "images/sponsors/spykar-logo.webp",
    link: "https://www.spykar.com",
  },
  {
    name: "sugoi-drop-logo",
    image: "images/sponsors/sugoi-drop-logo.webp",
    link: "https://www.instagram.com/sugoidrop/",
  },
  {
    name: "telegraph-logo",
    image: "images/sponsors/telegraph-logo.webp",
    link: "https://www.telegraphindia.com",
  },
  {
    name: "toi-logo",
    image: "images/sponsors/toi-logo.webp",
    link: "https://timesofindia.indiatimes.com",
  },
  {
    name: "unstop-logo",
    image: "images/sponsors/unstop-logo.webp",
    link: "https://unstop.com",
  },
  {
    name: "wiley-logo-black",
    image: "images/sponsors/wiley-logo-black.webp",
    link: "https://www.wiley.com",
  },
];

export const PastSponsors = () => {
  return (
    <MarqueeSlider name="Past Sponsors" itemCount={SPONSORS.length}>
      {SPONSORS.map((sponsor) => (
        <li
          key={sponsor.name}
          className={`bg-no-repeat bg-contain bg-center block h-[33vw] w-[33vw] m-4 rounded`}
          style={{
            backgroundImage: `url(${sponsor.image})`,
          }}
        >
          <a
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full"
            aria-label={sponsor.name}
          ></a>
        </li>
      ))}
    </MarqueeSlider>
  );
};
