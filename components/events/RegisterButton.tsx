"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CircleCheckBig, CircleOff } from "lucide-react";
import { CLIP_PATH } from "./constants/events";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getEventRegistrationStatus, isUserRegistered } from "@/services/EventsService";

interface RegisterButtonProps {
  status?: string;
  link: string;
  isCard?: boolean;
  slug: string;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ link, isCard, slug }) => {
  const { data: session } = useSession();
  const [registered, setRegistered] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const router = useRouter();
  const desktopClipStyle = { "--desktop-clip": CLIP_PATH } as React.CSSProperties;
  const isExternal = link.startsWith("http");

  useEffect(() => {
    getEventRegistrationStatus(slug)
    .then(isOpen => setRegistrationOpen(isOpen))
  },[slug]);

  useEffect(() => {
    isUserRegistered(session?.user.id ?? "", slug)
    .then(isUserRegistered => {
      if(!isUserRegistered) setRegistered(false);
      else setRegistered(true);
    })
  },[session?.user.id, slug])

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!session && !isExternal) {
      e.preventDefault();
      router.push(`/login?redirect=${encodeURIComponent(link)}`);
    }
  };

  if (!registrationOpen && !registered) {
      return (
              <button type="button" disabled
                  style={desktopClipStyle}
                  className={`bg-gray-800 text-gray-500 font-euclid uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2
                ${ isCard ? "py-2 w-full text-xs font-bold [clip-path:var(--desktop-clip)]"
                  : "flex-1 sm:flex-none px-6 py-2 md:pl-10 md:pr-16 md:py-2 lg:text-sm text-xs rounded-full md:rounded-none md:[clip-path:var(--desktop-clip)]"}`}>
                  Closed <CircleOff size={isCard ? 16 : 18} />
              </button>
      );
  }

  return (
    <Link
      href={link}
      prefetch={false}
      onClick={handleRegisterClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      style={desktopClipStyle}
      className={`text-white font-euclid uppercase font-bold tracking-wider transition-all duration-150 flex items-center justify-center gap-2 bg-red hover:bg-red-700 active:bg-red-800
        ${isCard
          ? "py-2 w-full text-xs [clip-path:var(--desktop-clip)]"
          : "sm:flex-none px-6 py-2 md:pl-10 md:pr-16 md:py-2 lg:text-sm text-xs rounded-full md:rounded-none md:[clip-path:var(--desktop-clip)]"
        }`}
    >
      Register <CircleCheckBig size={isCard ? 16 : 18} strokeWidth={2.5} />
    </Link>
  );
};

export default RegisterButton;