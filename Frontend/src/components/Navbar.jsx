import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Button from './Button'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navRef = useRef(null);
  const navigate=useNavigate();

  const handleClick=()=>{
    navigate('/payment');
  }
  useEffect(() => {
   
      gsap.to(navRef.current, {
        opacity: 1,  // Fade in to full opacity
        y: 0,
        duration: 1.5,
        ease: 'power2.out',
      })
    
  })  // Run effect when 'show' changes

  return (
    <nav
      ref={navRef}
      className="w-full flex items-center justify-between px-6 py-2 bg-pink-600 shadow-md fixed top-0 left-0 z-50"
      style={{ opacity: 0 }}  // Start with 0 opacity
    >
      {/* Logo or Brand */}
      <div className="text-2xl font-bold text-black">Joon's Club</div>

     
      <Button
        onClick={handleClick}
        Content="Book Now"
        Radius="25px"
        Border="2px solid black"
        bgColor="#db2777"
        textColor="#000"
        hoverTextColor="#e91e63"
        hoverBgColor="rgba(233, 30, 99, 0.2)" // light pink hover flair
        Padding="10px 15px"
      />
        
      <div className="md:hidden text-3xl text-gray-700 cursor-pointer">☰</div>
    </nav>
  )
}

export default Navbar
