"use client";

import { useRef, useState, useEffect } from 'react';

export default function Banner() {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const banners = [
    'https://placehold.co/1000x300/ffedd5/ea580c?text=Khuyen+Mai+Mua+He',
    'https://placehold.co/1000x300/e0e7ff/4f46e5?text=Giam+Gia+Xe+May',
    'https://placehold.co/1000x300/dcfce7/16a34a?text=Nha+Dep+Gia+Re'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current && !isDragging) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        const isEnd = scrollLeft + clientWidth >= scrollWidth - 20;
        
        if (isEnd) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollTo({ left: scrollLeft + clientWidth, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const dragClasses = isDragging 
    ? 'cursor-grabbing' 
    : 'snap-x snap-mandatory scroll-smooth cursor-grab';

  return (
    <div className="w-full mb-6">
      <div 
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
        onMouseMove={handleMouseMove}
        className={`flex overflow-x-auto gap-4 pb-2 ${dragClasses}`} 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {banners.map((src, index) => (
          <div 
            key={index} 
            className="flex-none w-full snap-center relative rounded-lg overflow-hidden select-none"
          >
            <img 
              src={src} 
              alt={`Banner ${index + 1}`} 
              className="w-full h-[150px] md:h-[250px] object-cover rounded-lg pointer-events-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}