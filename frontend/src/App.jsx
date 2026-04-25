import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/layout/Layout';

// Mentor Pages
import MentorDashboard from './pages/MentorDashboard';
import MentorStudents from './pages/MentorStudents';
import MentorAnalytics from './pages/MentorAnalytics';
import CounselingManager from './pages/CounselingManager';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentCounseling from './pages/StudentCounseling';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Mentor Routes */}
        <Route 
          path="/mentor/*" 
          element={
            <Layout requiredRole="mentor">
              <Routes>
                <Route path="/" element={<MentorDashboard />} />
                <Route path="/students" element={<MentorStudents />} />
                <Route path="/analytics" element={<MentorAnalytics />} />
                <Route path="/counseling" element={<CounselingManager />} />
                <Route path="*" element={<Navigate to="/mentor" replace />} />
              </Routes>
            </Layout>
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/student/*" 
          element={
            <Layout requiredRole="student">
              <Routes>
                <Route path="/" element={<StudentDashboard />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/counseling" element={<StudentCounseling />} />
                <Route path="*" element={<Navigate to="/student" replace />} />
              </Routes>
            </Layout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
