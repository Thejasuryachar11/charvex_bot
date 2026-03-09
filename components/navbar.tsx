"use client"

import Image from "next/image"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="https://www.charvexglobal.com/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Charvex Logo"
            width={40}
            height={40}
          />
          <span className="text-2xl font-bold text-[#FF6B00]">
            Charvex Global
          </span>
        </a>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <a href="https://www.charvexglobal.com/" className="hover:text-[#FF6B00] transition">Home</a>
          <a href="https://www.charvexglobal.com/about" className="hover:text-[#FF6B00] transition">About</a>
          <a href="https://www.charvexglobal.com/services" className="hover:text-[#FF6B00] transition">Services</a>
          <a href="https://www.charvexglobal.com/projects" className="hover:text-[#FF6B00] transition">Projects</a>
          <a href="https://www.charvexglobal.com/careers" className="hover:text-[#FF6B00] transition">Careers</a>
          <a href="https://www.charvexglobal.com/contact" className="hover:text-[#FF6B00] transition">Contact</a>
        </div>

      </div>
    </nav>
  )
}