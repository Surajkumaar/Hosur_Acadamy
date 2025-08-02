import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, Edit2, Trash2, Download } from 'lucide-react';
import StudentFormModal from '../components/StudentFormModal';
import { useToast } from '../hooks/use-toast';
import { 
  db, 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  auth
} from '../lib/firebase';
import { createUserProfile, updateUserProfile } from '../lib/user-profile';
import { useAuth } from '../contexts/AuthContext';

const ManageStudents = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth(); // Get current admin user
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');

  const courses = ['All', 'JEE', 'NEET', 'Board Exams', 'Foundation', 'Machine Learning / Deep Learning /AI'];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log("Fetching students from Firebase...");
        const studentsRef = collection(db, 'users');
        const snapshot = await getDocs(studentsRef);
        
        const studentsList = [];
        snapshot.forEach((doc) => {
          const userData = doc.data();
          // Only include users with student role
          if (userData.role === 'student') {
            studentsList.push({
              id: doc.id,
              name: userData.displayName || userData.name || 'N/A',
              roll_no: userData.rollNumber || userData.roll_no || 'N/A',
              course: userData.course || 'N/A',
              batch: userData.batch || 'N/A',
              email: userData.email || 'N/A',
              phone: userData.phone || 'N/A',
              date_of_birth: userData.dateOfBirth || userData.date_of_birth || 'N/A'
            });
          }
        });
        
        console.log("✅ Students fetched from Firebase:", studentsList);
        setStudents(studentsList);
      } catch (err) {
        console.error("❌ Error fetching students from Firebase:", err);
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to fetch students from Firebase.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = React.useMemo(() => {
    if (!Array.isArray(students)) return [];
    
    return students.filter(student => {
      if (!student) return false;
      
      const searchTermLower = (searchTerm || '').toLowerCase();
      const matchesSearch = (student.name?.toLowerCase().includes(searchTermLower)) ||
                           (student.roll_no?.toLowerCase().includes(searchTermLower)) ||
                           (student.email?.toLowerCase().includes(searchTermLower));

      const matchesCourse = selectedCourse === 'All' || student.course === selectedCourse;
      return matchesSearch && matchesCourse;
    });
  }, [students, searchTerm, selectedCourse]);

  const handleExportCSV = () => {
    // Convert students data to CSV format
    const headers = ['Name', 'Roll Number', 'Course', 'Batch', 'Email', 'Phone', 'Date of Birth'];
    const csvRows = [
      headers.join(','), // Header row
      ...students.map(student => [
        student.name,
        student.roll_no,
        student.course,
        student.batch,
        student.email,
        student.phone,
        student.date_of_birth || 'N/A'
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
      .filter(s => s.roll_no.startsWith(`${year}${courseCode}`)) // Changed to roll_no
      .map(s => parseInt(s.roll_no.slice(-4))); // Changed to roll_no

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
    // Map backend field names to frontend field names for the form
    const mappedStudent = {
      ...student,
      rollNo: student.roll_no // Map roll_no to rollNo for the form
    };
    setSelectedStudent(mappedStudent);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (formMode === 'add') {
      // Handle student creation
      await handleCreateStudent(formData);
    } else {
      // Handle student update
      await handleUpdateStudent(formData);
    }
  };
  
  const handleCreateStudent = async (formData) => {
    try {
      const roll_no = generateRollNumber(formData.course);
      
      console.log("Creating Firebase Auth user for student...");
      
      // Import Firebase functions for creating secondary app
      const { initializeApp } = await import('firebase/app');
      const { getAuth, createUserWithEmailAndPassword } = await import('firebase/auth');
      
      // Create a secondary Firebase app instance to avoid affecting current admin session
      const secondaryAppConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      };
      
      const secondaryApp = initializeApp(secondaryAppConfig, 'secondary');
      const secondaryAuth = getAuth(secondaryApp);
      
      // Create the student account using secondary auth (won't affect admin session)
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.date_of_birth);
      console.log("✅ Firebase Auth user created:", userCredential.user.uid);
      
      // Create user profile in Firestore using main app
      const userProfileData = {
        uid: userCredential.user.uid,
        email: formData.email,
        displayName: formData.name,
        role: 'student',
        rollNumber: roll_no,
        course: formData.course,
        batch: formData.batch,
        phone: formData.phone,
        dateOfBirth: formData.date_of_birth,
        createdAt: new Date().toISOString(),
        createdBy: 'admin'
      };
      
      await createUserProfile(userCredential.user, userProfileData);
      console.log("✅ User profile created in Firestore");
      
      // Cleanup operations (non-critical)
      try {
        await secondaryAuth.signOut();
        console.log("✅ Student signed out from secondary auth");
      } catch (signOutError) {
        console.warn("⚠️ Could not sign out student:", signOutError);
      }
      
      try {
        const { deleteApp } = await import('firebase/app');
        await deleteApp(secondaryApp);
        console.log("✅ Secondary Firebase app cleaned up");
      } catch (cleanupError) {
        console.warn("⚠️ Could not clean up secondary app:", cleanupError);
      }
      
      // Add to local state
      const studentForUI = {
        id: userCredential.user.uid,
        name: formData.name,
        roll_no: roll_no,
        course: formData.course,
        batch: formData.batch,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth
      };
      
      setStudents(prevStudents => [...prevStudents, studentForUI]);
      
      // Show success message
      toast({
        title: "✅ Student Account Created Successfully!",
        description: `Student: ${formData.name} (${roll_no}) created. Login: ${formData.email} | Password: ${formData.date_of_birth}. To test student login, logout from admin and use these credentials.`,
        duration: 10000,
      });
      
      console.log("✅ Student creation completed successfully.");
      setIsFormOpen(false);
      
    } catch (error) {
      console.error("❌ Student creation failed:", error);
      toast({
        title: "Error",
        description: `Failed to create student: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateStudent = async (formData) => {
    try {
      // Update existing student logic here
      await updateUserProfile(selectedStudent.id, {
        displayName: formData.name,
        rollNumber: formData.rollNo || formData.roll_no,
        course: formData.course,
        batch: formData.batch,
        phone: formData.phone,
        dateOfBirth: formData.date_of_birth,
        updatedAt: new Date().toISOString()
      });
      console.log("✅ User profile updated in Firestore");
      
      // Update local state
      setStudents(prevStudents => prevStudents.map(student => 
        student.id === selectedStudent.id ? {
          ...student,
          name: formData.name,
          roll_no: formData.rollNo || formData.roll_no,
          course: formData.course,
          batch: formData.batch,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth
        } : student
      ));
      
      toast({
        title: "Success",
        description: "Student details updated successfully",
      });
      
      setIsFormOpen(false);
      
    } catch (error) {
      console.error("❌ Student update failed:", error);
      toast({
        title: "Error",
        description: `Failed to update student: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student? This will permanently remove their account and cannot be undone.')) {
      try {
        console.log("Deleting student from Firebase:", id);
        
        // First, get the student's email from Firestore before deleting
        const userRef = doc(db, 'users', id);
        const { getDoc } = await import('../lib/firebase');
        const userDoc = await getDoc(userRef);
        const studentData = userDoc.exists() ? userDoc.data() : null;
        
        if (!studentData) {
          throw new Error("Student data not found");
        }
        
        const studentEmail = studentData.email;
        const studentPassword = studentData.dateOfBirth; // We know this is their password
        
        console.log("Found student email:", studentEmail);
        
        // Create a secondary Firebase app to sign in as the student and delete their account
        let authDeleted = false;
        try {
          const { initializeApp } = await import('firebase/app');
          const { getAuth, signInWithEmailAndPassword, deleteUser } = await import('firebase/auth');
          
          // Create secondary app for student deletion
          const secondaryAppConfig = {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
          };
          
          const secondaryApp = initializeApp(secondaryAppConfig, `deleteStudent-${Date.now()}`);
          const secondaryAuth = getAuth(secondaryApp);
          
          // Sign in as the student in secondary auth
          console.log("Signing in as student to delete account...");
          const userCredential = await signInWithEmailAndPassword(secondaryAuth, studentEmail, studentPassword);
          
          // Delete the Firebase Auth user
          console.log("Deleting Firebase Auth user...");
          await deleteUser(userCredential.user);
          console.log("✅ Firebase Auth user deleted successfully");
          authDeleted = true;
          
          // Clean up secondary app (use correct Firebase v9+ method)
          const { deleteApp } = await import('firebase/app');
          await deleteApp(secondaryApp);
          console.log("✅ Secondary Firebase app cleaned up");
          
        } catch (authError) {
          console.warn("⚠️ Could not delete Firebase Auth user:", authError.message);
          console.warn("This might be because:");
          console.warn("1. The student changed their password");
          console.warn("2. The account was already deleted");
          console.warn("3. Network issues");
          console.warn("Proceeding with Firestore deletion only...");
          
          // If the error is that the user is not found, that's actually good
          if (authError.code === 'auth/user-not-found') {
            console.log("✅ Firebase Auth user was already deleted");
            authDeleted = true;
          }
        }
        
        // Delete from Firestore users collection
        console.log("Deleting from Firestore...");
        await deleteDoc(userRef);
        console.log("✅ Student deleted from Firestore");
        
        // Update local state
        setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
        
        console.log("✅ Student completely deleted from Firebase");
        toast({
          title: "Success",
          description: authDeleted 
            ? "Student account completely deleted from both Firebase Auth and Firestore" 
            : "Student deleted from Firestore (Firebase Auth deletion may have failed)",
          variant: authDeleted ? "default" : "destructive",
        });
        
      } catch (err) {
        console.error("❌ Error deleting student:", err);
        toast({
          title: "Error",
          description: `Failed to delete student: ${err.message}`,
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading students...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date of Birth
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
                      {student.roll_no}
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
                      {student.date_of_birth || 'N/A'}
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
                          onClick={() => handleDelete(student.id)}
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