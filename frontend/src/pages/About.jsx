import React from 'react';
import { CheckCircle, Users, Target, Award, BookOpen, Heart, Star, Mail, Phone, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockData } from '../components/mock/mockData';

const About = () => {
  const { about, stats } = mockData;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0052CC] via-[#002357] to-[#0052CC] text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-[#39C93D] text-white px-4 py-2 text-sm font-medium mb-6 hover:bg-[#39C93D] cursor-default">
              About Hosur Toppers Academy
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Empowering Minds,
              <span className="block text-[#39C93D]">Shaping Futures</span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              For over 23 years, we've been dedicated to providing exceptional education that transforms lives
              and opens doors to endless possibilities.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0052CC] to-[#39C93D] rounded-full flex items-center justify-center text-white mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-[#002357]">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {about.vision}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#39C93D] to-[#0052CC] rounded-full flex items-center justify-center text-white mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-[#002357]">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {about.mission}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#002357] mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These numbers reflect our commitment to excellence and student success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0052CC] to-[#39C93D] rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold text-[#002357] mb-2">{stats.studentsEnrolled}</div>
              <div className="text-gray-600">Students Enrolled Per Year</div>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#39C93D] to-[#0052CC] rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold text-[#002357] mb-2">{stats.successRate}</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0052CC] to-[#39C93D] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Star className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold text-[#002357] mb-2">{stats.experienceYears}</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#39C93D] to-[#0052CC] rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold text-[#002357] mb-2">{stats.facultyCount}</div>
              <div className="text-gray-600">Expert Faculty</div>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Methodology Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#002357] mb-4">
              Our Teaching Methodology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our proven approach ensures every student reaches their full potential
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {about.methodology.map((method, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0052CC] to-[#39C93D] rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#002357] mb-2">{method.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{method.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#002357] mb-4">
              Meet Our Expert Faculty
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from the best minds in education with years of teaching experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
      name: "R. Sindhuja Rajan",
      subject: "Math & Physics",
      experience: "25+ years",
      image: "https://images.unsplash.com/photo-1580894908361-967195033215?w=300&h=300&fit=crop&crop=face",
      qualifications: "MSc. B.ed"
    },
    {
      name: "Sir Jeevanatham",
      subject: "Chemistry",
      experience: "12+ years",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
      qualifications: "Senior Chemistry Faculty"
    },
    {
      name: "Kaviya",
      subject: "Math & Science",
      experience: "18+ years",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
      qualifications: "Foundation Course Expert"
    }
            ].map((faculty, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-[#0052CC] to-[#39C93D] flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#39C93D] rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-2">{faculty.name}</h3>
                  <p className="text-[#0052CC] font-medium mb-1">{faculty.subject}</p>
                  <p className="text-gray-600 text-sm mb-3">{faculty.qualifications}</p>
                  <Badge className="bg-[#39C93D] text-white hover:bg-[#39C93D] cursor-default">
                    {faculty.experience}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#002357] mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The story of how Hosur Toppers Academy is transforming education in India
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300"></div>
              
              {/* Timeline Items */}
              <div className="space-y-16">
                {/* 2009 - Foundation */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0052CC]">
                      <div className="text-2xl font-bold text-[#0052CC] mb-2">2002</div>
                      <h3 className="text-xl font-semibold text-[#002357] mb-3">Foundation</h3>
                      <p className="text-gray-600">
                        Hosur Toppers Academy  was founded with a mission to democratize quality education and make it accessible to every student.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#0052CC] rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-1/2 pl-8"></div>
                </div>

                {/* 2012 - First Success */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#39C93D] rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-1/2 pl-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-r-4 border-[#39C93D]">
                      <div className="text-2xl font-bold text-[#39C93D] mb-2">2012</div>
                      <h3 className="text-xl font-semibold text-[#002357] mb-3">First Major Success</h3>
                      <p className="text-gray-600">
                        Achieved our first major milestone with 50+ students clearing Board Exams withtop ranks.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2018 - Digital Integration */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0052CC]">
                      <div className="text-2xl font-bold text-[#0052CC] mb-2">2018</div>
                      <h3 className="text-xl font-semibold text-[#002357] mb-3">Digital Integration</h3>
                      <p className="text-gray-600">
                        Launched online learning platform with interactive classes and digital study materials.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#0052CC] rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-1/2 pl-8"></div>
                </div>

                {/* 2023 - 1000+ Students */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#39C93D] rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-1/2 pl-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-r-4 border-[#39C93D]">
                      <div className="text-2xl font-bold text-[#39C93D] mb-2">2023</div>
                      <h3 className="text-xl font-semibold text-[#002357] mb-3">1000+ Students Milestone</h3>
                      <p className="text-gray-600">
                        Reached 1000+ enrolled students with 95% success rate across all competitive exams.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2025 - Present */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-gradient-to-r from-[#0052CC] to-[#39C93D] p-6 rounded-lg shadow-lg text-white">
                      <div className="text-2xl font-bold mb-2">2025</div>
                      <h3 className="text-xl font-semibold mb-3">Continuing Excellence</h3>
                      <p className="text-gray-100">
                        Leading the way in educational innovation with cutting-edge teaching methods and technology.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#0052CC] to-[#39C93D] rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-1/2 pl-8"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-r from-[#0052CC] to-[#39C93D] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-xl max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Excellence",
                description: "We strive for the highest standards in everything we do"
              },
              {
                title: "Integrity",
                description: "We maintain honesty and transparency in all our interactions"
              },
              {
                title: "Innovation",
                description: "We embrace new teaching methods and technologies"
              },
              {
                title: "Dedication",
                description: "We are committed to our students' success"
              },
              {
                title: "Collaboration",
                description: "We believe in working together to achieve common goals"
              },
              {
                title: "Growth",
                description: "We focus on continuous improvement and learning"
              }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-200">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;