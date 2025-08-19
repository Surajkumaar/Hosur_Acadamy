import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockData } from '../components/mock/mockData';

const Courses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleContactClick = () => {
    // First navigate to home page
    navigate('/');
    
    // Wait for navigation to complete, then scroll
    const scrollToContact = () => {
      const inquirySection = document.getElementById('inquiry-form');
      if (inquirySection) {
        // Scroll to the element
        inquirySection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // If element not found, try again after a short delay
        setTimeout(scrollToContact, 100);
      }
    };
    
    // Start trying to scroll after a brief delay
    setTimeout(scrollToContact, 200);
  };

  const courses = mockData.courses;

  // Show all courses
  const displayedCourses = courses;

  const handleEnrollClick = (course) => {
    // Save course interest to localStorage for backend integration
    localStorage.setItem('courseInterest', JSON.stringify({
      courseId: course.id,
      courseName: course.title,
      timestamp: new Date().toISOString()
    }));
    window.location.href = '/inquiry';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading courses...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0052CC] via-[#002357] to-[#0052CC] text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-[#39C93D] text-white px-4 py-2 text-sm font-medium mb-6">
              Our Courses
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Discover Your
              <span className="block text-[#39C93D]">Perfect Course</span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Choose from our comprehensive range of courses designed to help you achieve your academic goals
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {displayedCourses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedCourses.map((course) => (
                <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#39C93D] text-white">
                        {course.grade}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-[#002357] group-hover:text-[#0052CC] transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {course.subject}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#002357] text-sm">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {course.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0052CC] to-[#39C93D] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us for personalized course recommendations and custom learning solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-[#0052CC] hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={handleContactClick}
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#0052CC] px-8 py-4 text-lg font-semibold transition-all duration-300"
              onClick={() => window.location.href = '/about'}
            >
              Learn About Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;