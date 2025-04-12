import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Button from './Button'

function Navbar({ show }) {
  const navRef = useRef(null)

  useEffect(() => {
    if (show) {
      gsap.to(navRef.current, {
        opacity: 1,  // Fade in to full opacity
        y: 0,
        duration: 1.5,
        ease: 'power2.out',
      })
    } else {
      gsap.to(navRef.current, {
        opacity: 0,  // Fade out to opacity 0
        y: -10,
      })
    }
  }, [show])  // Run effect when 'show' changes

  return (
    <nav
      ref={navRef}
      className="w-full flex items-center justify-between px-6 py-2 bg-pink-600 shadow-md fixed top-0 left-0 z-50"
      style={{ opacity: 0 }}  // Start with 0 opacity
    >
      {/* Logo or Brand */}
      <div className="text-2xl font-bold text-black">Joon's Club</div>

      {/* Navigation Links */}
      {/* <ul className="hidden md:flex gap-8 font-medium text-gray-300"> */}
        <Button/>
        {/* <li className="hover:text-black cursor-pointer">Home</li>
        <li className="hover:text-black cursor-pointer">About</li>
        <li className="hover:text-black cursor-pointer">Events</li>
        <li className="hover:text-black cursor-pointer">Contact</li> */}
      {/* </ul> */}

      {/* Mobile Menu Button */}
      <div className="md:hidden text-3xl text-gray-700 cursor-pointer">☰</div>
    </nav>
  )
}

export default Navbar
