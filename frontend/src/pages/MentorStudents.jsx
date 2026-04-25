import API_BASE_URL from '../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Upload, FileText, ChevronRight, Search, Radar, ShieldAlert, Cpu, Download, MessageSquare, CreditCard } from 'lucide-react';
import Table, { RiskBadge } from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import { TrendLineChart } from '../components/ui/Charts';
import { Card, CardHeader, CardBody } from '../components/ui/Card';

const MentorStudents = () => {
  const [students, setStudents] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState({ records: [], risk: [] });
  const [counselingNotes, setCounselingNotes] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('${API_BASE_URL}/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post('${API_BASE_URL}/upload-data', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      fetchStudents();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to process data');
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleRowClick = async (student) => {
    setSelectedStudent(student);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/students/${student.id}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentHistory(res.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Error fetching student history:', error);
    }
  };

  const handleScheduleClick = (student, e) => {
    e.stopPropagation();
    setSelectedStudent(student);
    setCounselingNotes(`Schedule review for ${student.name}`);
    setIsModalOpen(true);
  };

  const submitCounseling = async () => {
    try {
      const token = localStorage.getItem('token');
      const mentorId = localStorage.getItem('userId');
      await axios.post('${API_BASE_URL}/counseling', {
        student_id: selectedStudent.id,
        mentor_id: mentorId,
        scheduled_date: new Date(Date.now() + 86400000).toISOString(),
        notes: counselingNotes
      }, { headers: { Authorization: `Bearer ${token}` } });
      setIsModalOpen(false);
      alert('Intervention protocol initialized.');
    } catch (error) {
       console.error(error);
       alert('Protocol failed.');
    }
  };

  const tableColumns = [
    { header: 'Target', accessor: 'name', render: (row) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-black text-sm">
          {row.name.charAt(0)}
        </div>
        <div>
          <p className="font-black text-white uppercase tracking-tight">{row.name}</p>
          <p className="text-[9px] text-cyan-500/60 font-mono tracking-[0.2em]">{row.enrollment_number}</p>
        </div>
      </div>
    )},
    { header: 'Sector', accessor: 'course', render: (row) => (
        <div className="flex flex-col">
            <span className="font-bold text-slate-300 text-xs">{row.course || 'N/A'}</span>
            <span className="text-[9px] text-slate-500 font-mono">LEVEL {row.year || '-'}</span>
        </div>
    )},
    { header: 'Biometric Stability', accessor: 'attendance_percentage', render: (row) => (
      <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-mono text-cyan-500/60 uppercase">
            <span>Attendance</span>
            <span className="text-white font-bold">{row.attendance_percentage || 0}%</span>
        </div>
        <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/10">
          <div className={`h-full transition-all duration-1000 ${row.attendance_percentage < 75 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`} style={{ width: `${Math.min(100, row.attendance_percentage || 0)}%` }}></div>
        </div>
      </div>
    )},
    { header: 'Aca_Index', accessor: 'marks_percentage', render: (row) => (
        <span className="font-mono font-black text-white text-lg">{row.marks_percentage || 0}<span className="text-[9px] text-cyan-500/40 ml-0.5">PTS</span></span>
    )},
    { header: 'Threat Level', accessor: 'risk_category', render: (row) => <RiskBadge level={row.risk_category} /> }
  ];

  const latestRecord = studentHistory.records[studentHistory.records.length - 1];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-6 border border-cyan-500/10 bg-cyan-500/5 rounded-[32px]">
        <div>
          <div className="flex items-center space-x-2 mb-1">
             <Radar className="w-4 h-4 text-cyan-500 animate-spin-slow" />
             <span className="text-[10px] font-mono text-cyan-500 tracking-[0.3em] uppercase">Student Tracking Satellite: Online</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Target <span className="text-cyan-400">Directory</span></h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <input type="file" id="excel-upload" accept=".xlsx, .xls" onChange={handleUpload} className="hidden" />
          <label 
            htmlFor="excel-upload"
            className={`btn-secondary flex items-center space-x-2 cursor-pointer ${uploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>Data Ingest</span>
          </label>
        </div>
      </div>

      <Table 
        title="Biometric Roster"
        data={students}
        columns={tableColumns}
        onRowAction={handleRowClick}
        actionText="Initialize Scan"
        selectable={true}
        onBulkAction={(ids) => alert(`Marking ${ids.length} targets for observation.`)}
      />

      {/* Deep Dive Scan Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Student Diagnostic Scan">
        {selectedStudent && (
          <div className="space-y-8 p-2 font-mono">
            {/* Header HUD */}
            <div className="flex items-center space-x-6 p-6 bg-slate-900 border border-cyan-500/20 rounded-[32px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Cpu className="w-20 h-20 text-cyan-500" />
              </div>
              <div className="w-20 h-20 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-black text-3xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                {selectedStudent.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">{selectedStudent.name}</h3>
                <p className="text-cyan-500/60 text-[10px] tracking-[0.2em]">{selectedStudent.enrollment_number} // {selectedStudent.course}</p>
                <div className="mt-3 flex space-x-2">
                   <RiskBadge level={selectedStudent.risk_category} />
                   <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-slate-700">LEVEL_0{selectedStudent.year}</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="glass-card p-6 border-l-4 border-l-cyan-500">
                  <p className="text-[9px] text-cyan-500 uppercase font-black tracking-widest mb-2">Stability Index</p>
                  <p className="text-4xl font-black text-white">{selectedStudent.attendance_percentage}<span className="text-sm text-cyan-500/40 ml-1">%</span></p>
               </div>
               <div className="glass-card p-6 border-l-4 border-l-rose-500">
                  <p className="text-[9px] text-rose-500 uppercase font-black tracking-widest mb-2">Performance_Idx</p>
                  <p className="text-4xl font-black text-white">{selectedStudent.marks_percentage}<span className="text-sm text-rose-500/40 ml-1">PTS</span></p>
               </div>
               <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                  <p className="text-[9px] text-emerald-500 uppercase font-black tracking-widest mb-2">Fee Verification</p>
                  <p className={`text-xl font-black uppercase ${selectedStudent.fee_paid ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedStudent.fee_paid ? 'CLEARED' : 'PENDING'}
                  </p>
               </div>
            </div>

            {/* Academic History & Student Input */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 glass-card p-8">
                    <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-6 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Temporal Data Scan
                    </h4>
                    <TrendLineChart 
                        data={studentHistory.records} 
                        xAxisKey="semester" 
                        lines={[
                        { key: 'attendance_percentage', color: '#10b981', label: 'ATTENDANCE' },
                        { key: 'marks_percentage', color: '#06b6d4', label: 'ACADEMIC' }
                        ]} 
                    />
                </Card>

                <div className="space-y-6">
                    <div className="glass-card p-6 bg-cyan-500/5">
                        <h4 className="text-[9px] font-black text-cyan-500 uppercase tracking-widest mb-4 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Target Feedback
                        </h4>
                        <div className="text-xs text-slate-300 leading-relaxed italic">
                            {latestRecord?.student_feedback ? `"${latestRecord.student_feedback}"` : "NO FEEDBACK TRANSMITTED."}
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Academic Archives
                        </h4>
                        <div className="space-y-3">
                            {studentHistory.records.map((rec, i) => (
                                <a key={i} href={rec.report_url} target="_blank" rel="noreferrer" className="flex justify-between items-center text-[10px] p-2 rounded-lg bg-slate-800/50 hover:bg-cyan-500/10 transition-colors border border-slate-700">
                                    <span className="font-bold">{rec.semester} Report</span>
                                    <Download className="w-3 h-3 text-cyan-500" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Protocol Buttons */}
            <div className="flex space-x-4 pt-4">
              <button 
                onClick={(e) => { setIsDetailModalOpen(false); handleScheduleClick(selectedStudent, e); }}
                className="btn-primary flex-1 py-4 text-xs font-black tracking-[0.2em]"
              >
                INITIATE INTERVENTION PROTOCOL
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Scheduling Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Protocol Initialization">
        {selectedStudent && (
          <div className="space-y-6 font-mono">
            <div className="p-6 bg-slate-900 border border-cyan-500/20 rounded-3xl">
              <p className="text-[9px] uppercase font-black tracking-widest text-cyan-500 mb-2">Subject Assignment</p>
              <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]">{selectedStudent.name.charAt(0)}</div>
                  <p className="font-black text-white uppercase">{selectedStudent.name} // {selectedStudent.enrollment_number}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Mission Parameters / Notes</label>
              <textarea 
                className="input-field min-h-[160px]"
                value={counselingNotes}
                onChange={(e) => setCounselingNotes(e.target.value)}
                placeholder="LOG PROTOCOL DETAILS HERE..."
              ></textarea>
            </div>
            
            <button onClick={submitCounseling} className="btn-primary w-full py-4 text-xs shadow-xl">
              CONFIRM PROTOCOL EXECUTION
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default MentorStudents;
