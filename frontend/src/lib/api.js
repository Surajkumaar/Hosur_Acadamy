const API_BASE_URL = 'http://localhost:8000/api';

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Something went wrong');
    }
    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Authentication
export const login = (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  return request('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });
};

export const logout = () => request('/logout', { method: 'POST' });
export const getUser = () => request('/user');

// Students
export const getStudents = () => request('/students');
export const addStudent = (studentData) => request('/students', { method: 'POST', body: JSON.stringify(studentData) });
export const updateStudent = (id, studentData) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(studentData) });
export const deleteStudent = (id) => request(`/students/${id}`, { method: 'DELETE' });
export const getStudentDashboard = () => request('/students/me');

// Courses
export const getCourses = () => request('/courses');

// Results
export const publishResults = (resultData) => request('/results', { method: 'POST', body: JSON.stringify(resultData) });
export const getResults = () => request('/results');

// Inquiries
export const submitInquiry = (inquiryData) => request('/inquiries', { method: 'POST', body: JSON.stringify(inquiryData) });

// Toppers
export const getToppers = () => request('/toppers');

// Gallery
export const getGallery = () => request('/gallery');
