"use client";
import { usePathname } from "next/navigation";
import{ NavbarFlow } from "./navbar-flow";

function NavbarWrapper() {
    const pathname = usePathname();
    const hideNavbar =
      pathname.startsWith("/auth/sign-in") || pathname.startsWith("/auth/sign-up");
  
    return !hideNavbar ? <NavbarFlow /> : null;
  }

  export { NavbarWrapper };