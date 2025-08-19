import React, { useState, useEffect } from 'react';
import { Award, Star, Trophy, Medal, Target, ArrowRight, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockData } from '../components/mock/mockData';

const Toppers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toppers = mockData.toppers;

  // Show all toppers
  const displayedToppers = toppers;

  const handleInquireClick = (topper) => {
    // Save topper interest to localStorage for backend integration
    localStorage.setItem('topperInterest', JSON.stringify({
      topperId: topper.id,
      topperName: topper.name,
      course: topper.course,
      exam: topper.exam,
      timestamp: new Date().toISOString()
    }));
    window.location.href = '/#inquiry-form';
  };

  useEffect(() => {
    if (window.location.hash === '#top-achievers') {
      const element = document.getElementById('top-achievers');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading toppers...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-white" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-white" />;
    if (rank === 3) return <Award className="h-5 w-5 text-white" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-500';
    if (rank === 2) return 'bg-yellow-400';
    if (rank === 3) return 'bg-orange-500';
    return 'bg-yellow-300';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="top-achievers" className="relative bg-gradient-to-br from-[#0052CC] via-[#002357] to-[#0052CC] text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-[#39C93D] text-white px-4 py-2 text-sm font-medium mb-6">
              Our Toppers
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Champions of
              <span className="block text-[#39C93D]">Excellence</span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Meet our star students who achieved remarkable success with our guidance and support
            </p>
          </div>
        </div>
      </section>

      {/* Toppers Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {displayedToppers.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No toppers found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
                {displayedToppers.map((topper) => (
                <Card key={topper.id} className="border-0 shadow-lg h-full flex flex-col">
                  <CardHeader className="text-center pb-4">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-[#39C93D] to-[#2db832] border-4 border-[#39C93D] flex items-center justify-center">
                        <User className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-[#002357]">
                      {topper.name}
                    </CardTitle>
                    <div className="space-y-2">
                      <Badge className={`${getRankColor(topper.rank)} text-sm text-blue-600`}>
                        {topper.rank}
                      </Badge>
                      <div className="text-sm text-gray-600">{topper.exam}</div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 flex-grow flex flex-col">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#0052CC] mb-1">{topper.score}</div>
                      <div className="text-sm text-gray-600">Score Achieved</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-[#002357] mb-2">Course Taken:</h4>
                      <p className="text-sm text-gray-600">{topper.course}</p>
                    </div>
                    
                    <div className="bg-[#39C93D] bg-opacity-10 p-4 rounded-lg flex-grow">
                      <h4 className="font-semibold text-[#002357] mb-2">Testimonial:</h4>
                      <p className="text-sm text-gray-600 italic">"{topper.testimonial}"</p>
                    </div>
                    
                    <div className="flex items-center space-x-1 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-[#39C93D] text-blue-600 mt-auto"
                      onClick={() => handleInquireClick(topper)}
                    >
                      Follow Their Path
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Success Statistics */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#002357] mb-4">
              Success Statistics
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our track record speaks for itself
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0052CC] to-[#39C93D] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Trophy className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-[#0052CC] mb-2">250+</div>
              <div className="text-gray-600">Top Rankers</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#39C93D] to-[#0052CC] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Medal className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-[#0052CC] mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0052CC] to-[#39C93D] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-[#0052CC] mb-2">50+</div>
              <div className="text-gray-600">AIR Top 100</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#39C93D] to-[#0052CC] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Target className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-[#0052CC] mb-2">15+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Built on Strong Foundation Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#002357] mb-4">
              Success Built on a Strong Foundation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our students' achievements in various competitive exams and boards are a direct result of the exceptional groundwork laid in our Foundation Course
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Excellence in Board Exams */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0052CC] to-[#002357] rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#002357] mb-4">
                Excellence in Board Exams
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our foundation program is designed to ensure top performance in board examinations, leading to a 100% success rate. We're proud of students like Mrithun Dharsha who scored an outstanding 480/500.
              </p>
              <div className="bg-[#0052CC] bg-opacity-10 rounded-lg p-6">
                <div className="text-3xl font-bold text-[#0052CC] mb-2">200+</div>
                <div className="text-lg font-semibold text-[#002357]">Board Toppers</div>
              </div>
            </div>

            {/* Launching Future Doctors & Engineers */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#39C93D] to-[#2db832] rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#002357] mb-4">
                Launching Future Doctors & Engineers
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The path to cracking competitive exams like NEET and JEE begins with a solid foundation. Our course builds the strong conceptual base required for students to excel in these challenging exams and secure their future.
              </p>
              <div className="bg-[#39C93D] bg-opacity-10 rounded-lg p-6">
                <div className="text-3xl font-bold text-[#39C93D] mb-2">Proven Path to Success</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0052CC] to-[#39C93D] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Join Our Success Story?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Take the first step towards achieving your dreams with our proven guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-[#0052CC] hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                // If we're not on the home page, navigate to home first
                if (window.location.pathname !== '/') {
                  window.location.href = '/#inquiry-form';
                } else {
                  // If on home page, scroll to inquiry form
                  const inquirySection = document.getElementById('inquiry-form');
                  if (inquirySection) {
                    inquirySection.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {/* <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#0052CC] px-8 py-4 text-lg font-semibold transition-all duration-300"
              onClick={() => window.location.href = '/courses'}
            >
              View Our Courses
            </Button> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Toppers;