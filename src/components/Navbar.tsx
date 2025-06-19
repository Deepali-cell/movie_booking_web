"use client";
import { assets } from "@/assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { TicketPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Homes", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Theaters", path: "/" },
    { name: "Releases", path: "/" },
    { name: "Favourites", path: "/favourites" },
  ];

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useRouter();
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between text-white bg-transparent">
      {/* Left - Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image src={assets.logo} alt="Logo" width={80} height={80} />
        </Link>
      </div>

      {/* Center - Nav Items (Desktop) */}
      <ul className="hidden md:flex gap-10 font-medium border border-white rounded-full px-6 py-2 text-white">
        {navItems.map(({ name, path }) => (
          <li
            key={name}
            className="relative cursor-pointer pb-1 border-b-2 border-transparent hover:border-white transition-all duration-300"
          >
            <Link href={path}>{name}</Link>
          </li>
        ))}
      </ul>

      {/* Right - Search + Login (Desktop) */}
      <div className="hidden md:flex items-center gap-4">
        <FaSearch className="text-white cursor-pointer text-lg" />
        {!user ? (
          <button
            onClick={() => openSignIn()}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full transition-all duration-300 shadow-md"
          >
            Login
          </button>
        ) : (
          <>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  labelIcon={<TicketPlus width={15} />}
                  onClick={() => navigate.push("myBookings")}
                ></UserButton.Action>
              </UserButton.MenuItems>
            </UserButton>
          </>
        )}
      </div>

      {/* Hamburger (Mobile) */}
      <div className="md:hidden z-50">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-black bg-opacity-90 py-6 flex flex-col items-center space-y-6 text-white md:hidden">
          {navItems.map(({ name, path }) => (
            <Link
              key={name}
              href={path}
              className="text-lg hover:text-red-400"
              onClick={() => setMenuOpen(false)} // close menu on click
            >
              {name}
            </Link>
          ))}
          <div className="flex justify-between w-full px-6">
            <FaSearch className="cursor-pointer text-lg" />
            {!user ? (
              <button
                onClick={() => openSignIn()}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full transition-all duration-300 shadow-md"
              >
                Login
              </button>
            ) : (
              <>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="My Bookings"
                      labelIcon={<TicketPlus width={15} />}
                      onClick={() => navigate.push("/myBookings")}
                    ></UserButton.Action>
                  </UserButton.MenuItems>
                </UserButton>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
