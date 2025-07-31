import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Award, Star, Trophy, Medal, Target, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockData } from '../components/mock/mockData';

const Toppers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toppers = mockData.toppers;

  const exams = useMemo(() => [...new Set(toppers.map(topper => topper.exam))], [toppers]);
  const years = useMemo(() => [...new Set(toppers.map(topper => topper.year))], [toppers]);

  const filteredToppers = useMemo(() => {
    let filtered = toppers.filter(topper => {
      const matchesSearch = topper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            topper.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            topper.course.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesExam = selectedExam === 'all' || topper.exam === selectedExam;
      const matchesYear = selectedYear === 'all' || topper.year === selectedYear;
      
      return matchesSearch && matchesExam && matchesYear;
    });

    return filtered;
  }, [searchTerm, selectedExam, selectedYear, toppers]);

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
    if (rank === 2) return 'bg-gray-400';
    if (rank === 3) return 'bg-orange-500';
    return 'bg-gray-200';
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

      {/* Filter Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search toppers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Filter by:</span>
              </div>
              
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  {exams.map(exam => (
                    <SelectItem key={exam} value={exam.split(' ')[0]}>{exam.split(' ')[0]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>Showing {filteredToppers.length} of {toppers.length} toppers</span>
            {(searchTerm || selectedExam !== 'all' || selectedYear !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedExam('all');
                  setSelectedYear('all');
                }}
                className="text-[#0052CC] hover:text-[#0041a3]"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Toppers Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {filteredToppers.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No toppers found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredToppers.map((topper) => (
                <Card key={topper.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <div className="relative mb-4">
                      <img
                        src={topper.image}
                        alt={topper.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#39C93D] group-hover:border-[#0052CC] transition-colors"
                      />
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#0052CC] to-[#39C93D] rounded-full flex items-center justify-center">
                        {getRankIcon(topper.rank)}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-[#002357] group-hover:text-[#0052CC] transition-colors">
                      {topper.name}
                    </CardTitle>
                    <div className="space-y-2">
                      <Badge className={`${getRankColor(topper.rank)} text-sm`}>
                        {topper.rank}
                      </Badge>
                      <div className="text-sm text-gray-600">{topper.exam}</div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#0052CC] mb-1">{topper.score}</div>
                      <div className="text-sm text-gray-600">Score Achieved</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-[#002357] mb-2">Course Taken:</h4>
                      <p className="text-sm text-gray-600">{topper.course}</p>
                    </div>
                    
                    <div className="bg-[#39C93D] bg-opacity-10 p-4 rounded-lg">
                      <h4 className="font-semibold text-[#002357] mb-2">Testimonial:</h4>
                      <p className="text-sm text-gray-600 italic">"{topper.testimonial}"</p>
                    </div>
                    
                    <div className="flex items-center space-x-1 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-[#39C93D] hover:bg-[#2db832] text-white transition-colors"
                      onClick={() => handleInquireClick(topper)}
                    >
                      Follow Their Path
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Success Stats */}
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

      {/* Success Stories Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#002357] mb-4">
              Success Across All Streams
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our students excel in various competitive exams and boards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "JEE Success",
                description: "Outstanding results in JEE Main & Advanced",
                icon: "⚡",
                count: "150+ Selections",
                color: "from-blue-500 to-purple-600"
              },
              {
                title: "NEET Achievers",
                description: "Medical aspirants achieving their dreams",
                icon: "🩺",
                count: "80+ Selections",
                color: "from-green-500 to-teal-600"
              },
              {
                title: "Board Toppers",
                description: "Excellent performance in board examinations",
                icon: "📚",
                count: "200+ Toppers",
                color: "from-orange-500 to-red-600"
              }
            ].map((category, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#002357] mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="text-2xl font-bold text-[#0052CC]">{category.count}</div>
                </CardContent>
              </Card>
            ))}
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
              onClick={() => window.location.href = '/inquiry'}
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