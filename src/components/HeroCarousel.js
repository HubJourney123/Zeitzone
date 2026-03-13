import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HeroCarousel({ slides = [] }) {
  const [current, setCurrent] = useState(0);

  // Default placeholder slides
  const defaultSlides = [
    {
      id: 1,
      image_url: null,
      title: 'Wear Your Royal Moment',
      subtitle: 'Premium Watches at Affordable Prices',
    },
    {
      id: 2,
      image_url: null,
      title: "Men's Collection",
      subtitle: 'Elegance Redefined',
    },
    {
      id: 3,
      image_url: null,
      title: "Lady's Collection",
      subtitle: 'Grace & Sophistication',
    },
  ];

  const items = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '125px' }}>
      {items.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          {slide.image_url ? (
            <img
              src={slide.image_url}
              alt={slide.title || 'ZEITZONE'}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Placeholder gradient slide */
            <div className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden ${
              i === 0 ? 'bg-gradient-to-r from-[#0a0a0a] via-emerald-950 to-[#0a0a0a]' :
              i === 1 ? 'bg-gradient-to-r from-emerald-950 via-[#0a0a0a] to-emerald-950' :
              'bg-gradient-to-r from-[#111] via-emerald-900/20 to-[#111]'
            }`}>
              {/* Decorative ring */}
              <div className="absolute w-32 h-32 rounded-full border border-emerald-700/30 -top-8 -left-8" />
              <div className="absolute w-20 h-20 rounded-full border border-emerald-700/20 -bottom-4 -right-4" />
              <p className="text-white font-serif text-lg font-semibold tracking-wide text-center px-4 z-10">
                {slide.title}
              </p>
              {slide.subtitle && (
                <p className="text-emerald-400 text-xs mt-1 tracking-widest uppercase text-center px-4 z-10">
                  {slide.subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Dots */}
      
    </div>
  );
}
