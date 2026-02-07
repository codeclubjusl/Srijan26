"use client";

import { createContext, type ReactNode, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/navbar/MobileMenu";

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
  const pathname = usePathname();

  const toggle = () => setIsOpen((prev) => !prev);
  
  useEffect(() => {
     setIsOpen(false);
  }, [pathname]);

  return (
    <MobileNavContext.Provider value={{ isOpen, toggle }}>
      {children}
      <MobileMenu />
    </MobileNavContext.Provider>
  );
};
