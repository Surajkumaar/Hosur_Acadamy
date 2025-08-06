import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Trash2, Eye, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  db, 
  collection, 
  getDocs, 
  doc, 
  deleteDoc,
  orderBy,
  query
} from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const ManageResults = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [publishedResults, setPublishedResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedResults, setSelectedResults] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const courses = ['All', 'JEE', 'NEET', 'Board Exams', 'Foundation'];

  useEffect(() => {
    fetchPublishedResults();
  }, []);

  const fetchPublishedResults = async () => {
    try {
      setLoading(true);
      console.log("Fetching published results from Firebase...");
      
      const resultsRef = collection(db, 'examResults');
      const q = query(resultsRef, orderBy('publishedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const resultsList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        resultsList.push({
          id: doc.id,
          examName: data.examName || 'Untitled Exam',
          examDate: data.examDate || 'Unknown Date',
          course: data.course || 'Unknown Course',
          batch: data.batch || 'Unknown Batch',
          publishedAt: data.publishedAt || 'Unknown Date',
          publishedBy: data.publishedBy || 'Unknown',
          totalStudents: data.results?.length || 0,
          resultsData: data.results || []
        });
      });
      
      console.log("✅ Published results fetched:", resultsList);
      setPublishedResults(resultsList);
    } catch (err) {
      console.error("❌ Error fetching published results:", err);
      toast({
        title: "Error",
        description: "Failed to fetch published results from Firebase.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = React.useMemo(() => {
    if (!Array.isArray(publishedResults)) return [];
    
    return publishedResults.filter(result => {
      if (!result) return false;
      
      const searchTermLower = (searchTerm || '').toLowerCase();
      const matchesSearch = (result.examName?.toLowerCase().includes(searchTermLower)) ||
                           (result.course?.toLowerCase().includes(searchTermLower)) ||
                           (result.batch?.toLowerCase().includes(searchTermLower));

      const matchesCourse = selectedCourse === 'All' || result.course === selectedCourse;
      return matchesSearch && matchesCourse;
    });
  }, [publishedResults, searchTerm, selectedCourse]);

  const handleDeleteResult = async (resultId, examName, totalStudents) => {
    const confirmMessage = `⚠️ PERMANENT DELETION WARNING ⚠️

Are you sure you want to delete "${examName}"?

This will permanently remove:
• All ${totalStudents} student results for this exam
• All ranking and performance data
• Historical records and analytics

This action CANNOT be undone!

Type "DELETE" (in capitals) to confirm:`;
    
    const userInput = prompt(confirmMessage);
    
    if (userInput === "DELETE") {
      try {
        console.log("Deleting exam result:", resultId);
        
        // Delete from Firebase
        await deleteDoc(doc(db, 'examResults', resultId));
        
        // Update local state
        setPublishedResults(prevResults => prevResults.filter(result => result.id !== resultId));
        
        // Clear selection if this result was selected
        setSelectedResults(prev => prev.filter(id => id !== resultId));
        
        // Trigger dashboard refresh by setting a localStorage flag
        localStorage.setItem('admin_dashboard_refresh', Date.now().toString());
        window.dispatchEvent(new Event('storage'));
        
        console.log("✅ Exam result deleted successfully");
        toast({
          title: "Success",
          description: `Exam result "${examName}" and all ${totalStudents} student results have been permanently deleted.`,
        });
        
      } catch (error) {
        console.error("❌ Failed to delete exam result:", error);
        toast({
          title: "Error",
          description: `Failed to delete exam result: ${error.message}`,
          variant: "destructive"
        });
      }
    } else if (userInput !== null) {
      // User entered something but not "DELETE"
      toast({
        title: "Deletion Cancelled",
        description: "You must type 'DELETE' exactly to confirm deletion.",
        variant: "destructive"
      });
    }
    // If userInput is null, user clicked cancel - do nothing
  };

  const handleBulkDelete = async () => {
    if (selectedResults.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one result to delete.",
        variant: "destructive"
      });
      return;
    }

    const selectedExams = publishedResults.filter(result => selectedResults.includes(result.id));
    const totalStudentsAffected = selectedExams.reduce((sum, exam) => sum + exam.totalStudents, 0);

    const confirmMessage = `⚠️ BULK DELETION WARNING ⚠️

You are about to delete ${selectedResults.length} exam result(s):

${selectedExams.map(exam => `• ${exam.examName} (${exam.totalStudents} students)`).join('\n')}

This will permanently remove:
• All results for ${totalStudentsAffected} student entries
• All ranking and performance data
• Historical records and analytics

This action CANNOT be undone!

Type "DELETE ALL" (in capitals) to confirm:`;

    const userInput = prompt(confirmMessage);

    if (userInput === "DELETE ALL") {
      try {
        console.log("Bulk deleting exam results:", selectedResults);
        
        // Delete all selected results
        const deletePromises = selectedResults.map(resultId => 
          deleteDoc(doc(db, 'examResults', resultId))
        );
        
        await Promise.all(deletePromises);
        
        // Update local state
        setPublishedResults(prevResults => 
          prevResults.filter(result => !selectedResults.includes(result.id))
        );
        
        // Clear selection
        setSelectedResults([]);
        setSelectAll(false);
        
        // Trigger dashboard refresh
        localStorage.setItem('admin_dashboard_refresh', Date.now().toString());
        window.dispatchEvent(new Event('storage'));
        
        console.log("✅ Bulk deletion completed successfully");
        toast({
          title: "Success",
          description: `${selectedExams.length} exam results and ${totalStudentsAffected} student entries have been permanently deleted.`,
        });
        
      } catch (error) {
        console.error("❌ Failed to bulk delete exam results:", error);
        toast({
          title: "Error",
          description: `Failed to delete exam results: ${error.message}`,
          variant: "destructive"
        });
      }
    } else if (userInput !== null) {
      toast({
        title: "Deletion Cancelled",
        description: "You must type 'DELETE ALL' exactly to confirm bulk deletion.",
        variant: "destructive"
      });
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedResults(filteredResults.map(result => result.id));
    } else {
      setSelectedResults([]);
    }
  };

  const handleSelectResult = (resultId, checked) => {
    if (checked) {
      setSelectedResults(prev => [...prev, resultId]);
    } else {
      setSelectedResults(prev => prev.filter(id => id !== resultId));
      setSelectAll(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown Date';
      
      // Handle ISO string format
      if (dateString.includes('T')) {
        return new Date(dateString).toLocaleDateString();
      }
      
      // Handle date-only format
      return new Date(dateString + 'T00:00:00').toLocaleDateString();
    } catch (error) {
      return dateString || 'Unknown Date';
    }
  };

  const formatDateTime = (dateString) => {
    try {
      if (!dateString) return 'Unknown Date';
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString || 'Unknown Date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0052CC] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading published results...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Link to="/admin" className="text-gray-600 hover:text-gray-800">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Manage Published Results</h1>
                  <p className="text-sm text-gray-600 mt-1">View and delete previously published exam results</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Deletion is permanent and cannot be undone</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by exam name, course, or batch..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                  >
                    {courses.map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
              </div>
              {selectedResults.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedResults.length} selected
                  </span>
                  <Button
                    onClick={handleBulkDelete}
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-[#0052CC] focus:ring-[#0052CC]"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course & Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      {searchTerm || selectedCourse !== 'All' 
                        ? 'No results match your search criteria' 
                        : 'No published results found'}
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedResults.includes(result.id)}
                          onChange={(e) => handleSelectResult(result.id, e.target.checked)}
                          className="rounded border-gray-300 text-[#0052CC] focus:ring-[#0052CC]"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{result.examName}</div>
                          <div className="text-sm text-gray-500">Exam Date: {formatDate(result.examDate)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{result.course}</div>
                        <div className="text-sm text-gray-500">Batch: {result.batch}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{result.totalStudents} students</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDateTime(result.publishedAt)}</div>
                        <div className="text-sm text-gray-500">by {result.publishedBy}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex justify-center gap-3">
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete Result"
                            onClick={() => handleDeleteResult(result.id, result.examName, result.totalStudents)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filteredResults.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredResults.length} of {publishedResults.length} published results
                </div>
                <div className="text-sm text-gray-500">
                  Total students across all results: {publishedResults.reduce((sum, result) => sum + result.totalStudents, 0)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageResults;
