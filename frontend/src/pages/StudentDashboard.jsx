import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getStudentResults, getAllResultsForRankings, getSimpleRankingsData, getSubjectToppers, calculateOverallToppers } from '../lib/results-service';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If logged in as student via Firebase, automatically load their results
    if (user?.role === 'student' && user?.rollNumber) {
      setRollNumber(user.rollNumber);
      handleSearch(user.rollNumber);
    }
  }, [user]);

  const handleSearch = async (searchRollNumber = rollNumber) => {
    if (!searchRollNumber.trim()) {
      alert('Please enter a roll number');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      console.log('Searching for student results:', searchRollNumber);
      
      // Try the full approach first, with fallback to basic approach
      let processedResults = null;
      
      try {
        const { studentInfo, results } = await getStudentResults(searchRollNumber);
        
        if (!studentInfo || results.length === 0) {
          setStudentResults(null);
          return;
        }

        // Get rankings data for the student's course and batch (with multiple fallbacks)
        let rankingsData = null;
        try {
          rankingsData = await getAllResultsForRankings(studentInfo.course, studentInfo.batch);
        } catch (rankingsError) {
          console.warn('Primary rankings fetch failed, trying simple method:', rankingsError);
          try {
            rankingsData = await getSimpleRankingsData(studentInfo.course, studentInfo.batch);
          } catch (simpleError) {
            console.warn('Simple rankings fetch also failed, continuing without rankings:', simpleError);
          }
        }
        
        // Process the results to match the expected format
        processedResults = {
          name: studentInfo.name,
          rollNumber: studentInfo.rollNumber,
          course: studentInfo.course,
          batch: studentInfo.batch,
          results: results.map(result => ({
            examName: result.examName,
            date: result.examDate,
            subjects: result.subjects,
            rank: result.rank,
            totalStudents: result.totalStudents,
            totalMarks: result.totalMarks,
            percentage: result.percentage
          })),
          overallStats: calculateOverallStats(results, rankingsData, searchRollNumber),
          classRankings: calculateClassRankings(rankingsData, searchRollNumber)
        };
        
      } catch (fullError) {
        console.warn('Full approach failed, trying basic approach:', fullError);
        processedResults = await getBasicStudentData(searchRollNumber);
      }

      setStudentResults(processedResults);
      
    } catch (err) {
      console.error('Error fetching student results:', err);
      setError('Failed to fetch results. Please try again.');
      setStudentResults(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallStats = (results, rankingsData, rollNumber) => {
    if (!results || results.length === 0) {
      return {
        currentRank: 'N/A',
        previousRank: 'N/A',
        batchStrength: 'N/A',
        averageScore: 'N/A',
        subjectRanks: {
          Physics: 'N/A',
          Chemistry: 'N/A',
          Mathematics: 'N/A'
        },
        improvement: {
          Physics: 'N/A',
          Chemistry: 'N/A', 
          Mathematics: 'N/A'
        }
      };
    }

    const latestResult = results[0]; // Most recent result
    const previousResult = results[1]; // Previous result if exists
    
    // Calculate subject ranks if we have rankings data
    const subjectRanks = calculateSubjectRanks(rankingsData, rollNumber);
    const improvement = calculateImprovement(results);
    
    return {
      currentRank: latestResult.rank || 'N/A',
      previousRank: previousResult?.rank || 'N/A',
      batchStrength: latestResult.totalStudents || 'N/A',
      averageScore: latestResult.percentage || 'N/A',
      subjectRanks,
      improvement
    };
  };

  const calculateSubjectRanks = (rankingsData, rollNumber) => {
    if (!rankingsData || !rankingsData.results) {
      return {
        Physics: 'N/A',
        Chemistry: 'N/A',
        Mathematics: 'N/A'
      };
    }

    const subjects = ['Physics', 'Chemistry', 'Mathematics'];
    const subjectRanks = {};

    subjects.forEach(subject => {
      const subjectKey = subject.toLowerCase();
      const sortedBySubject = rankingsData.results
        .filter(result => result[subjectKey] > 0)
        .sort((a, b) => (b[subjectKey] || 0) - (a[subjectKey] || 0));
      
      const studentIndex = sortedBySubject.findIndex(result => 
        result.rollNumber === rollNumber
      );
      
      subjectRanks[subject] = studentIndex >= 0 ? studentIndex + 1 : 'N/A';
    });

    return subjectRanks;
  };

  const calculateImprovement = (results) => {
    if (results.length < 2) {
      return {
        Physics: 'N/A',
        Chemistry: 'N/A',
        Mathematics: 'N/A'
      };
    }

    const latest = results[0].subjects;
    const previous = results[1].subjects;
    const improvement = {};

    Object.keys(latest).forEach(subject => {
      const latestMark = latest[subject] || 0;
      const previousMark = previous[subject] || 0;
      
      if (previousMark > 0) {
        const change = ((latestMark - previousMark) / previousMark) * 100;
        improvement[subject] = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
      } else {
        improvement[subject] = 'N/A';
      }
    });

    return improvement;
  };

  const calculateClassRankings = (rankingsData, rollNumber) => {
    // If no rankings data available, return basic structure
    if (!rankingsData || !rankingsData.results) {
      return {
        toppers: [],
        studentPosition: 'N/A',
        totalStudents: 'N/A',
        subjectToppers: {
          Physics: [],
          Chemistry: [],
          Mathematics: []
        }
      };
    }

    // Get overall toppers
    const toppers = calculateOverallToppers(rankingsData.results);

    // Calculate student position
    const sortedResults = rankingsData.results
      .filter(result => result.rank)
      .sort((a, b) => parseInt(a.rank) - parseInt(b.rank));

    const studentPosition = sortedResults.findIndex(result => 
      result.rollNumber === rollNumber
    ) + 1;

    // Get subject toppers
    const subjectToppers = {
      Physics: getSubjectToppers(rankingsData.results, 'Physics'),
      Chemistry: getSubjectToppers(rankingsData.results, 'Chemistry'),
      Mathematics: getSubjectToppers(rankingsData.results, 'Mathematics')
    };

    return {
      toppers,
      studentPosition: studentPosition || 'N/A',
      totalStudents: rankingsData.results.length,
      subjectToppers
    };
  };

  // Simplified version that works without rankings
  const getBasicStudentData = async (searchRollNumber) => {
    try {
      const { studentInfo, results } = await getStudentResults(searchRollNumber);
      
      if (!studentInfo || results.length === 0) {
        return null;
      }

      // Create basic results without complex rankings
      return {
        name: studentInfo.name,
        rollNumber: studentInfo.rollNumber,
        course: studentInfo.course,
        batch: studentInfo.batch,
        results: results.map(result => ({
          examName: result.examName,
          date: result.examDate,
          subjects: result.subjects,
          rank: result.rank,
          totalStudents: result.totalStudents,
          totalMarks: result.totalMarks,
          percentage: result.percentage
        })),
        overallStats: {
          currentRank: results[0]?.rank || 'N/A',
          previousRank: results[1]?.rank || 'N/A',
          batchStrength: results[0]?.totalStudents || 'N/A',
          averageScore: results[0]?.percentage || 'N/A',
          subjectRanks: {
            Physics: 'N/A',
            Chemistry: 'N/A',
            Mathematics: 'N/A'
          },
          improvement: {
            Physics: 'N/A',
            Chemistry: 'N/A',
            Mathematics: 'N/A'
          }
        },
        classRankings: {
          toppers: [],
          studentPosition: results[0]?.rank || 'N/A',
          totalStudents: results[0]?.totalStudents || 'N/A',
          subjectToppers: {
            Physics: [],
            Chemistry: [],
            Mathematics: []
          }
        }
      };
    } catch (error) {
      console.error('Error in basic student data fetch:', error);
      throw error;
    }
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
                onClick={() => handleSearch()}
                disabled={loading}
                className="bg-[#13ad89] hover:bg-[#0f8c6d]"
              >
                {loading ? 'Searching...' : 'View Results'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results Display */}
        {searchPerformed && !loading && !studentResults && !error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <p className="text-red-600 font-medium">No results found for roll number: "{rollNumber}"</p>
                <div className="text-sm text-red-500">
                  <p className="font-medium mb-2">Possible reasons:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>No exam results have been published yet</li>
                    <li>Your roll number might be different</li>
                    <li>Results for your exam/batch haven't been uploaded</li>
                  </ul>
                  <p className="mt-3 text-blue-600">
                    💡 Check the browser console for available roll numbers or contact your admin.
                  </p>
                </div>
              </div>
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
