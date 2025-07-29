import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

const ResultsPreview = ({ examDetails, results, headers, onClose, onConfirm }) => {
  console.log('ResultsPreview received:', { headers, results });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Preview Results</h2>
            <div className="flex items-center gap-3">
              <Button
                onClick={onConfirm}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Publish
              </Button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Exam Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Exam Name</p>
                <p className="text-base text-gray-900">{examDetails.examName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Exam Date</p>
                <p className="text-base text-gray-900">{examDetails.examDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Course</p>
                <p className="text-base text-gray-900">{examDetails.course}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Batch</p>
                <p className="text-base text-gray-900">{examDetails.batch}</p>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="mb-6 overflow-auto max-h-[50vh]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Results ({results.length} students)</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Array.isArray(headers) && headers.map((header, index) => (
                    <th 
                      key={index}
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.label || header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(results) && results.map((result, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {Array.isArray(headers) && headers.map((header, colIndex) => {
                      const value = result[header.label || header];
                      return (
                        <td 
                          key={`${rowIndex}-${colIndex}`}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {value !== undefined ? value.toString() : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note Section */}
          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                Please review all the details carefully. Once published, these results will be visible to students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPreview;
