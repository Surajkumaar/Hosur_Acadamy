import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Upload } from 'lucide-react';
import ResultsPreview from '../components/ResultsPreview';
import * as XLSX from 'xlsx';

const PublishResults = () => {
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState({
    examName: '',
    examDate: '',
    course: 'JEE',
    batch: ''
  });

  const [results, setResults] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [tableHeaders, setTableHeaders] = useState([]);

  const courses = ['JEE', 'NEET', 'Board Exams', 'Foundation'];

  const handleExamDetailsChange = (e) => {
    const { name, value } = e.target;
    setExamDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Read data with headers as objects
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length === 0) {
            throw new Error('No data found in the file');
          }

          // Get column headers from first row
          const fileHeaders = Object.keys(jsonData[0]);
          
          // Prepare headers for the table
          const tableHeaders = fileHeaders.map(header => ({
            key: header.toLowerCase().replace(/\s+/g, '_'),
            label: header
          }));

          // Find marks/score column for sorting
          const marksHeader = fileHeaders.find(header => 
            header.toLowerCase().includes('mark') || 
            header.toLowerCase().includes('score')
          ) || fileHeaders[0];

          // Format and sort the data
          const formattedData = jsonData
            .map(row => {
              const formattedRow = {};
              fileHeaders.forEach(header => {
                if (header === marksHeader) {
                  // Convert marks to number
                  formattedRow[header] = parseInt(row[header] || '0', 10);
                } else {
                  formattedRow[header] = row[header] || '';
                }
              });
              return formattedRow;
            })
            .sort((a, b) => b[marksHeader] - a[marksHeader]);

          // Add ranks to sorted data
          const finalData = formattedData.map((row, index) => ({
            ...row,
            'Rank': (index + 1).toString()
          }));

          // Add Rank header if not present
          if (!tableHeaders.some(h => h.label === 'Rank')) {
            tableHeaders.push({ key: 'rank', label: 'Rank' });
          }

          console.log('Table Headers:', tableHeaders);
          console.log('Final Data:', finalData);

          // Update state
          setTableHeaders(tableHeaders);
          setResults(finalData);
          setFileUploaded(true);
          setShowPreview(true);
        } catch (error) {
          alert('Error processing file. Please make sure it\'s a valid Excel/CSV file with proper columns.');
          console.error('File processing error:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const [showPreview, setShowPreview] = useState(false);

  const handlePublish = async () => {
    if (results.length === 0) {
      alert('Please upload results before publishing');
      return;
    }
    try {
      const fullResultData = {
        exam_name: examDetails.examName,
        exam_date: examDetails.examDate,
        course: examDetails.course,
        batch: examDetails.batch,
        results: results,
      };
      await apiPublishResults(fullResultData);
      alert('Results published successfully!');
      navigate('/admin');
    } catch (error) {
      alert(`Failed to publish results: ${error.message}`);
      console.error('Publish results error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Publish Exam Results</h1>

          <form onSubmit={handlePublish} className="space-y-6">
            {/* Exam Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Exam Name
                </label>
                <input
                  type="text"
                  name="examName"
                  value={examDetails.examName}
                  onChange={handleExamDetailsChange}
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#13ad89] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Exam Date
                </label>
                <input
                  type="date"
                  name="examDate"
                  value={examDetails.examDate}
                  onChange={handleExamDetailsChange}
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#13ad89] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course
                </label>
                <select
                  name="course"
                  value={examDetails.course}
                  onChange={handleExamDetailsChange}
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#13ad89] focus:border-transparent"
                  required
                >
                  {courses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Batch
                </label>
                <input
                  type="text"
                  name="batch"
                  value={examDetails.batch}
                  onChange={handleExamDetailsChange}
                  placeholder="e.g., 2025"
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#13ad89] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Results (Excel/CSV)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#13ad89] hover:text-[#0f8c6d]">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="sr-only"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">Excel or CSV files only</p>
                </div>
              </div>
            </div>

            {/* Results will be loaded from the uploaded file */}

            {/* Preview/Submit Section */}
            <div className="mt-6">
              {fileUploaded ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">File uploaded successfully. Click Preview to review the results.</p>
                  <Button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className="w-full bg-[#13ad89] hover:bg-[#0f8c6d] text-white py-3 rounded-lg transition-colors text-lg font-medium"
                  >
                    Preview
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">Please upload a file to continue</p>
                </div>
              )}
            </div>
          </form>

          {/* Preview Modal */}
          {showPreview && results.length > 0 && (
            <ResultsPreview
              examDetails={examDetails}
              results={results}
              headers={tableHeaders}
              onClose={() => setShowPreview(false)}
              onConfirm={handlePublish}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishResults;
