import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, MessageCircle, LogIn, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { mockData } from './mock/mockData';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();

  // Use Firebase authentication only
  const isAuthenticated = currentUser;
  const userRole = userProfile?.role;

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
    // Add conditional navigation items based on authentication
    ...(userRole === 'admin' ? [{ name: 'Admin', path: '/admin' }] : []),
    ...(userRole === 'student' ? [{ name: 'Dashboard', path: '/student-dashboard' }] : []),
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      window.location.href = '/#inquiry-form';
    } else {
      // If on home page, scroll to inquiry form
      const inquirySection = document.getElementById('inquiry-form');
      if (inquirySection) {
        inquirySection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-md transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 md:py-3">
            {/* Logo and Brand with Dropdown */}
            <div className="relative flex-1 min-w-0">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors w-full max-w-xs"
              >
                <div className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img 
                    src="/sub.png" 
                    alt={mockData.institute.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xs md:text-lg font-bold text-[#002357] leading-tight">{mockData.institute.name}</h1>
                  <p className="text-xs text-gray-600 truncate">{mockData.institute.tagline}</p>
                </div>
                <ChevronDown className={`h-3 w-3 md:h-4 md:w-4 text-[#0052CC] transition-transform duration-200 flex-shrink-0 ${isMenuOpen ? 'transform rotate-180' : ''}`} />
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
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                    <hr className="my-2 border-gray-200" />
                    {navigation.length > 6 && (
                      <div className="space-y-1">
                        {navigation.slice(6).map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              location.pathname === item.path
                                ? 'bg-[#0052CC] text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <div 
                    className="fixed inset-0 -z-10" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
              <Button 
                onClick={handleEnrollClick}
                size="sm"
                className="bg-[#39C93D] hover:bg-[#2db832] text-white transition-colors px-2 md:px-3 py-1"
              >
                <span className="text-xs">Enroll</span>
              </Button>
              {isAuthenticated ? (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-600 hidden lg:block max-w-16 truncate">
                    {userProfile?.email || currentUser?.email || 'User'}
                  </span>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors px-2 md:px-3 py-1"
                  >
                    <LogOut className="h-3 w-3" />
                    <span className="hidden md:inline ml-1 text-xs">Logout</span>
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white transition-colors px-2 md:px-3 py-1"
                  >
                    <LogIn className="h-3 w-3" />
                    <span className="hidden md:inline ml-1 text-xs">Login</span>
                  </Button>
                </Link>
              )}
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