import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/RequireAuth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RefreshWarning from "./components/RefreshWarning";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Gallery from "./pages/Gallery";
import Toppers from "./pages/Toppers";
import Inquiry from "./pages/Inquiry";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import FirebaseTest from "./pages/FirebaseTest";
import FirebaseSetup from "./pages/FirebaseSetup";
import FirebaseDebug from "./pages/FirebaseDebug";
import PublishResults from "./pages/PublishResults";
import ManageStudents from "./pages/ManageStudents";
import StudentDashboard from "./pages/StudentDashboard";
import TestStudentLogin from "./pages/TestStudentLogin";
import SessionTest from "./pages/SessionTest";
import { Toaster } from "./components/ui/toaster";

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <RefreshWarning />
          <main className="pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/toppers" element={<Toppers />} />
                <Route path="/inquiry" element={<Inquiry />} />
                <Route path="/login" element={<Login />} />
                <Route path="/firebase-test" element={<FirebaseTest />} />
                <Route path="/firebase-setup" element={<FirebaseSetup />} />
                <Route path="/firebase-debug" element={<FirebaseDebug />} />
                <Route path="/test-student-login" element={<TestStudentLogin />} />
                <Route 
                  path="/session-test" 
                  element={
                    <RequireAuth allowedRoles={['student', 'admin']}>
                      <SessionTest />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <RequireAuth allowedRoles={['admin']}>
                      <Admin />
                    </RequireAuth>
                  } 
                />
                 <Route 
                  path="/admin/create-student" 
                  element={
                    <RequireAuth allowedRoles={['admin']}>
                      <Register />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/admin/publish-results" 
                  element={
                    <RequireAuth allowedRoles={['admin']}>
                      <PublishResults />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/admin/manage-students" 
                  element={
                    <RequireAuth allowedRoles={['admin']}>
                      <ManageStudents />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/results" 
                  element={
                    <RequireAuth allowedRoles={['student', 'admin']}>
                      <StudentDashboard />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/student-dashboard" 
                  element={
                    <RequireAuth allowedRoles={['student', 'admin']}>
                      <StudentDashboard />
                    </RequireAuth>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </div>
  );
}

export default App;
