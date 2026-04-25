import API_BASE_URL from '../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { RiskBadge } from '../components/ui/Table';
import { TrendingUp, Award, BookOpen, Clock, Activity, Zap } from 'lucide-react';

const StudentDashboard = () => {
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
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!data || !data.profile) {
    return (
      <div className="glass-card p-12 text-center max-w-2xl mx-auto mt-10 border border-cyan-500/20">
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">System Access Denied</h3>
        <p className="text-slate-500 font-mono text-sm">Your biometric profile is not linked to any student records. Contact JARVIS administrator.</p>
      </div>
    );
  }

  const { profile, latestRecord, risk, counseling } = data;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000 max-w-6xl mx-auto">
      
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-8 border border-cyan-500/20 bg-cyan-500/5 rounded-[40px] relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-500 tracking-[0.3em] uppercase">User Identification: Confirmed</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Welcome back, <span className="text-cyan-400">{profile.name}</span>
          </h1>
          <p className="text-slate-400 font-mono text-sm mt-1">Status: Active // Term: {latestRecord?.semester || 'current'}</p>
        </div>
        <div className="flex items-center space-x-2 bg-cyan-600 text-white px-5 py-2.5 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
           <Award className="w-5 h-5" />
           <span className="font-black text-xs uppercase tracking-widest">Academic Elite Pool</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Scan */}
        <Card className="glass-card p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-[10px] font-black text-cyan-500/60 uppercase tracking-widest mb-8">Dropout Probability Scan</h3>
          {risk ? (
            <>
              <div className="mb-8 scale-125">
                 <RiskBadge level={risk.risk_category} />
              </div>
              <p className={`text-6xl font-black mb-2 tracking-tighter ${risk.risk_score >= 70 ? 'text-rose-500 glow-rose' : risk.risk_score >= 40 ? 'text-amber-500' : 'text-emerald-500 glow-emerald'}`}>
                {risk.risk_score}<span className="text-xl opacity-30">/100</span>
              </p>
              <p className="text-xs text-slate-500 mt-6 px-4 font-mono leading-relaxed">LOG: "{risk.reason}"</p>
            </>
          ) : (
            <p className="text-slate-600 font-mono italic">Calibrating risk model...</p>
          )}
        </Card>

        {/* Vital Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="glass-card p-8 group border-l-4 border-l-cyan-500">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                 <Zap className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">Academic Sync Index</p>
              <h4 className={`text-5xl font-black ${latestRecord?.marks_percentage >= 75 ? 'text-emerald-400' : latestRecord?.marks_percentage < 40 ? 'text-rose-500' : 'text-white'}`}>
                {latestRecord?.marks_percentage || 0}%
              </h4>
              <div className="mt-8 flex items-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                 <TrendingUp className="w-4 h-4 mr-1" strokeWidth={3} />
                 <span>Trajectory +2.4%</span>
              </div>
           </Card>

           <Card className="glass-card p-8 group border-l-4 border-l-indigo-500">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                 <Clock className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Attendance Core Stability</p>
              <h4 className={`text-5xl font-black ${latestRecord?.attendance_percentage >= 75 ? 'text-emerald-400' : 'text-rose-500'}`}>
                {latestRecord?.attendance_percentage || 0}%
              </h4>
              <div className="mt-8 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                 <div className={`h-full transition-all duration-1000 ${latestRecord?.attendance_percentage < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${latestRecord?.attendance_percentage || 0}%` }}></div>
              </div>
           </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="glass-card">
            <CardHeader title="Incoming Protocols" />
            <CardBody>
              {counseling.filter(c => c.status === 'pending').length > 0 ? (
                <div className="space-y-4">
                  {counseling.filter(c => c.status === 'pending').map((c, i) => (
                    <div key={i} className="flex justify-between items-center p-6 bg-slate-900/50 rounded-[24px] border border-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                      <div>
                        <p className="font-black text-white uppercase">{new Date(c.scheduled_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                        <p className="text-[10px] text-cyan-500/60 font-mono mt-1 uppercase tracking-widest">Counseling Uplink</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-black text-cyan-400">{new Date(c.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                         <span className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.2em]">Verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-600 font-mono text-sm italic">No active protocols detected.</p>
                </div>
              )}
            </CardBody>
          </Card>
          
          <div className="bg-slate-900 border border-cyan-500/10 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between group">
             <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Quick Guidance</h3>
                <p className="text-slate-400 mt-4 text-sm leading-relaxed font-mono">JARVIS: "Focus on your Semester 3 project. Current trajectory suggests a potential grade boost if submitted early."</p>
             </div>
             <button className="mt-8 bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                Access Archives
             </button>
             <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors"></div>
          </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
