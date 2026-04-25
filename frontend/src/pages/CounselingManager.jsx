import API_BASE_URL from '../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';

const CounselingManager = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('${API_BASE_URL}/counseling', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    // We would need a backend endpoint for this. For now, let's mock the update.
    alert(`Updating session ${id} to ${status}`);
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Counseling Center</h1>
          <p className="text-slate-500 font-medium mt-1">Manage student intervention sessions and records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           {loading ? (
             <div className="flex justify-center py-20">
               <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
           ) : sessions.length > 0 ? (
             sessions.map((session, i) => (
               <div key={i} className="glass-card p-6 flex items-start space-x-6 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    session.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                    session.status === 'cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <Calendar className="w-7 h-7" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Session with {session.student_name || 'Student'}</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{session.enrollment_number}</p>
                      </div>
                      <span className={`status-badge ${
                        session.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        session.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                      }`}>
                        {session.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(session.scheduled_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>Mentor: {session.mentor_name || 'Assigned'}</span>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-600 text-sm">
                        "{session.notes}"
                    </div>

                    {session.status === 'pending' && (
                        <div className="mt-6 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button 
                                onClick={() => updateStatus(session.id, 'completed')}
                                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>Mark Completed</span>
                            </button>
                            <button 
                                onClick={() => updateStatus(session.id, 'cancelled')}
                                className="flex items-center space-x-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors"
                            >
                                <XCircle className="w-4 h-4" />
                                <span>Cancel Session</span>
                            </button>
                        </div>
                    )}
                  </div>
               </div>
             ))
           ) : (
             <div className="text-center py-20 glass-card">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No counseling sessions found.</p>
             </div>
           )}
        </div>

        <div className="space-y-8">
           <Card className="glass-card bg-indigo-900 text-white border-none p-8">
              <h3 className="text-xl font-bold mb-4">Intervention Stats</h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-1">Completion Rate</p>
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-3xl font-black">92%</p>
                        <span className="text-emerald-400 text-xs font-bold">+5% this month</span>
                    </div>
                    <div className="w-full h-1.5 bg-indigo-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 w-[92%]"></div>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-800/50 p-4 rounded-2xl">
                        <p className="text-indigo-300 text-[10px] font-black tracking-widest uppercase mb-1">Completed</p>
                        <p className="text-xl font-bold">148</p>
                    </div>
                    <div className="bg-indigo-800/50 p-4 rounded-2xl">
                        <p className="text-indigo-300 text-[10px] font-black tracking-widest uppercase mb-1">Upcoming</p>
                        <p className="text-xl font-bold">12</p>
                    </div>
                 </div>
              </div>
           </Card>

           <div className="glass-card p-6">
              <h4 className="font-bold text-slate-900 mb-4">Quick Guidance</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Regular follow-ups are crucial for students in the High-Risk category. Ensure notes are updated after each session to track qualitative progress.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CounselingManager;
