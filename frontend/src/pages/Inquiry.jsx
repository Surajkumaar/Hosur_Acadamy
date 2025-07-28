import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, Send, User, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { mockData } from '../components/mock/mockData';

const Inquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    grade: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    
    if (!formData.phone.trim() || !/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      toast({
        title: "Valid phone number is required",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.course) {
      toast({
        title: "Course selection is required",
        description: "Please select a course you're interested in",
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
      // Simulate API call with mock data
      const inquiryData = {
        id: Date.now(),
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'pending',
        source: 'website'
      };
      
      // Store in localStorage for mock backend
      const existingInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
      existingInquiries.push(inquiryData);
      localStorage.setItem('inquiries', JSON.stringify(existingInquiries));
      
      // Clean up preference storage
      localStorage.removeItem('enrollmentIntent');
      localStorage.removeItem('courseInterest');
      localStorage.removeItem('topperInterest');
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      setIsSubmitted(true);
      toast({
        title: "Inquiry submitted successfully!",
        description: "We'll get back to you within 24 hours",
        variant: "default"
      });
      
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later",
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-[#39C93D] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#002357] mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your inquiry has been submitted successfully. Our team will contact you within 24 hours.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-[#0052CC] hover:bg-[#0041a3] text-white"
              >
                Return to Home
              </Button>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={handleCall} size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                <Button variant="outline" onClick={handleWhatsApp} size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0052CC] via-[#002357] to-[#0052CC] text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-[#39C93D] text-white px-4 py-2 text-sm font-medium mb-6">
              Contact Us
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Start Your Journey
              <span className="block text-[#39C93D]">With Us Today</span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Have questions? Want to enroll? We're here to help you achieve your academic goals.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-[#002357]">
                  Send Us Your Inquiry
                </CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                        Course of Interest *
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
                      <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your goals and any specific questions you have..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#39C93D] hover:bg-[#2db832] text-white py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
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
              </CardContent>
            </Card>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-[#002357]">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#0052CC] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#002357] mb-1">Phone</h3>
                      <button
                        onClick={handleCall}
                        className="text-gray-600 hover:text-[#0052CC] transition-colors"
                      >
                        {mockData.institute.phone}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#39C93D] rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#002357] mb-1">Email</h3>
                      <button
                        onClick={handleEmail}
                        className="text-gray-600 hover:text-[#39C93D] transition-colors"
                      >
                        {mockData.institute.email}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#0052CC] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#002357] mb-1">Address</h3>
                      <p className="text-gray-600">{mockData.institute.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#39C93D] rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#002357] mb-1">Instution Hours</h3>
                      <p className="text-gray-600">Monday - Saturday: 6:00 pm - 9:00 pm</p>
                      <p className="text-gray-600">Sunday: 10:00 am - 1:00 pm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-[#002357]">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleCall}
                    className="w-full bg-[#0052CC] hover:bg-[#0041a3] text-white py-3 text-lg font-semibold transition-colors"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now
                  </Button>
                  
                  <Button
                    onClick={handleWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#20c058] text-white py-3 text-lg font-semibold transition-colors"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    WhatsApp Us
                  </Button>
                  
                  <Button
                    onClick={handleEmail}
                    variant="outline"
                    className="w-full border-[#39C93D] text-[#39C93D] hover:bg-[#39C93D] hover:text-white py-3 text-lg font-semibold transition-colors"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Send Email
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#002357] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our courses and admissions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "What are the admission requirements?",
                answer: "We welcome students from all backgrounds. Basic requirements include previous academic records and a simple entrance assessment."
              },
              {
                question: "Do you offer online classes?",
                answer: "Yes, we offer both online and offline classes with interactive sessions and recorded lectures for flexible learning."
              },
              {
                question: "What is the fee structure?",
                answer: "Our fees vary by course and duration. We offer flexible payment options and scholarships for deserving students."
              },
              {
                question: "How experienced are the faculty members?",
                answer: "Our faculty consists of highly qualified educators with 10+ years of experience in their respective subjects."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[#002357] mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inquiry;