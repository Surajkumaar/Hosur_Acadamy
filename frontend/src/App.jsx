import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/RequireAuth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Gallery from "./pages/Gallery";
import Toppers from "./pages/Toppers";
import Inquiry from "./pages/Inquiry";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import PublishResults from "./pages/PublishResults";
import ManageStudents from "./pages/ManageStudents";
import StudentDashboard from "./pages/StudentDashboard";
import Toaster from "./components/ui/toaster";

const App = () => {
  return (
    <React.StrictMode>
      <div className="App">
        <AuthProvider>
          <BrowserRouter>
            <Header />
            <main className="pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/toppers" element={<Toppers />} />
                <Route path="/inquiry" element={<Inquiry />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/admin" 
                  element={
                    <RequireAuth allowedRoles={['admin']}>
                      <Admin />
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
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </div>
    </React.StrictMode>
  );
}

export default App;
