'use client';
// src/components/Header.tsx
import Link from 'next/link';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi'; 
import SearchModal from './SearchPanel';
import Image from "next/image";


export default function Header() {

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
     <>
    <header className="sticky top-0 z-40 bg-white shadow-md ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Section: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="block">
            <Image
              src="http://localhost:8000/wp-content/uploads/2025/09/logo-elena-bakes-dishes-to-learn.png"
              alt="Elena Bakes Logo"
              width={120}   // adjust to your logo size
              height={120}   // adjust to your logo size
              className="relative"
              priority
            />
          </Link>
        </div>


          {/* Middle Section: Navigation */}
          <nav className="hidden md:flex md:justify-center flex-grow">
            <div className="flex items-baseline space-x-8">
              <a href="/recipes" className="text-text-light hover:text-accent px-3 py-2 text-l font-medium transition-colors">
                All recipes
              </a>

              <Link href="/about" className="text-text-light hover:text-accent px-3 py-2 text-l font-medium transition-colors">
                About Us
              </Link>
              
              <a href="/contact-us" className="text-text-light hover:text-accent px-3 py-2 text-l font-medium transition-colors">
                Contact
              </a>
            </div>
          </nav>

          {/* Right Section: Search Icon */}
          <div className="hidden md:block">
            <button 
            onClick={openSearch}
            aria-label="Open search"
            className="p-2 rounded-full text-text-light hover:text-accent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
              <FiSearch className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <SearchModal isOpen={isSearchOpen} onClose={closeSearch} /></>
  );
}