import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
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
    { name: 'Inquiry', path: '/inquiry' },
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

  return (
    <>
      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-md transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-6 w-6 text-[#0052CC]" />
              </button>
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0052CC] to-[#39C93D] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#002357]">{mockData.institute.name}</h1>
                  <p className="text-sm text-gray-600">{mockData.institute.tagline}</p>
                </div>
              </Link>
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
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center space-x-3" onClick={() => setIsMenuOpen(false)}>
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0052CC] to-[#39C93D] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">H</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-[#002357]">{mockData.institute.name}</h1>
                    <p className="text-sm text-gray-600">{mockData.institute.tagline}</p>
                  </div>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-[#0052CC] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              <div className="mt-8 space-y-3">
                <Button 
                  onClick={handleCall}
                  variant="outline" 
                  className="w-full border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                <Button 
                  onClick={handleEnrollClick}
                  className="w-full bg-[#39C93D] hover:bg-[#2db832] text-white transition-colors"
                >
                  Enroll Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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