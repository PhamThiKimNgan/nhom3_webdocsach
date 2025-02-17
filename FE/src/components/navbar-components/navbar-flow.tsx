// components/Navbar.js

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import ButtonWithoutBorder from '../button-components/button-without-border';


const NavbarFlow = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
         <Image src="/vercel.svg" alt="Vercel Logo" className="dark:invert" width={100} height={24} priority/>
          {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Your Brand</span> */}
        </Link>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <ButtonWithoutBorder content="Sign In" />
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isOpen}  //updated to reflect state
            onClick={toggleNavbar} // Added onClick handler
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />

            </svg>
          </button>
        </div>


        <div  className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? '' : 'hidden'}`} id="navbar-sticky"> {/*added conditional classname based on isOpen state for mobile responsiveness*/}
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <NavItem href="/" text="Home" /> {/*NavItem component makes code more readable and maintainable*/}
          <NavItem href="/about" text="About" />
          <NavItem href="/services" text="Services" />
          <NavItem href="/contact" text="Contact" />
          </ul>
        </div>
      </div>
    </nav>
  );
};


//NavItem component to avoid repetition
const NavItem = ({ href, text }:{ href:string, text:string }) => {
    return (
    <li>
        <Link href={href} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
          {text}
        </Link>
      </li>
    )
}

export  {NavbarFlow};