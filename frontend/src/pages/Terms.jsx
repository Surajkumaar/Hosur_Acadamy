import React from 'react';
import { FileText, Scale, AlertTriangle, BookOpen } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section with Image */}
      <div className="relative bg-gradient-to-br from-[#0052CC] via-[#002357] to-[#0052CC] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FileText className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-blue-100">
              Our terms and conditions for using Hosur Academy's educational services.
            </p>
          </div>
        </div>
        
        {/* Decorative Image */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 opacity-10">
          <img 
            src="/sub.png" 
            alt="Hosur Academy Logo" 
            className="w-32 h-32 object-contain"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-[#0052CC] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Hosur Academy. These Terms of Service ("Terms") govern your use of our website and educational services. 
              By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of these 
              terms, then you may not access our services.
            </p>
          </div>

          {/* Acceptance of Terms */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center mb-4">
              <Scale className="w-6 h-6 text-[#0052CC] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                By creating an account, enrolling in courses, or using any of our services, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You must be at least 13 years old to use our services</li>
                <li>If you are under 18, you must have parental consent</li>
                <li>You agree to provide accurate and complete information</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
              </ul>
            </div>
          </div>

          {/* Educational Services */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Educational Services</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Course Enrollment</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Students must complete the enrollment process for each course</li>
                  <li>Course fees must be paid in full before accessing materials</li>
                  <li>Enrollment is subject to availability and academic requirements</li>
                  <li>Course schedules and content may be subject to change</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Academic Policies</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Regular attendance is mandatory for all enrolled courses</li>
                  <li>Students must maintain academic integrity and honesty</li>
                  <li>Plagiarism and cheating will result in disciplinary action</li>
                  <li>Course completion certificates require meeting all requirements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Terms Image Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Students and users are expected to conduct themselves in a respectful and professional manner. 
                  You agree to use our services only for lawful educational purposes.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Respect other students and faculty members</li>
                  <li>Do not disrupt classes or learning environments</li>
                  <li>Protect the confidentiality of course materials</li>
                  <li>Report any technical issues or concerns promptly</li>
                </ul>
              </div>
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-gradient-to-br from-[#39C93D]/10 to-[#0052CC]/10 rounded-lg flex items-center justify-center">
                  <img 
                    src="/sub.png" 
                    alt="Hosur Academy - Quality Education" 
                    className="w-32 h-32 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment and Refund Policy */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment and Refund Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Terms</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Course fees must be paid according to the agreed schedule</li>
                  <li>Late payment fees may apply for overdue accounts</li>
                  <li>All fees are in Indian Rupees (INR) unless otherwise specified</li>
                  <li>Payment methods include cash, bank transfer, and digital payments</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Refund Policy</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Refunds may be available within 7 days of enrollment</li>
                  <li>No refunds after course commencement without exceptional circumstances</li>
                  <li>Transfer to another course may be possible with prior approval</li>
                  <li>Processing fees may be deducted from refunds</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-800 text-sm">
                <strong>Important:</strong> Please read this section carefully as it limits our liability.
              </p>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Hosur Academy provides educational services on an "as is" basis. While we strive to provide quality education, 
                we cannot guarantee specific academic outcomes or career success.
              </p>
              <p>
                We are not liable for any indirect, incidental, special, or consequential damages arising from your use of our services. 
                Our total liability shall not exceed the amount paid by you for the specific service in question.
              </p>
            </div>
          </div>

          {/* Termination */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to terminate or suspend your account and access to our services immediately, 
              without prior notice, for conduct that we believe violates these Terms or is harmful to other users.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Violation of academic integrity policies</li>
              <li>Disruptive behavior affecting other students</li>
              <li>Non-payment of fees after due notice</li>
              <li>Providing false or misleading information</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
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
    </div>
  );
};

export default Terms;
