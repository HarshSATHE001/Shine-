import API_BASE_URL from '../config';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Users, AlertTriangle, Activity, CheckCircle2, TrendingUp, Calendar, ShieldAlert, Cpu, Zap } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { TrendLineChart, RiskPieChart } from '../components/ui/Charts';
import { Card, CardHeader, CardBody } from '../components/ui/Card';

const MentorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState({ trendData: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [studentsRes, analyticsRes] = await Promise.all([
        axios.get('${API_BASE_URL}/students', config),
        axios.get('${API_BASE_URL}/analytics', config)
      ]);
      setStudents(studentsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const stats = useMemo(() => {
    const total = students.length;
    const highRisk = students.filter(s => s.risk_category === 'High').length;
    const mediumRisk = students.filter(s => s.risk_category === 'Medium').length;
    const lowRisk = students.filter(s => s.risk_category === 'Low').length;
    return { total, highRisk, mediumRisk, lowRisk };
  }, [students]);

  const chartData = useMemo(() => {
    const riskPie = [
      { name: 'High', value: stats.highRisk },
      { name: 'Medium', value: stats.mediumRisk },
      { name: 'Low', value: stats.lowRisk }
    ].filter(d => d.value > 0);

    const trendData = analytics.trendData.length > 0 ? analytics.trendData : [
      { month: 'Sem 1', avgAtt: 75, avgMarks: 70 },
      { month: 'Sem 2', avgAtt: 72, avgMarks: 68 },
      { month: 'Sem 3', avgAtt: 80, avgMarks: 75 },
    ];

    return { riskPie, trendData };
  }, [stats, analytics]);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000">
      
      {/* HUD Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-8 border border-cyan-500/20 bg-cyan-500/5 rounded-[40px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20">
            <Cpu className="w-24 h-24 text-cyan-500 animate-pulse" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500 animate-ping"></div>
            <span className="text-[10px] font-black tracking-[0.3em] text-cyan-500 uppercase">System Status: Active</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Command <span className="text-cyan-400">Console</span>
          </h1>
          <p className="text-slate-400 font-mono text-sm mt-2 max-w-xl">
            JARVIS Protocol 4.2 Initialized. Monitoring <span className="text-white font-bold">{stats.total}</span> biometric student records. Global dropout probability: <span className="text-rose-400 font-bold">{(stats.highRisk / (stats.total || 1) * 100).toFixed(1)}%</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-4 relative z-10">
            <div className="bg-slate-900/80 border border-cyan-500/30 p-4 rounded-3xl flex items-center space-x-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <div className="text-right">
                    <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest leading-none">Power Level</p>
                    <p className="text-xl font-black text-white mt-1">98.2%</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>
        </div>
      </div>

      {/* Grid HUD Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Target Population" value={stats.total} icon={Users} colorClass="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" trend="up" trendValue="+12%" />
        <StatCard title="Critical Threat" value={stats.highRisk} icon={ShieldAlert} colorClass="bg-rose-500/10 text-rose-400 border border-rose-500/20" trend="up" trendValue="+2%" />
        <StatCard title="Variable Stability" value={stats.mediumRisk} icon={Activity} colorClass="bg-amber-500/10 text-amber-400 border border-amber-500/20" trend="down" trendValue="-5%" />
        <StatCard title="Optimal Sync" value={stats.lowRisk} icon={CheckCircle2} colorClass="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" trend="up" trendValue="+8%" />
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card overflow-hidden">
          <CardHeader title="Temporal Performance Matrix" action={
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-[10px] bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                <span>REAL-TIME TRACKING</span>
            </div>
          } />
          <CardBody className="p-0">
            <div className="p-8">
                <TrendLineChart 
                    data={chartData.trendData} 
                    xAxisKey="month" 
                    lines={[
                        { key: 'avgAtt', color: '#06b6d4', label: 'Attendance' },
                        { key: 'avgMarks', color: '#f43f5e', label: 'Academic' }
                    ]} 
                />
            </div>
            <div className="bg-cyan-500/5 p-4 border-t border-cyan-500/10 flex justify-between font-mono text-[10px] text-cyan-500/60 uppercase tracking-widest">
                <span>Core Analytics: Online</span>
                <span>Data Source: Node_DB_Alpha</span>
            </div>
          </CardBody>
        </Card>
        
        <Card className="glass-card flex flex-col h-full">
          <CardHeader title="Threat Distribution" />
          <CardBody className="flex-1 flex items-center justify-center">
            {chartData.riskPie.length > 0 ? (
               <RiskPieChart data={chartData.riskPie} />
            ) : (
               <div className="text-slate-600 font-mono text-sm italic">Scanning for risk patterns...</div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Student Quick-Links Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 glass-card p-1">
             <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-cyan-500" />
                        AI Analysis Report
                    </h3>
                    <span className="font-mono text-[10px] text-cyan-500">REF_ID: 8829-X</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="p-5 border border-cyan-500/10 bg-cyan-500/5 rounded-3xl group hover:border-cyan-500/30 transition-colors">
                      <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-2">Top Insight</p>
                      <p className="text-slate-300 text-sm leading-relaxed">Students with <strong>unpaid fees</strong> in Semester 2 show a <strong>68% higher</strong> correlation with attendance drops.</p>
                   </div>
                   <div className="p-5 border border-rose-500/10 bg-rose-500/5 rounded-3xl group hover:border-rose-500/30 transition-colors">
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-2">Critical Flag</p>
                      <p className="text-slate-300 text-sm leading-relaxed">Global academic average has dipped by <strong>4.2%</strong>. Recommended: Initiate Batch-Wide Review.</p>
                   </div>
                </div>
             </div>
             <div className="bg-slate-900/50 p-6 rounded-b-2xl border-t border-cyan-500/10 flex justify-end">
                <button className="btn-primary">Execute Batch Scan</button>
             </div>
          </div>
          
          <div className="space-y-6">
             <div className="glass-card p-8 border-l-4 border-l-cyan-500 relative overflow-hidden">
                <h4 className="font-black text-white uppercase tracking-widest text-sm mb-4">Core Systems</h4>
                <div className="space-y-4">
                    {[
                        { label: 'Academic Sync', status: 'Optimal' },
                        { label: 'Biometric Attendance', status: 'Stable' },
                        { label: 'Fee Verification', status: 'Pending' }
                    ].map((sys, i) => (
                        <div key={sys.label} className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-mono">{sys.label}</span>
                            <span className={sys.status === 'Optimal' ? 'text-cyan-400 font-bold' : sys.status === 'Pending' ? 'text-amber-400 font-bold' : 'text-slate-300'}>{sys.status}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-6 border-t border-cyan-500/10">
                   <p className="text-[10px] text-slate-500 font-mono italic">JARVIS: Ready for command input.</p>
                </div>
             </div>
          </div>
      </div>

    </div>
  );
};

export default MentorDashboard;
