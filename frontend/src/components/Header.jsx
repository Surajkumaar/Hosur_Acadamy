import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, X, Phone, MessageCircle, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { mockData } from './mock/mockData';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Toppers', path: '/toppers' },
    { name: 'Results', path: '/results' },
    { name: 'Inquiry', path: '/inquiry' },
    { name: 'Login', path: '/login' },
  ];

  const handleCall = () => {
    window.open(`tel:${mockData.institute.phone}`, '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello! I'm interested in learning more about your courses.");
    window.open(`https://wa.me/${mockData.institute.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const handleEnrollClick = () => {
    // Save enrollment intent to localStorage for backend integration
    localStorage.setItem('enrollmentIntent', JSON.stringify({
      timestamp: new Date().toISOString(),
      source: 'header_cta'
    }));
    // Navigate to inquiry form
    window.location.href = '/inquiry';
  };

  const handleLoginClick = () => {
    setIsMenuOpen(false); // Close mobile menu if open
  };

  return (
    <>
      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-md transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo and Brand with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#0052CC] to-[#39C93D] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#002357]">{mockData.institute.name}</h1>
                  <p className="text-sm text-gray-600">{mockData.institute.tagline}</p>
                </div>
                <ChevronDown className={`h-5 w-5 text-[#0052CC] transition-transform duration-200 ${isMenuOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div 
                  className="absolute top-full left-0 w-72 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  onMouseLeave={() => setIsMenuOpen(false)}
                >
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-2">
                      {navigation.slice(0, 6).map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center p-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
                            location.pathname === item.path
                              ? 'bg-gradient-to-r from-[#0052CC] to-[#006eff] text-white shadow-md'
                              : 'text-gray-800 hover:bg-gray-50 hover:text-[#0052CC] transform hover:scale-105'
                          }`}
                        >
                          {/* You can add icons here if you have them */}
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                    <hr className="my-2 border-gray-200" />
                    <div className="space-y-1">
                      {navigation.slice(6).map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => item.name === 'Login' ? handleLoginClick() : setIsMenuOpen(false)}
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            location.pathname === item.path
                              ? 'bg-[#0052CC] text-white'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {/* You can add icons here if you have them */}
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div 
                    className="fixed inset-0 -z-10" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleCall}
                variant="outline" 
                className="border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
              <Button 
                onClick={handleEnrollClick}
                className="bg-[#39C93D] hover:bg-[#2db832] text-white transition-colors"
              >
                Enroll Now
              </Button>
              <Link to="/login">
                <Button 
                  variant="outline"
                  className="border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#20c058] transition-colors animate-pulse"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </button>
    </>
  );
};

export default Header;