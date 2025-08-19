import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { mockData } from './mock/mockData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Toppers', path: '/toppers' },
    { name: 'Contact', path: '/inquiry' },
  ];

  const courses = [
    'Foundation Mathematics',
    'JEE Main & Advanced',
    'NEET Preparation',
    'Board Exam Preparation',
  ];

  const handleCall = () => {
    window.open(`tel:${mockData.institute.phone}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:${mockData.institute.email}`, '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello! I'm interested in learning more about your courses.");
    window.open(`https://wa.me/${mockData.institute.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-[#002357] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-white p-1">
                <img 
                  src="/sub.png" 
                  alt={mockData.institute.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">{mockData.institute.name}</h3>
                <p className="text-gray-300 text-sm">{mockData.institute.tagline}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering students with quality education and comprehensive support to achieve their academic goals and build successful careers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-[#0052CC] rounded-full flex items-center justify-center hover:bg-[#0041a3] transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-[#0052CC] rounded-full flex items-center justify-center hover:bg-[#0041a3] transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-[#0052CC] rounded-full flex items-center justify-center hover:bg-[#0041a3] transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#39C93D]">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-[#39C93D] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#39C93D]">Our Courses</h3>
            <ul className="space-y-2">
              {courses.map((course) => (
                <li key={course}>
                  <Link
                    to="/courses"
                    className="text-gray-300 hover:text-[#39C93D] transition-colors text-sm"
                  >
                    {course}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#39C93D]">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#39C93D] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{mockData.institute.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#39C93D] flex-shrink-0" />
                <button
                  onClick={handleCall}
                  className="text-gray-300 hover:text-[#39C93D] transition-colors text-sm"
                >
                  {mockData.institute.phone}
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#39C93D] flex-shrink-0" />
                <button
                  onClick={handleEmail}
                  className="text-gray-300 hover:text-[#39C93D] transition-colors text-sm"
                >
                  {mockData.institute.email}
                </button>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-[#39C93D] mb-2">Instution Timing </h4>
              <p className="text-gray-300 text-sm">Monday - Saturday: 6:00 pm - 9:00 PM</p>
              <p className="text-gray-300 text-sm">Sunday: 10:00 AM - 1:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-8">
              <p className="text-gray-300 text-sm">
                © {currentYear} {mockData.institute.name}. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <Link to="/privacy" className="text-gray-300 hover:text-[#39C93D] transition-colors text-sm">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-300 hover:text-[#39C93D] transition-colors text-sm">
                  Terms of Service
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">Follow us:</span>
              <button
                onClick={handleWhatsApp}
                className="bg-[#25D366] hover:bg-[#20c058] px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
              >
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;