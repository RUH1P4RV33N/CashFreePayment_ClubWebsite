import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const Button = () => {
  const buttonRef = useRef(null);
  const flairRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const flair = flairRef.current;
    const label = button.querySelector(".button__label");
  
    const xSet = gsap.quickSetter(flair, "xPercent");
    const ySet = gsap.quickSetter(flair, "yPercent");
  
    const getXY = (e) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const xTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, width, 0, 100),
        gsap.utils.clamp(0, 100)
      );
      const yTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, height, 0, 100),
        gsap.utils.clamp(0, 100)
      );
      return {
        x: xTransformer(e.clientX - left),
        y: yTransformer(e.clientY - top),
      };
    };
  
    const handleEnter = (e) => {
      const { x, y } = getXY(e);
      xSet(x);
      ySet(y);
  
      // Animate flair in
      gsap.to(flair, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
  
      // Animate text color
      gsap.to(label, {
        color: "#D81B60", // whatever color you want when hovered
        duration: 0.4,
        ease: "power2.out",
      });
    };
  
    const handleLeave = (e) => {
      const { x, y } = getXY(e);
      gsap.killTweensOf(flair);
  
      gsap.to(flair, {
        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
      });
  
      // Animate text color back
      gsap.to(label, {
        color: "black", // original color
        duration: 0.3,
        ease: "power2.out",
      });
    };
  
    const handleMove = (e) => {
      const { x, y } = getXY(e);
      gsap.to(flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: "power2",
      });
    };
  
    button.addEventListener("mouseenter", handleEnter);
    button.addEventListener("mouseleave", handleLeave);
    button.addEventListener("mousemove", handleMove);
  
    return () => {
      button.removeEventListener("mouseenter", handleEnter);
      button.removeEventListener("mouseleave", handleLeave);
      button.removeEventListener("mousemove", handleMove);
    };
  }, []);
  

  return (
    <button
  ref={buttonRef}
  className="button button--stroke relative overflow-hidden"
  data-block="button"
>
  <span className="button__label relative text-base z-10">Book Show</span>
  <span
    className="button__flair absolute inset-0 z-0"
    ref={flairRef}
  >
    <span className="absolute top-0 left-0" />
  </span>
</button>

  );
};

export default Button;
