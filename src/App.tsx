
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminStudentDetail from "./pages/admin/AdminStudentDetail";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCourseDetail from "./pages/admin/AdminCourseDetail";

// Private Route component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("auth_token") !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Admin Route component - only allows users with admin role
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("auth_token") !== null;
  const userRole = localStorage.getItem("user_role");
  return isAuthenticated && userRole === "Admin" ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin/login" />
  );
};

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Student Private Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/courses" 
                element={
                  <PrivateRoute>
                    <Courses />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/courses/:courseId" 
                element={
                  <PrivateRoute>
                    <CourseDetail />
                  </PrivateRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/students" 
                element={
                  <AdminRoute>
                    <AdminStudents />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/students/:studentId" 
                element={
                  <AdminRoute>
                    <AdminStudentDetail />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/courses" 
                element={
                  <AdminRoute>
                    <AdminCourses />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/courses/:courseId" 
                element={
                  <AdminRoute>
                    <AdminCourseDetail />
                  </AdminRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
