import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const Button = ({
  onClick,
  Content,
  Radius,
  Border,
  bgColor,
  textColor,
  hoverTextColor,
  hoverBgColor, // <- NEW
  Padding,
}) => {
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

      gsap.to(flair, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(label, {
        color: hoverTextColor || "#D81B60",
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

      gsap.to(label, {
        color: textColor || "black",
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
  }, [hoverTextColor, textColor]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="relative overflow-hidden"
      data-block="button"
      style={{
        borderRadius: Radius,
        border: Border || "none",
        backgroundColor: bgColor,
        padding: Padding,
      }}
    >
      <span
        className="button__label relative text-base z-10"
        style={{ color: textColor }}
      >
        {Content}
      </span>
      <span
        className="button__flair absolute inset-0 z-0"
        ref={flairRef}
        style={{
          backgroundColor: hoverBgColor || "rgba(0, 0, 0, 0.15)",
          borderRadius: Radius,
          transform: "scale(0)", // ensure it starts hidden
        }}
      >
        <span className="absolute top-0 left-0" />
      </span>
    </button>
  );
};

export default Button;
