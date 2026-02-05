"use client";

import Image from "next/image";
import { Clickable } from "@/components/Clickable";
import { useMobileNavContext } from "@/hooks/useMobileNav";

export default function NavBar() {
  const { isOpen: _, toggle } = useMobileNavContext();

  return (
    <nav className="flex justify-between  py-8 px-4 h-fit">
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
      <div className="flex gap-6 2xl:hidden">
        <Clickable
          as="a"
          href="/login"
          className="hidden md:flex bg-foreground hover:bg-gray-300 text-black text-lg uppercase px-4 py-2"
        >
          Login
        </Clickable>
        <Clickable
          as="button"
          onClick={toggle}
          className="bg-red hover:bg-red-500"
        >
          <Image src="/icons/hamburger.svg" alt="Menu" width={32} height={32} />
        </Clickable>
      </div>
      <ul className="hidden 2xl:flex gap-6 items-center">
        <li>
          <Clickable
            as="a"
            href="/"
            className="w-fit! uppercase bg-red hover:bg-red-500"
          >
            home
          </Clickable>
        </li>
        {[
          { href: "/events", label: "events" },
          { href: "/merchandise", label: "merchandise" },
          { href: "/notifications", label: "notifications" },
          { href: "/dashboard", label: "dashboard" },
        ].map((item) => (
          <li key={item.label}>
            <Clickable as="a" iconOnly href={item.href} className="px-2! uppercase">
              {item.label}
            </Clickable>
          </li>
        ))}
      </ul>
    </nav>
  );
}
