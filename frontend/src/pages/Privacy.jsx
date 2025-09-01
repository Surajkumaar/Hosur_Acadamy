import React, { useEffect } from 'react';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';
import { initScrollEffects, scrollToTop } from '../utils/scrollEffects';
import BackToTop from '../components/BackToTop';

const Privacy = () => {
  // Initialize scroll effects for this page
  useEffect(() => {
    // Scroll to top when component mounts
    scrollToTop(0);
    // Initialize scroll effects
    initScrollEffects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section with Image */}
      <div className="relative bg-gradient-to-br from-[#0052CC] via-[#002357] to-[#0052CC] text-white py-20 fade-in-on-scroll">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm float-animation">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 slide-up-on-scroll">Privacy Policy</h1>
            <p className="text-xl text-blue-100 slide-up-on-scroll">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
          </div>
        </div>
        
        {/* Decorative Image */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-10">
          <img 
            src="/sub.png" 
            alt="Hosur Academy Logo" 
            className="w-32 h-32 object-contain"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto stagger-children">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 card-hover slide-up-on-scroll" style={{ '--child-index': 0 }}>
            <div className="flex items-center mb-4">
              <UserCheck className="w-6 h-6 text-[#0052CC] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              At Hosur Academy, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              or use our educational services.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 card-hover slide-up-on-scroll" style={{ '--child-index': 1 }}>
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-[#0052CC] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name, email address, and phone number</li>
                  <li>Date of birth for student authentication</li>
                  <li>Academic information including roll numbers and course details</li>
                  <li>Educational background and academic performance</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Technical Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>IP address and browser information</li>
                  <li>Device information and operating system</li>
                  <li>Usage data and website interaction patterns</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 card-hover slide-up-on-scroll" style={{ '--child-index': 2 }}>
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-[#0052CC] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>To provide and maintain our educational services</li>
              <li>To authenticate students and manage user accounts</li>
              <li>To communicate important updates and announcements</li>
              <li>To track academic progress and generate reports</li>
              <li>To improve our services and user experience</li>
              <li>To comply with legal obligations and institutional requirements</li>
            </ul>
          </div>

          {/* Privacy Image Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 card-hover slide-up-on-scroll" style={{ '--child-index': 3 }}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Your data is encrypted during transmission and stored securely using industry-standard practices. 
                  We regularly review and update our security measures to ensure the highest level of protection.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-gradient-to-br from-[#0052CC]/10 to-[#39C93D]/10 rounded-lg flex items-center justify-center hover-lift">
                  <img 
                    src="/sub.png" 
                    alt="Hosur Academy - Secure Education" 
                    className="w-32 h-32 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-8 card-hover slide-up-on-scroll" style={{ '--child-index': 4 }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> hosurtoppersacademy@gmail.com</p>
              <p><strong>Phone:</strong> +91 9845123456</p>
              <p><strong>Address:</strong> Hosur, Tamil Nadu, India</p>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Last updated: August 28, 2025
            </p>
          </div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default Privacy;