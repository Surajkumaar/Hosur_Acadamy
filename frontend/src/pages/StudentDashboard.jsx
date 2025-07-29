import React, { useState, useEffect } from 'react';
import { Check, X, Award, TrendingUp, Target, Trophy } from 'lucide-react';

// Mock data - replace with API call
const mockStudentData = {
  name: 'John Doe',
  studentId: 'HA-12345',
  course: '12th Grade - State Board',
  batch: '2024-2025',
  profilePicture: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  results: [
    {
      examName: 'Quarterly Exam',
      examDate: '2024-09-15',
      subjects: [
        { name: 'Tamil', marks: 85, total: 100 },
        { name: 'English', marks: 92, total: 100 },
        { name: 'Mathematics', marks: 78, total: 100 },
        { name: 'Science', marks: 88, total: 100 },
        { name: 'Social Science', marks: 95, total: 100 },
      ],
      totalMarks: 438,
      rank: 5,
      status: 'Pass',
    },
    {
      examName: 'Half-Yearly Exam',
      examDate: '2024-12-20',
      subjects: [
        { name: 'Tamil', marks: 88, total: 100 },
        { name: 'English', marks: 90, total: 100 },
        { name: 'Mathematics', marks: 82, total: 100 },
        { name: 'Science', marks: 91, total: 100 },
        { name: 'Social Science', marks: 96, total: 100 },
      ],
      totalMarks: 447,
      rank: 3,
      status: 'Pass',
    },
  ],
};

const mockRankings = {
  'Quarterly Exam': [
    { rank: 1, name: 'Alice Johnson', marks: 480, profile: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    { rank: 2, name: 'Bob Williams', marks: 465, profile: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    { rank: 3, name: 'John Doe', marks: 438, profile: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { rank: 4, name: 'Charlie Brown', marks: 432, profile: 'https://i.pravatar.cc/150?u=a042581f4e29026704g' },
    { rank: 5, name: 'Diana Miller', marks: 420, profile: 'https://i.pravatar.cc/150?u=a042581f4e29026704h' },
  ],
  'Half-Yearly Exam': [
    { rank: 1, name: 'Alice Johnson', marks: 480, profile: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    { rank: 2, name: 'Bob Williams', marks: 465, profile: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    { rank: 3, name: 'John Doe', marks: 447, profile: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { rank: 4, name: 'Charlie Brown', marks: 442, profile: 'https://i.pravatar.cc/150?u=a042581f4e29026704g' },
    { rank: 5, name: 'Diana Miller', marks: 438, profile: 'https://i.pravatar.cc/150?u=a042581f4e29026704h' },
    { rank: 6, name: 'Eve Davis', marks: 430, profile: 'https://i.pravatar.cc/150?u=a042581f4e29026704i' },
    { rank: 7, name: 'Frank White', marks: 421, profile: 'https://i.pravatar.cc/150?u=a042581f4e29026704j' },
  ]
};

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(mockStudentData);
  const [selectedExam, setSelectedExam] = useState(mockStudentData.results[1]);
  const [rankings, setRankings] = useState(mockRankings[selectedExam.examName]);

  useEffect(() => {
    setRankings(mockRankings[selectedExam.examName]);
  }, [selectedExam]);

  const getStatusIcon = (status) => {
    return status === 'Pass' ? 
      <Check className="h-5 w-5 text-green-500" /> : 
      <X className="h-5 w-5 text-red-500" />;
  };

  const getRankColor = (rank) => {
    if (rank <= 3) return 'text-yellow-500';
    if (rank <= 10) return 'text-blue-500';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Student Info Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex items-center space-x-6">
          <img 
            src={studentData.profilePicture} 
            alt="Student Profile" 
            className="w-24 h-24 rounded-full border-4 border-blue-200"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{studentData.name}</h1>
            <p className="text-md text-gray-600">{studentData.course} ({studentData.batch})</p>
            <p className="text-sm text-gray-500">ID: {studentData.studentId}</p>
          </div>
        </div>

        {/* Exam Selection Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200">
            {studentData.results.map((exam) => (
              <button
                key={exam.examName}
                onClick={() => setSelectedExam(exam)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  selectedExam.examName === exam.examName
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {exam.examName}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Exam Details & Rankings */}
        {selectedExam && (
          <>
            {/* Performance Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Performance Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50">
                  <Target className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-500">Total Marks</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedExam.totalMarks}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-yellow-50">
                  <Award className="h-8 w-8 text-yellow-600 mb-2" />
                  <p className="text-sm text-gray-500">Rank</p>
                  <p className={`text-2xl font-bold ${getRankColor(selectedExam.rank)}`}>{selectedExam.rank}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50">
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedExam.status)}
                    <p className="text-xl font-bold text-gray-800">{selectedExam.status}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Marksheet */}
              <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedExam.examName} - Marksheet</h2>
                <p className="text-sm text-gray-500 mb-6">Date: {selectedExam.examDate}</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedExam.subjects.map((subject) => (
                        <tr key={subject.name}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{subject.marks}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rankings Section */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Trophy className="h-6 w-6 text-yellow-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Class Rankings</h2>
                </div>
                <ul className="space-y-3 h-[400px] overflow-y-auto">
                  {rankings.map((student) => (
                    <li
                      key={student.rank}
                      className={`p-3 rounded-lg flex items-center transition-all ${student.name === studentData.name ? 'bg-blue-100 scale-105 shadow' : 'bg-gray-50'}`}
                    >
                      <span className={`text-lg font-bold w-10 ${getRankColor(student.rank)}`}>{student.rank}</span>
                      <img src={student.profile} alt={student.name} className="w-10 h-10 rounded-full mr-4" />
                      <span className="text-md font-medium text-gray-800">{student.name}</span>
                      <span className="ml-auto text-lg font-semibold text-gray-700">{student.marks}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;