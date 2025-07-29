import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, Edit2, Trash2, Download } from 'lucide-react';
import StudentFormModal from '../components/StudentFormModal';
import { useToast } from '../hooks/use-toast';

const ManageStudents = () => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Kavishri A N S',
      rollNo: '9444423915',
      course: 'Machine Learning / Deep Learning /AI',
      batch: '2025',
      email: 'kavishri@example.com',
      phone: '9876543210'
    },
    // Add more mock data as needed
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');

  const courses = ['All', 'JEE', 'NEET', 'Board Exams', 'Foundation', 'Machine Learning / Deep Learning /AI'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.includes(searchTerm) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'All' || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handleExportCSV = () => {
    // Convert students data to CSV format
    const headers = ['Name', 'Roll Number', 'Course', 'Batch', 'Email', 'Phone'];
    const csvRows = [
      headers.join(','), // Header row
      ...students.map(student => [
        student.name,
        student.rollNo,
        student.course,
        student.batch,
        student.email,
        student.phone
      ].map(field => `"${field}"`).join(',')) // Wrap fields in quotes to handle commas in data
    ];
    const csvString = csvRows.join('\n');

    // Create a Blob and download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Students data exported successfully",
      });
    }
  };

  const generateRollNumber = (course) => {
    const year = new Date().getFullYear();
    const courseCode = {
      'JEE': 'JEE',
      'NEET': 'NET',
      'Board Exams': 'BRD',
      'Foundation': 'FDN',
      'Machine Learning / Deep Learning /AI': 'MLA'
    }[course] || 'STD';

    // Filter existing roll numbers for the same course and year
    const existingRollNumbers = students
      .filter(s => s.rollNo.startsWith(`${year}${courseCode}`))
      .map(s => parseInt(s.rollNo.slice(-4)));

    // Find the next available number
    let sequentialNumber = 1;
    while (existingRollNumbers.includes(sequentialNumber)) {
      sequentialNumber++;
    }

    // Format: YYYYCCC0001 (Year + Course Code + 4-digit sequential number)
    return `${year}${courseCode}${String(sequentialNumber).padStart(4, '0')}`;
  };

  const handleAddClick = () => {
    setSelectedStudent(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (formMode === 'add') {
      const rollNo = generateRollNumber(formData.course);
      const newStudent = {
        id: Date.now(), // temporary ID generation
        ...formData,
        rollNo
      };
      setStudents([...students, newStudent]);
      toast({
        title: "Success",
        description: "Student added successfully",
      });
    } else {
      setStudents(students.map(student => 
        student.id === selectedStudent.id ? { ...student, ...formData } : student
      ));
      toast({
        title: "Success",
        description: "Student details updated successfully",
      });
    }
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button 
                  className="bg-[#13ad89] hover:bg-[#0f8c6d] flex items-center gap-2"
                  onClick={handleAddClick}
                >
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, roll number, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:ring-[#13ad89] focus:border-[#13ad89]"
                >
                  {courses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.rollNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.batch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{student.email}</div>
                      <div>{student.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex justify-center gap-3">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                          onClick={() => handleEditClick(student)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Form Modal */}
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedStudent}
        mode={formMode}
      />
    </div>
  );
};

export default ManageStudents;
