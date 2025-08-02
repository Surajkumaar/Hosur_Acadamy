import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [rollNumber, setRollNumber] = useState('');
  const [studentResults, setStudentResults] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Mock data for testing - Replace with actual API call
  const mockStudentData = {
    '2025JEE0001': {
      name: 'Kavishri A N S',
      course: 'JEE',
      batch: '2025',
      classRankings: {
        toppers: [
          { name: 'Rahul M', rollNo: '2025JEE0003', totalMarks: 280, percentage: 93.33 },
          { name: 'Kavishri A N S', rollNo: '2025JEE0001', totalMarks: 273, percentage: 91.00 },
          { name: 'Priya S', rollNo: '2025JEE0015', totalMarks: 270, percentage: 90.00 }
        ],
        studentPosition: 2,
        totalStudents: 120,
        subjectToppers: {
          Physics: [
            { name: 'Rahul M', marks: 95 },
            { name: 'Kavishri A N S', marks: 88 },
            { name: 'Arun K', marks: 87 }
          ],
          Chemistry: [
            { name: 'Kavishri A N S', marks: 92 },
            { name: 'Priya S', marks: 90 },
            { name: 'Rahul M', marks: 89 }
          ],
          Mathematics: [
            { name: 'Priya S', marks: 96 },
            { name: 'Rahul M', marks: 96 },
            { name: 'Kavishri A N S', marks: 95 }
          ]
        }
      },
      results: [
        {
          examName: 'JEE Mock Test 1',
          date: '2025-07-15',
          subjects: {
            Physics: 85,
            Chemistry: 92,
            Mathematics: 88
          },
          rank: 3,
          totalStudents: 120
        },
        {
          examName: 'JEE Mock Test 2',
          date: '2025-07-22',
          subjects: {
            Physics: 88,
            Chemistry: 90,
            Mathematics: 95
          },
          rank: 2,
          totalStudents: 120
        }
      ],
      overallStats: {
        currentRank: 2,
        previousRank: 3,
        batchStrength: 120,
        averageScore: 89.67,
        attendance: 98,
        subjectRanks: {
          Physics: 4,
          Chemistry: 2,
          Mathematics: 1
        },
        improvement: {
          Physics: "+3%",
          Chemistry: "-2%",
          Mathematics: "+7%"
        }
      }
    }
  };

  useEffect(() => {
    // If logged in as student via Firebase, automatically load their results
    if (user?.role === 'student' && user?.rollNumber) {
      setRollNumber(user.rollNumber);
      handleSearch();
    }
  }, [user]);

  const handleSearch = () => {
    setSearchPerformed(true);
    const result = mockStudentData[rollNumber];
    setStudentResults(result || null);
  };

  const calculateTotal = (subjects) => {
    return Object.values(subjects).reduce((sum, mark) => sum + mark, 0);
  };

  const calculatePercentage = (subjects) => {
    const total = calculateTotal(subjects);
    const maxMarks = Object.keys(subjects).length * 100;
    return ((total / maxMarks) * 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Student Results Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Enter your roll number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-[#13ad89] hover:bg-[#0f8c6d]"
              >
                View Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Display */}
        {searchPerformed && !studentResults && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">No results found for the given roll number. Please check and try again.</p>
            </CardContent>
          </Card>
        )}

        {studentResults && (
          <div className="space-y-6">
            {/* Student Information and Overall Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Info */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{studentResults.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Course</p>
                      <p className="font-medium">{studentResults.course}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Batch</p>
                      <p className="font-medium">{studentResults.batch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Attendance</p>
                      <p className="font-medium">{studentResults.overallStats.attendance}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Rankings */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Current Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overall Rank */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Overall Class Rank</p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-[#13ad89]">
                          {studentResults.overallStats.currentRank}
                        </span>
                        <span className="text-gray-500 mb-1">
                          / {studentResults.overallStats.batchStrength}
                        </span>
                        {studentResults.overallStats.currentRank < studentResults.overallStats.previousRank ? (
                          <span className="text-green-500 text-sm mb-1">↑ Improved</span>
                        ) : studentResults.overallStats.currentRank > studentResults.overallStats.previousRank ? (
                          <span className="text-red-500 text-sm mb-1">↓ Dropped</span>
                        ) : (
                          <span className="text-gray-500 text-sm mb-1">− Maintained</span>
                        )}
                      </div>
                    </div>

                    {/* Average Score */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Average Score</p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-[#13ad89]">
                          {studentResults.overallStats.averageScore}%
                        </span>
                      </div>
                    </div>

                    {/* Subject-wise Rankings */}
                    <div className="md:col-span-2">
                      <h3 className="font-medium mb-3">Subject Rankings</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {Object.entries(studentResults.overallStats.subjectRanks).map(([subject, rank]) => (
                          <div key={subject} className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-1">{subject}</p>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-[#13ad89]">#{rank}</span>
                              <span className="text-sm text-gray-500 mb-1">
                                ({studentResults.overallStats.improvement[subject]})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Class Rankings */}
            <Card>
              <CardHeader>
                <CardTitle>Class Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Top Performers */}
                  <div>
                    <h3 className="font-medium text-lg mb-3">Top Performers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {studentResults.classRankings.toppers.map((topper, index) => (
                        <div 
                          key={topper.rollNo}
                          className={`p-4 rounded-lg ${
                            topper.rollNo === rollNumber 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-[#13ad89]">#{index + 1}</span>
                            <div>
                              <p className="font-medium">{topper.name}</p>
                              <p className="text-sm text-gray-500">{topper.rollNo}</p>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total: {topper.totalMarks}</span>
                            <span>{topper.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subject Toppers */}
                  <div>
                    <h3 className="font-medium text-lg mb-3">Subject Toppers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(studentResults.classRankings.subjectToppers).map(([subject, toppers]) => (
                        <div key={subject} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-3">{subject}</h4>
                          <div className="space-y-3">
                            {toppers.map((topper, index) => (
                              <div 
                                key={`${subject}-${index}`}
                                className={`flex justify-between items-center ${
                                  topper.name === studentResults.name ? 'text-[#13ad89] font-medium' : ''
                                }`}
                              >
                                <span>#{index + 1} {topper.name}</span>
                                <span>{topper.marks}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exam Results */}
            <Card>
              <CardHeader>
                <CardTitle>Examination Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exam Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Physics</TableHead>
                        <TableHead>Chemistry</TableHead>
                        <TableHead>Mathematics</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Rank</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentResults.results.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{result.examName}</TableCell>
                          <TableCell>{new Date(result.date).toLocaleDateString()}</TableCell>
                          <TableCell>{result.subjects.Physics}</TableCell>
                          <TableCell>{result.subjects.Chemistry}</TableCell>
                          <TableCell>{result.subjects.Mathematics}</TableCell>
                          <TableCell>{calculateTotal(result.subjects)}</TableCell>
                          <TableCell>{calculatePercentage(result.subjects)}%</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">#{result.rank}</span>
                              <span className="text-sm text-gray-500">of {result.totalStudents}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
