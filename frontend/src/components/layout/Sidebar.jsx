import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Calendar, Menu, LogOut, GraduationCap } from 'lucide-react';

const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const navItems = role === 'mentor' ? [
    { name: 'Dashboard', path: '/mentor', icon: LayoutDashboard },
    { name: 'Students', path: '/mentor/students', icon: Users },
    { name: 'Analytics', path: '/mentor/analytics', icon: BarChart3 },
    { name: 'Counseling', path: '/mentor/counseling', icon: Calendar }
  ] : [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'My Profile', path: '/student/profile', icon: Users },
    { name: 'Counseling', path: '/student/counseling', icon: Calendar }
  ];

  return (
    <div className={`bg-slate-900/80 backdrop-blur-2xl border-r border-cyan-500/10 h-screen transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'} fixed left-0 top-0 z-20`}>
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-cyan-500/10">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="HDS Logo" className="h-10 object-contain" />
            <span className="text-cyan-400 font-black text-xl tracking-tighter glow-text">HDS</span>
          </div>
        )}
        {collapsed && <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain mx-auto" />}
        
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1.5 rounded-xl hover:bg-slate-800 text-cyan-400 transition-all absolute right-[-14px] top-7 bg-slate-900 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-8 flex flex-col gap-2 px-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/mentor' || item.path === '/student'}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm tracking-tight ${
                isActive 
                  ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02]' 
                  : 'text-slate-500 hover:bg-cyan-500/10 hover:text-cyan-400'
              }`
            }
            title={collapsed ? item.name : ''}
          >
            <item.icon className={`w-5 h-5 ${!collapsed && 'mr-3'}`} strokeWidth={isActive => isActive ? 3 : 2} />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* Bottom Area */}
      <div className="p-6 border-t border-cyan-500/10">
        <button 
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} w-full px-4 py-3.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all duration-300 font-bold text-sm`}
          title={collapsed ? "Logout" : ""}
        >
          <LogOut className={`w-5 h-5 ${!collapsed && 'mr-3'}`} />
          {!collapsed && <span>System Shutdown</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
