import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Award, BookOpen, Target, CheckCircle, Play, Calendar, Trophy, GraduationCap, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockData } from '../components/mock/mockData';
import Banner from '../components/Banner';

const Home = () => {
  const [activeTab, setActiveTab] = useState('jee');
  const featuredCourses = mockData.courses.slice(0, 4);
  const testimonials = mockData.testimonials;
  const stats = mockData.stats;

  const handleEnrollClick = () => {
    localStorage.setItem('enrollmentIntent', JSON.stringify({
      timestamp: new Date().toISOString(),
      source: 'hero_cta'
    }));
    window.location.href = '/inquiry';
  };

  const tabData = {
    jee: {
      title: "JEE Main & Advanced",
      description: "Comprehensive engineering entrance exam preparation with expert faculty and proven results",
      image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=600&h=400&fit=crop",
      features: ["Live Classes", "Mock Tests", "Doubt Clearing", "Study Material"],
      successRate: "95%",
      toppers: "250+"
    },
    neet: {
      title: "NEET Preparation",
      description: "Complete medical entrance exam preparation with specialized coaching and practice tests",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
      features: ["Expert Faculty", "Practice Tests", "Performance Analysis", "Study Notes"],
      successRate: "92%",
      toppers: "180+"
    },
    foundation: {
      title: "Foundation Courses",
      description: "Strong foundation building for grades 9-12 with conceptual learning approach",
      image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=600&h=400&fit=crop",
      features: ["Conceptual Learning", "Problem Solving", "Regular Assessment", "Doubt Support"],
      successRate: "98%",
      toppers: "500+"
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
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Your Success is Our
                  <span className="block text-[#39C93D]">Mission</span>
                </h1>
                <p className="text-lg text-gray-200 leading-relaxed">
                  Join India's leading educational institute with 15+ years of excellence in JEE, NEET, 
                  and Foundation courses. Transform your dreams into reality with our expert guidance.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-[#002357] px-8 py-4 text-lg font-semibold"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo Class
                </Button>
                <Button 
                  size="lg" 
                  className="bg-[#39C93D] hover:bg-[#2db832] text-white px-8 py-4 text-lg font-semibold"
                  onClick={() => window.location.href = '/courses'}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
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
                    <div className="text-sm text-gray-200">Students Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#39C93D]">{stats.successRate}</div>
                    <div className="text-sm text-gray-200">Success Rate</div>
                  </div>
                </div>
                <Button 
                  onClick={handleEnrollClick}
                  className="w-full bg-[#39C93D] hover:bg-[#2db832] text-white font-semibold"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Tabs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#002357] mb-4">
              Choose Your Path to Success
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive courses designed for different competitive exams
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-2 shadow-lg">
                {Object.entries(tabData).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
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
                    
                    <div className="grid grid-cols-2 gap-4">
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
                       {/* <Button 
                        className="bg-[#39C93D] hover:bg-[#2db832] text-white"
                        onClick={() => window.location.href = '/inquiry?course=' + activeTab}
                      >
                        Book Free Demo
                      </Button>
                       */}
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#002357] mb-4">
              Success Stories That Inspire
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our star students who achieved their dreams with our guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockData.toppers.slice(0, 3).map((topper) => (
              <Card key={topper.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <img
                      src={topper.image}
                      alt={topper.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-[#39C93D]"
                    />
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#002357] mb-4">
              Why Choose Hosur Toppers Academy?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                description: "95% success rate in competitive exams",
                color: "from-orange-500 to-orange-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
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

      {/* Top 3 Students Showcase */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#002357] mb-4">
              Our Top Achievers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our star students who achieved remarkable success with our guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockData.toppers.slice(0, 3).map((topper, index) => (
              <Card key={topper.id} className="relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Rank Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                    'bg-gradient-to-r from-orange-400 to-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                
                <CardContent className="p-8 text-center pt-12">
                  <div className="relative mb-6">
                    <img
                      src={topper.image}
                      alt={topper.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#39C93D]"
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#39C93D] rounded-full flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#002357] mb-2">{topper.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="bg-[#0052CC] text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {topper.rank}
                    </div>
                    <div className="text-[#39C93D] font-semibold">{topper.exam}</div>
                    <div className="text-2xl font-bold text-[#002357]">{topper.score}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="text-sm text-gray-600 mb-1">Course:</div>
                    <div className="font-semibold text-[#002357]">{topper.course}</div>
                  </div>
                  
                  <div className="bg-[#39C93D] bg-opacity-10 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 italic">"{topper.testimonial}"</p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/toppers#top-achievers">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white transition-all duration-300"
              >
                View All Toppers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#002357] mb-4">
              Latest News & Updates
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                date: "Jan 15, 2025",
                title: "JEE Main 2025 Registration Open",
                description: "Applications for JEE Main 2025 are now open. Register before the deadline."
              },
              {
                date: "Jan 10, 2025",
                title: "NEET 2025 Syllabus Released",
                description: "NTA has released the official syllabus for NEET 2025. Check important updates."
              },
              {
                date: "Jan 05, 2025",
                title: "New Foundation Batches Starting",
                description: "New foundation course batches for grades 6-10 starting from February 2025."
              }
            ].map((news, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="h-4 w-4 text-[#39C93D]" />
                    <span className="text-sm text-[#39C93D] font-medium">{news.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#002357] mb-2">{news.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{news.description}</p>
                  <Button variant="ghost" className="p-0 h-auto text-[#0052CC] hover:text-[#0041a3]">
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#0052CC] to-[#39C93D] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Begin Your Success Journey?
              </h2>
              <p className="text-lg mb-6 text-gray-100">
                Join thousands of successful students who transformed their dreams into reality with Hosur Toppers Academy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/courses'}
                  className="bg-white text-[#0052CC] hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
                {/* <Button 
                  size="lg"
                  onClick={() => window.location.href = '/inquiry?type=demo'}
                  className="bg-[#39C93D] hover:bg-[#2db832] text-white px-8 py-4 text-lg font-semibold"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Book Free Demo
                </Button> */}
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-bold mb-4">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#39C93D]" />
                  <span>{mockData.institute.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#39C93D]" />
                  <span>{mockData.institute.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-[#39C93D]" />
                  <span>{mockData.institute.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;