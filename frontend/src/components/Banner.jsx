import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    duration: 20
  });

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto-play functionality with proper cleanup
  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      setCurrent(emblaApi.selectedScrollSnap());
    });

    const autoplay = setInterval(scrollNext, 5000);

    // Cleanup function
    return () => {
      clearInterval(autoplay);
      emblaApi.off('select');
    };
  }, [emblaApi, scrollNext]);

  const banners = [
    {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=1200&h=400&fit=crop",
      title: "Early Bird Registration Open!",
      description: "Get 20% off on all JEE and NEET courses. Limited time offer.",
      buttonText: "Register Now",
      buttonLink: "/courses"
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&h=400&fit=crop",
      title: "New Batch Starting Soon",
      description: "Join our comprehensive JEE/NEET preparation program. Expert faculty, proven results.",
      buttonText: "Learn More",
      buttonLink: "/courses"
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=400&fit=crop",
      title: "Scholarship Test Announcement",
      description: "Take our scholarship test and get up to 100% fee waiver. Create your success story with us.",
      buttonText: "Apply Now",
      buttonLink: "/scholarship"
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
                    <a
                      href={banner.buttonLink}
                      className="inline-block bg-[#39C93D] hover:bg-[#2db832] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 animate-scaleIn"
                    >
                      {banner.buttonText}
                    </a>
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
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              current === index ? 'bg-white w-4' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
