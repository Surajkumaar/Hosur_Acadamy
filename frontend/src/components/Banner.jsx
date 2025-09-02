import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { scrollToElement } from '../utils/scrollEffects';

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    duration: 30, // Slower transitions for smoother effect
    dragFree: false,
    skipSnaps: false
  });

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleEnrollClick = async (e) => {
    e.preventDefault();
    try {
      await scrollToElement('inquiry-form', { 
        offset: 100,
        duration: 1000 
      });
      localStorage.setItem('enrollmentIntent', JSON.stringify({
        timestamp: new Date().toISOString(),
        source: 'banner_cta'
      }));
    } catch (error) {
      console.warn('Scroll to inquiry form failed:', error);
    }
  };

  // Auto-play functionality with improved timing
  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      setCurrent(emblaApi.selectedScrollSnap());
    });

    // Smoother auto-play with longer intervals
    const autoplay = setInterval(scrollNext, 8000); // Increased to 8 seconds

    // Cleanup function
    return () => {
      clearInterval(autoplay);
      emblaApi.off('select');
    };
  }, [emblaApi, scrollNext]);

  const banners = [
  {
    id: 1,
    imageUrl: "/classroom1.jpg",
    title: "Now Launching: JEE & NEET Programs!",
    description: "Building on 23 years of foundation excellence, we now offer specialized coaching for top engineering and medical entrance exams.",
    buttonText: "Explore Now",
    buttonLink: "/courses"
  },
  {
    id: 2,
    imageUrl: "/classroom2.jpg",
    title: "Celebrating Our Students' Success!",
    description: "With a 100% success rate and top scores, see how our students achieve their dreams. Your success story could be next.",
    buttonText: "View Our Achievers",
    buttonLink: "/toppers"
  },
  {
    id: 3,
    imageUrl: "/classroom3.jpg",
    title: "Admissions Open for 2025-26",
    description: "Your journey to success starts here. Join our proven foundation and new competitive exam courses today. Seats are filling fast!",
    buttonText: "Enroll Now",
    buttonLink: "/contact"
  }
];

  return (
    <div className="w-full mb-8 relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div className="flex-[0_0_100%]" key={banner.id}>
              <div className="relative h-[400px] overflow-hidden">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#002357]/90 to-[#0052CC]/75"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-6 max-w-4xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
                      {banner.title}
                    </h2>
                    <p className="text-xl md:text-2xl mb-8 animate-slideUp">
                      {banner.description}
                    </p>
                    {banner.buttonText === "Enroll Now" ? (
                      <button
                        onClick={handleEnrollClick}
                        className="inline-block bg-[#39C93D] hover:bg-[#2db832] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 animate-scaleIn"
                      >
                        {banner.buttonText}
                      </button>
                    ) : (
                      <a
                        href={banner.buttonLink}
                        className="inline-block bg-[#39C93D] hover:bg-[#2db832] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 animate-scaleIn"
                      >
                        {banner.buttonText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 transition-all p-2 rounded-full"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 transition-all p-2 rounded-full"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
        {banners.map((_, index) => (
          <div
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`rounded-full transition-all cursor-pointer ${
              current === index 
                ? 'bg-white' 
                : 'bg-white/50'
            }`}
            style={{
              width: current === index ? '8px' : '4px',
              height: '4px'
            }}
            role="button"
            tabIndex={0}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
