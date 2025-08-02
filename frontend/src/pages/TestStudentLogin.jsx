import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const TestStudentLogin = () => {
  const [testData, setTestData] = useState({
    email: '',
    date_of_birth: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/test-student-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Student Login</h1>
          
          <form onSubmit={handleTest} className="space-y-4">
            <div>
              <Label htmlFor="email">Student Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={testData.email}
                onChange={handleChange}
                placeholder="Enter student email"
                required
              />
            </div>

            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={testData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#13ad89] hover:bg-[#0f8c6d]"
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test Login Credentials'}
            </Button>
          </form>

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? 'Success!' : 'Failed!'}
              </h3>
              <p className={`mt-1 text-sm ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message}
              </p>
              {result.student && (
                <div className="mt-3 text-sm text-green-700">
                  <p><strong>Student Details:</strong></p>
                  <p>Name: {result.student.name}</p>
                  <p>Email: {result.student.email}</p>
                  <p>Roll No: {result.student.roll_no}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800">How to Test:</h3>
            <ol className="mt-2 text-sm text-blue-700 list-decimal list-inside space-y-1">
              <li>Go to Admin → Manage Students</li>
              <li>Add a new student with email and date of birth</li>
              <li>Come back here and test the credentials</li>
              <li>If successful, try logging in with those credentials on the login page</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestStudentLogin;
