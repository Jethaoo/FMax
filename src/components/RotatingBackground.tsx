"use client";

import { useState, useEffect } from "react";

const IMAGES = [
  "/cars/2025/alpine.png",
  "/cars/2025/astonmartin.png",
  "/cars/2025/ferrari.png",
  "/cars/2025/haas.png",
  "/cars/2025/mclaren.png",
  "/cars/2025/mercedes.png",
  "/cars/2025/rb.png",
  "/cars/2025/redbull.png",
  "/cars/2025/williams.png"
];

export default function RotatingBackground() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-transparent overflow-hidden rounded-xl">
      {IMAGES.map((src, index) => {
        let diff = index - currentIdx;
        const half = IMAGES.length / 2;
        
        let isWrapping = false;
        
        if (diff < -half) {
          diff += IMAGES.length;
          isWrapping = true;
        } else if (diff > half) {
          diff -= IMAGES.length;
          isWrapping = true;
        }

        const distance = -diff * 100;
        
        const transitionClass = isWrapping 
          ? "transition-none" 
          : "transition-transform duration-[4000ms] ease-[cubic-bezier(0.25,1,0.5,1)]";

        return (
          <div
            key={src}
            className={`absolute inset-0 bg-contain bg-center bg-no-repeat ${transitionClass}`}
            style={{ 
              backgroundImage: `url('${src}')`, 
              margin: '2rem',
              transform: `translateX(${distance}%)` 
            }}
          />
        );
      })}
    </div>
  );
}
