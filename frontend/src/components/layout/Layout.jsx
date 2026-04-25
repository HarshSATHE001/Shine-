import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import axios from 'axios';

const Layout = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    if (!token) {
      navigate('/');
      return;
    }

    if (requiredRole && role !== requiredRole) {
      navigate('/');
      return;
    }

    // In a real app we'd fetch the user profile here, but we can rely on local storage for now or simple API call
    setUser({ id: userId, role: role, name: 'Current User' }); // Using generic for now, we'll fetch real name below
    
    setLoading(false);
  }, [navigate, requiredRole]);

  if (loading) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="flex bg-[#020617] min-h-screen font-sans text-slate-100 overflow-hidden relative">
      <div className="hud-scanline"></div>
      <Sidebar role={user?.role} />
      <div className="flex-1 ml-64 flex flex-col transition-all duration-300 relative z-10">
        <Navbar role={user?.role} userName={user?.name} />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
