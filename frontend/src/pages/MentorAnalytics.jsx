import API_BASE_URL from '../config';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { BarChart3, PieChart, TrendingUp, Download, Layers } from 'lucide-react';
import { TrendLineChart, DistributionBarChart, RiskPieChart } from '../components/ui/Charts';
import { Card, CardHeader, CardBody } from '../components/ui/Card';

const MentorAnalytics = () => {
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
      console.error('Error fetching analytics data:', error);
    }
  };

  const chartData = useMemo(() => {
    const highRisk = students.filter(s => s.risk_category === 'High').length;
    const mediumRisk = students.filter(s => s.risk_category === 'Medium').length;
    const lowRisk = students.filter(s => s.risk_category === 'Low').length;

    const riskPie = [
      { name: 'High', value: highRisk },
      { name: 'Medium', value: mediumRisk },
      { name: 'Low', value: lowRisk }
    ].filter(d => d.value > 0);

    const marksBuckets = { '0-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
    students.forEach(s => {
      const m = s.marks_percentage || 0;
      if (m <= 40) marksBuckets['0-40']++;
      else if (m <= 60) marksBuckets['41-60']++;
      else if (m <= 80) marksBuckets['61-80']++;
      else marksBuckets['81-100']++;
    });
    const marksData = Object.keys(marksBuckets).map(k => ({ range: k, count: marksBuckets[k] }));

    return { riskPie, marksData, trendData: analytics.trendData };
  }, [students, analytics]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytical Insights</h1>
          <p className="text-slate-500 font-medium mt-1">Detailed visualization of batch performance metrics</p>
        </div>
        <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Analytics</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader title="Performance Trend" action={<TrendingUp className="w-5 h-5 text-emerald-500" />} />
          <CardBody>
            <TrendLineChart 
              data={chartData.trendData} 
              xAxisKey="month" 
              lines={[
                { key: 'avgAtt', color: '#6366f1', label: 'Avg Attendance' },
                { key: 'avgMarks', color: '#f43f5e', label: 'Avg Marks' }
              ]} 
            />
          </CardBody>
        </Card>

        <Card className="glass-card">
          <CardHeader title="Grade Distribution" action={<Layers className="w-5 h-5 text-indigo-500" />} />
          <CardBody>
            <DistributionBarChart data={chartData.marksData} dataKey="count" xAxisKey="range" fill="#6366f1" />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="glass-card">
          <CardHeader title="Risk Profile" action={<PieChart className="w-5 h-5 text-rose-500" />} />
          <CardBody>
            <RiskPieChart data={chartData.riskPie} />
          </CardBody>
        </Card>

        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card p-8 flex items-center justify-between">
              <div>
                 <h3 className="text-xl font-bold text-slate-900">Attendance Correlation</h3>
                 <p className="text-slate-500 mt-2 text-sm max-w-sm">Students with attendance below 70% are 4.5x more likely to fall into the high-risk category this semester.</p>
              </div>
              <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl">
                 70%
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 rounded-[32px] p-8 text-white">
                 <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Predicted Outcome</h4>
                 <p className="text-2xl font-bold">85% of students are expected to clear current term.</p>
                 <div className="mt-6 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[85%]"></div>
                 </div>
              </div>
              <div className="bg-indigo-600 rounded-[32px] p-8 text-white">
                 <h4 className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-4">Growth Rate</h4>
                 <p className="text-2xl font-bold">+12.4% overall improvement in marks since Sem 1.</p>
                 <div className="mt-6 flex space-x-1">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="flex-1 bg-indigo-400/30 rounded-t-lg" style={{ height: `${20 + i*10}px` }}></div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MentorAnalytics;
