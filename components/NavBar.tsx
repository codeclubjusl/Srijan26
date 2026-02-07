"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMobileNavContext } from "@/hooks/useMobileNav";
import { NavLink } from "@/components/navbar/NavLink";
import { LoginButton } from "@/components/navbar/LoginButton";
import { HamburgerButton } from "@/components/navbar/HamburgerButton";
import { NAV_LINKS } from "@/components/navbar/constants";

export default function NavBar() {
  const { isOpen: _, toggle } = useMobileNavContext();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  return (
    <nav className="full-bleed flex justify-between items-center py-4 px-4 h-fit sticky top-0 z-40 bg-background/10 backdrop-blur-md">
      {/* Logo */}
      <div className="flex gap-6">
        <Image
          src="/images/srijan-thumbnail.svg"
          alt="A square shaped logo for Srijan'26"
          width={45}
          height={45}
        />
        <Image
          src="/images/srijan-wide-icon.svg"
          alt="A wide layout logo for Srijan'26"
          height={45}
          width={2.298 * 45}
        />
      </div>

      {/* Desktop Links */}
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          isActive={activeTab === link.href}
          onClick={() => setActiveTab(link.href)}
          className="hidden 2xl:flex"
        />
      ))}
      <LoginButton 
        className="hidden 2xl:flex" 
        isActive={activeTab === '/login'} 
        onClick={() => setActiveTab('/login')}
      />

      {/* Mobile/Tablet Menu */}
      <div className="flex gap-6 2xl:hidden">
         {/* Tablet Login Button */}
        <LoginButton 
          className="hidden md:flex" 
          isActive={activeTab === '/login'}
          onClick={() => setActiveTab('/login')}
        />

        {/* Hamburger Button */}
        <HamburgerButton onClick={toggle} />
      </div>
    </nav>
  );
}
