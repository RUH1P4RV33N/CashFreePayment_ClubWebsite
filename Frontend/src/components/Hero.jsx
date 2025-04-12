import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import img1 from '../assets/img1.jpg'
import img2 from '../assets/img2.jpg'
import img3 from '../assets/img3.jpg'
import img4 from '../assets/img4.jpg'
import img5 from '../assets/img5.jpg'
import img6 from '../assets/img6.jpg'
import img7 from '../assets/img7.jpg'
import img8 from '../assets/img8.jpg'
import img9 from '../assets/img9.jpg'

function Hero({ onFinish }) {
  const imagesRefs = useRef([])
  const textRef = useRef(null)
  const startTextRef = useRef(null)
  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9]

  const positions = [
    { x: 50, y: 10 },
    { x: 600, y:80 },
    { x: 1200, y: 100 },
    { x: 300, y: 0 },
    { x: 900, y: 20 },
    { x: 100, y: 200 },
    { x: 900, y: 250 },
    { x: 700, y: 300 },
    { x: 400, y: 100 },
  ]
  

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onFinish) onFinish()
      }
    })

    // Step 1: Animate "Welcome to the Club"
    tl.fromTo(
      startTextRef.current.querySelectorAll('span'),
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 0.9,
        y: 0,
        stagger: 0.6,
        ease: 'power3.out',
        duration: 0.6,
      }
    )

    // Step 2: Animate images with positioning
    imagesRefs.current.forEach((el, index) => {
      const { x, y } = positions[index]
      gsap.set(el, { x, y }) // set initial position immediately

      tl.fromTo(
        el,
        {
          opacity: 0,
          scale: 0.5,
        },
        {
          opacity: 1,
          x,
          y,
          scale: 1,
          ease: 'power2.out',
          duration: 0.8,
        },
        `+=${index === 0 ? 0.5 : 0.3}` // spacing between images
      )
    })

    // Step 3: Animate "Joon's" text after last image
    tl.fromTo(
      textRef.current.querySelectorAll('span'),
      {
        opacity: 0,
        x: 0,
      },
      {
        opacity: 0.8,
        x: 50,
        stagger: 0.6,
        ease: 'power3.out',
        duration: 1,
      },
      '+=0.5'
    )
  }, [])

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      {/* Final "Joon's" Text */}
      <div
        ref={textRef}
        className="fixed inset-0 flex items-center justify-center text-6xl font-bold text-pink-600 drop-shadow-[0_0_25px_rgba(219,39,119,0.8)] z-10"
      >
        <span className="mx-2 text-[600px] font-script opacity-0">J</span>
        <span className="mx-2 text-[600px] font-script opacity-0">o</span>
        <span className="mx-2 text-[600px] font-script opacity-0">o</span>
        <span className="mx-2 text-[600px] font-script opacity-0">n</span>
        <span className="mx-2 text-[600px] font-script opacity-0">'</span>
        <span className="mx-2 text-[600px] font-script opacity-0">s</span>
      </div>

      {/* Starting "Welcome to the Club" Text */}
      <div
        ref={startTextRef}
        className="fixed inset-0 flex flex-col items-center justify-center text-6xl font-bold opacity-85 z-0 text-white"
      >
        <div className="flex">
          <span className="mx-2 font-serif text-[200px]">Welcome </span>
          <span className="mx-2 font-serif text-[200px]">to </span>
          <span className="mx-2 font-serif text-[200px]">the </span>
        </div>
        <div className="flex">
          <span className="mx-2 font-script text-[400px] text-pink-500 drop-shadow-[0_0_25px_rgb(219,39,119)]">Club</span>
        </div>
      </div>

      {/* Animated Images */}
      {images.map((src, ind) => (
        <img
          key={ind}
          ref={(el) => (imagesRefs.current[ind] = el)}
          src={src}
          alt={`image${ind}`}
          className="w-[400px] rounded-md absolute"
        />
      ))}
    </div>
  )
}

export default Hero
