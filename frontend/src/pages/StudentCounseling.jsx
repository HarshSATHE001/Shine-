import API_BASE_URL from '../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MessageSquare, Clock, Send, Info } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';

const StudentCounseling = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('${API_BASE_URL}/students/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (error) {
      console.error('Error fetching counseling data:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestCounseling = async () => {
    try {
      const token = localStorage.getItem('token');
      const studentId = localStorage.getItem('studentId');
      if (!studentId) return alert('Student profile not setup completely.');
      
      await axios.post('${API_BASE_URL}/counseling', {
        student_id: studentId,
        scheduled_date: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
        notes: 'Personal request for academic guidance'
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Counseling requested successfully!');
      fetchData();
    } catch (error) {
      console.error('Error requesting counseling:', error);
      alert('Failed to request counseling');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { counseling } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Center</h1>
          <p className="text-slate-500 font-medium mt-1">Your journey through personalized academic counseling</p>
        </div>
        <button onClick={requestCounseling} className="btn-primary flex items-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Request Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {counseling.length > 0 ? (
                counseling.map((c, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[32px] top-1 w-6 h-6 rounded-full border-4 border-white z-10 shadow-sm ${
                      c.status === 'completed' ? 'bg-emerald-500' : 
                      c.status === 'cancelled' ? 'bg-rose-500' : 'bg-indigo-500 animate-pulse'
                    }`} />
                    <div className="glass-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center group">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                           <Calendar className="w-3.5 h-3.5 text-slate-400" />
                           <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                              {new Date(c.scheduled_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                           </p>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mt-2">Counseling Session</h4>
                        <p className="text-sm text-slate-500 mt-1 italic leading-relaxed font-medium">"{c.notes}"</p>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center">
                         <span className={`status-badge ${
                          c.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          c.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">You haven't requested any counseling sessions yet.</p>
                </div>
              )}
           </div>
        </div>

        <div className="space-y-8">
           <Card className="glass-card p-8 bg-indigo-50 border-indigo-100">
              <div className="w-12 h-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center mb-6 shadow-sm">
                 <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Need Guidance?</h3>
              <p className="text-slate-600 mt-2 text-sm leading-relaxed font-medium">Our mentors are here to help you navigate academic challenges and career planning. Sessions usually take 30-45 minutes.</p>
              <button onClick={requestCounseling} className="mt-8 btn-primary w-full shadow-indigo-100">
                 Book Next Session
              </button>
           </Card>

           <div className="glass-card p-6 flex items-start space-x-4">
              <div className="shrink-0 text-amber-500 mt-1">
                 <Info className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Make sure to prepare specific questions about your course modules before the session for better outcomes.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCounseling;
