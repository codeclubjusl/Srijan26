"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { Clickable } from "@/components/Clickable";

type MobileNavContextType = {
  isOpen: boolean;
  toggle: () => void;
};

const MobileNavContext = createContext<MobileNavContextType>({
  isOpen: false,
  toggle: () => {},
});

export const useMobileNavContext = () => useContext(MobileNavContext);

export const MobileNavProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <MobileNavContext.Provider value={{ isOpen, toggle }}>
      {children}
      <div
        className={clsx(
          "bg-background px-4 fixed flex flex-col items-center h-screen w-screen z-10 transition-all duration-1000",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none invisible",
        )}
      >
        <div className="w-full grid gap-[0_var(--viewport-padding)] grid-cols-[1fr_min(60rem,calc(100%-var(--viewport-padding)*2))_1fr] ">
          <div className="flex w-full justify-between  py-8 px-4 h-fit col-2">
            <div className="flex gap-4">
              <Image
                src="/images/srijan-thumbnail.svg"
                alt="A square shaped logo for Srijan'26"
                width={32}
                height={32}
              />
              <Image
                src="/images/srijan-wide-icon.svg"
                alt="A wide layout logo for Srijan'26"
                height={32}
                width={2.298 * 32} // Aspect ratio 2.298:1
              />
            </div>
            <Clickable
              as="button"
              onClick={toggle}
              className="bg-red px-11! hover:bg-red-500"
            >
              <Image src="/icons/cross.svg" alt="Menu" width={24} height={24} />
            </Clickable>
          </div>
        </div>
        <ul className="py-16">
          <li className="py-4 flex justify-center">
            <Clickable
              as="a"
              href="/"
              className="block h-14! px-12! w-fit! uppercase text-3xl bg-red hover:bg-red-500"
            >
              home
            </Clickable>
          </li>
          {[
            { href: "/events", label: "events" },
            { href: "/merchandise", label: "merchandise" },
            { href: "/notifications", label: "notifications" },
            { href: "/dashboard", label: "dashboard" }
          ].map((item) => (
            <li key={item.label} className="pt-4">
              <Clickable as="a" href={item.href} className="uppercase text-3xl">
                {item.label}
              </Clickable>
            </li>
          ))}
        </ul>
        <div className="grid gap-4 pt-8 place-items-center">
          <ul className="flex">
            {[
              { href: "/", label: "linkedin" },
              { href: "/", label: "instagram" },
              { href: "/", label: "youtube" },
            ].map((item) => (
              <li key={item.label}>
                <Clickable
                  as="a"
                  href={item.href}
                  iconOnly
                  className="uppercase px-4! flex place-items-center"
                >
                  <Image
                    src={`/icons/${item.label}.svg`}
                    alt={item.label}
                    width={48}
                    height={48}
                  />
                </Clickable>
              </li>
            ))}
          </ul>
          <Clickable
            as="a"
            href="/login"
            className="md:hidden h-14! px-12! mt-6 w-fit! text-xl uppercase bg-foreground hover:bg-gray-300 text-black"
          >
            Login
          </Clickable>
        </div>
      </div>
    </MobileNavContext.Provider>
  );
};
