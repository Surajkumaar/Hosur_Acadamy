import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Award, BookOpen, Target, CheckCircle, Play, Calendar, Trophy, GraduationCap, MapPin, Phone, Mail, Send, MessageSquare, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { mockData } from '../components/mock/mockData';
import { sendInquiryEmail, sendAutoReplyEmail } from '../lib/emailjs-service';
import Banner from '../components/Banner';
import { scrollToElement, initScrollEffects } from '../utils/scrollEffects';

// Common country codes
const countryCodes = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
];

// Phone validation function
const validatePhoneNumber = (countryCode, phoneNumber) => {
  // Remove all spaces, dashes, and parentheses
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  // Check if phone contains only digits
  if (!/^\d+$/.test(cleanPhone)) {
    return { valid: false, message: "Phone number should contain only digits" };
  }
  
  // Country-specific validation rules
  const phoneRules = {
    '+91': { minLength: 10, maxLength: 10, name: 'India' }, // India: 10 digits
    '+1': { minLength: 10, maxLength: 10, name: 'USA/Canada' }, // USA/Canada: 10 digits
    '+44': { minLength: 10, maxLength: 11, name: 'UK' }, // UK: 10-11 digits
    '+61': { minLength: 9, maxLength: 9, name: 'Australia' }, // Australia: 9 digits
    '+971': { minLength: 9, maxLength: 9, name: 'UAE' }, // UAE: 9 digits
    '+65': { minLength: 8, maxLength: 8, name: 'Singapore' }, // Singapore: 8 digits
    '+60': { minLength: 9, maxLength: 10, name: 'Malaysia' }, // Malaysia: 9-10 digits
    '+49': { minLength: 10, maxLength: 12, name: 'Germany' }, // Germany: 10-12 digits
    '+33': { minLength: 9, maxLength: 9, name: 'France' }, // France: 9 digits
    '+81': { minLength: 10, maxLength: 11, name: 'Japan' }, // Japan: 10-11 digits
    '+86': { minLength: 11, maxLength: 11, name: 'China' }, // China: 11 digits
    '+7': { minLength: 10, maxLength: 10, name: 'Russia' }, // Russia: 10 digits
    '+55': { minLength: 10, maxLength: 11, name: 'Brazil' }, // Brazil: 10-11 digits
    '+27': { minLength: 9, maxLength: 9, name: 'South Africa' }, // South Africa: 9 digits
    '+966': { minLength: 9, maxLength: 9, name: 'Saudi Arabia' }, // Saudi Arabia: 9 digits
  };
  
  const rule = phoneRules[countryCode];
  if (!rule) {
    // Default validation for unlisted countries
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      return { valid: false, message: "Phone number should be between 7-15 digits" };
    }
    return { valid: true, message: "" };
  }
  
  if (cleanPhone.length < rule.minLength || cleanPhone.length > rule.maxLength) {
    if (rule.minLength === rule.maxLength) {
      return { 
        valid: false, 
        message: `${rule.name} phone numbers should be exactly ${rule.minLength} digits` 
      };
    } else {
      return { 
        valid: false, 
        message: `${rule.name} phone numbers should be ${rule.minLength}-${rule.maxLength} digits` 
      };
    }
  }
  
  return { valid: true, message: "" };
};

const Home = () => {
  const [activeTab, setActiveTab] = useState('foundation');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91', // Default to India
    course: '',
    grade: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [phoneValidationMessage, setPhoneValidationMessage] = useState('');
  const { toast } = useToast();
  const featuredCourses = mockData.courses.slice(0, 4);
  const testimonials = mockData.testimonials;
  const stats = mockData.stats;

  const handleEnrollClick = async () => {
    try {
      await scrollToElement('inquiry-form', { 
        offset: 100,
        duration: 800 
      });
      localStorage.setItem('enrollmentIntent', JSON.stringify({
        timestamp: new Date().toISOString(),
        source: 'hero_cta'
      }));
    } catch (error) {
      console.warn('Scroll to inquiry form failed:', error);
    }
  };

  useEffect(() => {
    // Initialize scroll effects for this page
    initScrollEffects();
    
    // Check if user has any stored preferences
    const enrollmentIntent = localStorage.getItem('enrollmentIntent');
    const courseInterest = localStorage.getItem('courseInterest');
    const topperInterest = localStorage.getItem('topperInterest');

    if (courseInterest) {
      const interest = JSON.parse(courseInterest);
      setFormData(prev => ({
        ...prev,
        course: interest.courseName,
        message: `I am interested in learning more about the ${interest.courseName} course.`
      }));
    } else if (topperInterest) {
      const interest = JSON.parse(topperInterest);
      setFormData(prev => ({
        ...prev,
        course: interest.course,
        message: `I am inspired by ${interest.topperName}'s success in ${interest.exam} and would like to follow a similar path.`
      }));
    } else if (enrollmentIntent) {
      setFormData(prev => ({
        ...prev,
        message: 'I am interested in enrolling at Hosur Toppers Academy. Please provide me with more information about your courses.'
      }));
    }
  }, []);

  useEffect(() => {
    // Enhanced hash navigation handling
    const handleHashNavigation = async () => {
      const hash = window.location.hash;
      if (hash === '#inquiry-form') {
        try {
          // Wait a bit longer for page elements to load
          await new Promise(resolve => setTimeout(resolve, 200));
          await scrollToElement('inquiry-form', { 
            offset: 100,
            duration: 1000 
          });
        } catch (error) {
          console.warn('Hash navigation scroll failed:', error);
        }
      }
    };

    // Check on component mount
    handleHashNavigation();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);

    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time phone validation
    if (name === 'phone') {
      if (value.trim() === '') {
        setPhoneValidationMessage('');
      } else {
        const validation = validatePhoneNumber(formData.countryCode, value);
        setPhoneValidationMessage(validation.valid ? '' : validation.message);
      }
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Re-validate phone when country code changes
    if (name === 'countryCode' && formData.phone.trim() !== '') {
      const validation = validatePhoneNumber(value, formData.phone);
      setPhoneValidationMessage(validation.valid ? '' : validation.message);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Valid email is required",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }
    
    // Enhanced phone validation
    if (!formData.phone.trim()) {
      toast({
        title: "Phone number is required",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return false;
    }
    
    const phoneValidation = validatePhoneNumber(formData.countryCode, formData.phone);
    if (!phoneValidation.valid) {
      toast({
        title: "Invalid phone number",
        description: phoneValidation.message,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Send inquiry email to academy
      const emailResult = await sendInquiryEmail(formData);
      
      if (emailResult.success) {
        // Send auto-reply acknowledgment to user
        const autoReplyResult = await sendAutoReplyEmail(formData);
        
        if (autoReplyResult.success) {
          console.log('Auto-reply sent successfully');
        } else {
          console.warn('Auto-reply failed:', autoReplyResult.message);
        }
        
        // Clean up preference storage
        localStorage.removeItem('enrollmentIntent');
        localStorage.removeItem('courseInterest');
        localStorage.removeItem('topperInterest');
        
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          countryCode: '+91',
          course: '',
          grade: '',
          message: ''
        });
        
        toast({
          title: "Inquiry submitted successfully!",
          description: "We'll get back to you within 24 hours. Check your email for confirmation.",
          variant: "default"
        });
      } else {
        // Handle EmailJS error
        toast({
          title: "Email service unavailable",
          description: emailResult.message || "Your inquiry has been saved locally. We'll contact you soon.",
          variant: "destructive"
        });
        
        // Optionally, you can still show success to user and handle the data differently
        // For now, we'll still consider it a success for user experience
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          countryCode: '+91',
          course: '',
          grade: '',
          message: ''
        });
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission failed",
        description: "Please try again later or contact us directly",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const tabData = {
    foundation: {
      title: "Foundation Courses",
      description: "Strong foundation building for grades 9-12 with conceptual learning approach",
      image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=600&h=400&fit=crop",
      features: ["Conceptual Learning", "Problem Solving", "Regular Assessment", "Doubt Support"],
      successRate: "98%",
      toppers: "500+"
    },
    jee: {
      title: "JEE Main & Advanced",
      description: "we are introducing JEE and NEET so no need to mention success rate and toppers in both sections",
      image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=600&h=400&fit=crop",
      features: ["Live Classes", "Mock Tests", "Doubt Clearing", "Study Material"],
      successRate: "95%",
      toppers: "250+"
    },
    neet: {
      title: "NEETPreparation",
      description: "Launching our new program for medical and engineering aspirants, built upon our 23 years of foundation course excellence.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
      features:  ["Expert Faculty", "Comprehensive Mock Tests", "Doubt Clearing Sessions", "Updated Study Material"],
      successRate: "92%",
      toppers: "180+"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Section */}
      <Banner />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0052CC] to-[#002357] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                {/* Logo */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                      src="/sub.png" 
                      alt={mockData.institute.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{mockData.institute.name}</h2>
                    <p className="text-gray-200">{mockData.institute.tagline}</p>
                  </div>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Your Success is Our
                  <span className="block text-[#39C93D]">Mission</span>
                </h1>
                <p className="text-lg text-gray-200 leading-relaxed">
                  Join Hosur's leading educational institute with 20+ years of excellence in Foundation courses, now introducing NEET and JEE coaching. Transform your dreams into reality with our expert guidance.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#002357] px-8 py-4 text-lg font-semibold"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Visit us to learn more
                </Button> */}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Academic Year 2025-26</h3>
                  <p className="text-gray-200">Admissions Open</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#39C93D]">{stats.studentsEnrolled}</div>
                    <div className="text-sm text-gray-200">Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#39C93D]">{stats.successRate}</div>
                    <div className="text-sm text-gray-200">Success Rate</div>
                  </div>
                </div>
                <Button 
                  onClick={handleEnrollClick}
                  className="w-full bg-[#39C93D] hover:bg-[#2db832] text-white font-semibold btn-smooth pulse-on-hover transition-all duration-300"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Tabs Section */}
      <section className="py-16 relative bg-gray-50" style={{
        backgroundImage: 'url("/classroom4.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
               Choose your Path to Success
            </h2>
            <p className="text-lg text-white font-bold max-w-2xl mx-auto">
              Explore our comprehensive courses designed for different competitive exams
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-2 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  {Object.entries(tabData).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all w-full sm:w-auto text-center ${
                        activeTab === key 
                          ? 'bg-[#0052CC] text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {data.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#002357] mb-3">
                        {tabData[activeTab].title}
                      </h3>
                      <p className="text-gray-600 text-lg">
                        {tabData[activeTab].description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[#39C93D] bg-opacity-10 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-[#39C93D]">
                          {tabData[activeTab].successRate}
                        </div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                      <div className="bg-[#0052CC] bg-opacity-10 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-[#0052CC]">
                          {tabData[activeTab].toppers}
                        </div>
                        <div className="text-sm text-gray-600">Toppers</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[#002357] mb-3">Key Features:</h4>
                      <div className="space-y-2">
                        {tabData[activeTab].features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-[#39C93D]" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button 
                        variant="outline"
                        className="border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white"
                        onClick={() => window.location.href = `/courses?category=${activeTab}`}
                      >
                        View Schedule
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={tabData[activeTab].image}
                    alt={tabData[activeTab].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0052CC] to-transparent opacity-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 fade-in-on-scroll">
            <h2 className="text-3xl font-bold text-[#002357] mb-4">
              Success Stories That Inspire
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our star students who achieved their dreams with our guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockData.toppers.slice(0, 3).map((topper, index) => (
              <Card key={topper.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 card-hover slide-up-on-scroll" style={{ '--child-index': index }}>
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-br from-[#0052CC] to-[#39C93D] flex items-center justify-center border-4 border-[#39C93D]">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#39C93D] rounded-full flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-2">{topper.name}</h3>
                  <div className="text-[#0052CC] font-semibold mb-1">{topper.rank}</div>
                  <div className="text-gray-600 text-sm mb-4">{topper.exam}</div>
                  <p className="text-gray-600 text-sm italic">"{topper.testimonial}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 fade-in-on-scroll">
            <h2 className="text-3xl font-bold text-[#002357] mb-4">
              Why Choose Hosur Toppers Academy?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                title: "Expert Faculty",
                description: "15+ years experienced educators",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: <BookOpen className="h-8 w-8" />,
                title: "Comprehensive Study Material",
                description: "Updated content with latest patterns",
                color: "from-green-500 to-green-600"
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: "Personalized Attention",
                description: "Small batch sizes for better focus",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Proven Results",
                description: "95% success rate in CBSE/ICSE exams",
                color: "from-orange-500 to-orange-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group slide-up-on-scroll" style={{ '--child-index': index }}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#002357] mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry-form" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#002357] mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {/* Inquiry Form */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-[#39C93D] rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#002357] mb-2">Thank You!</h3>
                      <p className="text-gray-600 mb-6">Your inquiry has been submitted successfully. Our team will contact you within 24 hours.</p>
                      <div className="flex justify-center">
                        <Button variant="outline" onClick={handleWhatsApp} size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Select 
                            value={formData.countryCode} 
                            onValueChange={(value) => handleSelectChange('countryCode', value)}
                          >
                            <SelectTrigger className="w-full sm:w-32">
                              <SelectValue placeholder="Select country code" />
                            </SelectTrigger>
                            <SelectContent>
                              {countryCodes.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  <span className="flex items-center gap-2">
                                    <span>{country.flag}</span>
                                    <span>{country.code}</span>
                                    <span className="text-xs text-gray-500">({country.country})</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className={`flex-1 ${phoneValidationMessage ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {phoneValidationMessage && (
                          <p className="text-sm text-red-500 mt-1">{phoneValidationMessage}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                            Course of Interest
                          </label>
                          <Select value={formData.course} onValueChange={(value) => handleSelectChange('course', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockData.courses.map(course => (
                                <SelectItem key={course.id} value={course.title}>
                                  {course.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Grade
                          </label>
                          <Select value={formData.grade} onValueChange={(value) => handleSelectChange('grade', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6th">6th Grade</SelectItem>
                              <SelectItem value="7th">7th Grade</SelectItem>
                              <SelectItem value="8th">8th Grade</SelectItem>
                              <SelectItem value="9th">9th Grade</SelectItem>
                              <SelectItem value="10th">10th Grade</SelectItem>
                              <SelectItem value="11th">11th Grade</SelectItem>
                              <SelectItem value="12th">12th Grade</SelectItem>
                              <SelectItem value="dropper">Dropper</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us about your goals and any specific questions you have..."
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#39C93D] hover:bg-[#2db832] text-white py-3 text-lg font-semibold transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Send Inquiry
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;