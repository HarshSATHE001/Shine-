import API_BASE_URL from '../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, GraduationCap, MapPin, Calendar, Award } from 'lucide-react';
import { TrendLineChart } from '../components/ui/Charts';
import { Card, CardHeader, CardBody } from '../components/ui/Card';

const StudentProfile = () => {
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
      
      let history = { records: [] };
      if (res.data.profile) {
        const hRes = await axios.get(`${API_BASE_URL}/students/${res.data.profile.id}/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        history = hRes.data;
      }
      setData({ ...res.data, history: history.records });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { profile, history } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <div className="glass-card overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-indigo-600 to-indigo-900 relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="px-10 pb-10 relative">
          <div className="flex flex-col md:flex-row items-end -mt-16 gap-6">
            <div className="w-32 h-32 rounded-[40px] bg-white p-2 shadow-2xl relative z-10">
                <div className="w-full h-full rounded-[32px] bg-indigo-600 text-white flex items-center justify-center text-4xl font-black">
                    {profile.name?.charAt(0)}
                </div>
            </div>
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-black text-slate-900 leading-tight">{profile.name}</h1>
              <div className="flex items-center text-slate-500 font-medium space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{profile.enrollment_number}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Academic Campus</span>
                </div>
              </div>
            </div>
            <button className="btn-primary mb-2">Edit Profile</button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-8">
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact Information</h4>
                  <div className="space-y-4">
                     <div className="flex items-center space-x-3 text-slate-600">
                        <Mail className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium">student@university.edu</span>
                     </div>
                     <div className="flex items-center space-x-3 text-slate-600">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium">Joined Fall 2024</span>
                     </div>
                  </div>
               </div>

               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Course Details</h4>
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Major</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">{profile.course}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Year</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">Year {profile.year}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="md:col-span-2 space-y-8">
                <Card className="bg-slate-50 border border-slate-100 p-8 rounded-[32px]">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Academic Trajectory</h4>
                   <TrendLineChart 
                    data={history} 
                    xAxisKey="semester" 
                    lines={[
                      { key: 'attendance_percentage', color: '#10b981', label: 'Attendance' },
                      { key: 'marks_percentage', color: '#6366f1', label: 'Marks' }
                    ]} 
                   />
                </Card>

                <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scholarships</p>
                            <p className="font-bold text-slate-900">Merit List #4</p>
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mentor</p>
                            <p className="font-bold text-slate-900">Dr. Sarah Jenkins</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
