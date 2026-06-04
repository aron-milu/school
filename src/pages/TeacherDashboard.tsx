import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import {
  LogOut, BookOpen, Users, Plus, Search, X,
  FileText, Bell, Send, Clock, CheckCircle2,
  MessageSquare, BarChart3, GraduationCap,
  Calendar, ChevronRight, Target, AlertTriangle,
  TrendingUp, TrendingDown, Shield, Wrench,
  Headphones, Sparkles, PenTool, Video, Loader2, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Tab = 'overview' | 'students' | 'diagnostics' | 'assignments' | 'create' | 'materials' | 'speak-tutor' | 'assisted-learning' | 'lifelong-learning' | 'whiteboard' | 'chat';

const MY_CLASSES = [
  { id: 1, name: 'Senior 4 Blue', level: 'S4', stream: 'Blue', students: 38, subject: 'Mathematics' },
  { id: 2, name: 'Senior 4 Red', level: 'S4', stream: 'Red', students: 35, subject: 'Mathematics' },
  { id: 3, name: 'Senior 3 Green', level: 'S3', stream: 'Green', students: 30, subject: 'Mathematics' },
];

const MY_STUDENTS = [
  { id: 1, name: 'Namuli Sarah', class: 'S4 Blue', regNo: 'LUB/2026/001', avgScore: 82, attendance: 96, lastActive: '2 hrs ago' },
  { id: 2, name: 'Okello David', class: 'S4 Blue', regNo: 'LUB/2026/002', avgScore: 75, attendance: 92, lastActive: '1 hr ago' },
  { id: 3, name: 'Nakamya Patience', class: 'S4 Red', regNo: 'LUB/2026/003', avgScore: 88, attendance: 98, lastActive: '30 min ago' },
  { id: 4, name: 'Mugisha Alex', class: 'S3 Green', regNo: 'LUB/2026/004', avgScore: 71, attendance: 88, lastActive: '3 hrs ago' },
  { id: 5, name: 'Achieng Grace', class: 'S4 Blue', regNo: 'LUB/2026/005', avgScore: 90, attendance: 100, lastActive: '15 min ago' },
  { id: 6, name: 'Ssewankambo Mark', class: 'S4 Red', regNo: 'LUB/2026/006', avgScore: 65, attendance: 85, lastActive: '1 day ago' },
  { id: 7, name: 'Apolot Vivian', class: 'S3 Green', regNo: 'LUB/2026/007', avgScore: 78, attendance: 94, lastActive: '4 hrs ago' },
  { id: 8, name: 'Ochieng Brian', class: 'S4 Blue', regNo: 'LUB/2026/008', avgScore: 83, attendance: 97, lastActive: '45 min ago' },
];

const MY_ASSIGNMENTS = [
  { id: 1, title: 'Quadratic Equations Worksheet', class: 'S4 Blue', type: 'Homework', dueDate: '2026-04-28', submitted: 28, total: 38, status: 'active' },
  { id: 2, title: 'Trigonometry Quiz', class: 'S4 Red', type: 'Quiz', dueDate: '2026-04-30', submitted: 0, total: 35, status: 'upcoming' },
  { id: 3, title: 'Calculus Introduction Test', class: 'S3 Green', type: 'Test', dueDate: '2026-04-20', submitted: 30, total: 30, status: 'graded' },
  { id: 4, title: 'Algebra Practice Problems', class: 'S4 Blue', type: 'Homework', dueDate: '2026-04-15', submitted: 35, total: 38, status: 'graded' },
  { id: 5, title: 'Geometry Project', class: 'S4 Red', type: 'Project', dueDate: '2026-05-10', submitted: 0, total: 35, status: 'upcoming' },
];

const CHAT_MESSAGES = [
  { id: 1, sender: 'Namuli Sarah', message: 'Sir, I need help with question 5 on the worksheet', time: '9:30 AM', isMe: false },
  { id: 2, sender: 'You', message: 'Which part is giving you trouble?', time: '9:32 AM', isMe: true },
  { id: 3, sender: 'Namuli Sarah', message: 'The part about completing the square', time: '9:33 AM', isMe: false },
  { id: 4, sender: 'You', message: 'Remember the formula we used in class. Take half of the coefficient of x, square it, then add and subtract.', time: '9:35 AM', isMe: true },
  { id: 5, sender: 'Namuli Sarah', message: 'Oh I see! Let me try that. Thank you sir!', time: '9:36 AM', isMe: false },
];

const CHAT_CONTACTS = [
  { id: 1, name: 'S4 Blue Class', role: 'Class Group', lastMessage: 'Worksheet due Friday', time: '9:36 AM', unread: 3, isGroup: true },
  { id: 2, name: 'Namuli Sarah', role: 'S4 Blue Student', lastMessage: 'Thank you sir!', time: '9:36 AM', unread: 0, isGroup: false },
  { id: 3, name: 'S4 Red Class', role: 'Class Group', lastMessage: 'Quiz on Thursday', time: '8:15 AM', unread: 1, isGroup: true },
  { id: 4, name: 'Okello David', role: 'S4 Blue Student', lastMessage: 'Can I submit late?', time: 'Yesterday', unread: 0, isGroup: false },
  { id: 5, name: 'S3 Green Class', role: 'Class Group', lastMessage: 'Test results posted', time: 'Yesterday', unread: 0, isGroup: true },
];

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [selectedChat, setSelectedChat] = useState(1);
  const [showContacts, setShowContacts] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'students', label: 'My Students', icon: <Users size={18} /> },
    { id: 'diagnostics', label: 'Diagnostics', icon: <Target size={18} /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText size={18} /> },
    { id: 'create', label: 'Create', icon: <Plus size={18} /> },
    { id: 'materials', label: 'Study Materials', icon: <FileText size={18} /> },
    { id: 'speak-tutor', label: 'Call Log', icon: <Headphones size={18} /> },
    { id: 'assisted-learning', label: 'Assisted Learning', icon: <Sparkles size={18} /> },
    { id: 'lifelong-learning', label: 'Lifelong Learning', icon: <GraduationCap size={18} /> },
    { id: 'whiteboard', label: 'Whiteboard', icon: <PenTool size={18} /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-brand text-sm">Soma365</h1>
              <p className="text-[10px] text-slate-500">{({ primary: 'Primary School', secondary: 'Secondary School', university: 'University', tertiary: 'Tertiary College', vocational: 'Vocational Institute' } as Record<string, string>)[user?.education_level || 'secondary'] || 'Secondary School'} - Teacher</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
              <Bell size={18} className="text-amber-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">4</span>
            </button>
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-brand text-sm">{user?.full_name}</p>
              <p className="text-[10px] text-slate-500">{({ primary: 'Primary School', secondary: 'Secondary School', university: 'University', tertiary: 'Tertiary College', vocational: 'Vocational Institute' } as Record<string, string>)[user?.education_level || 'secondary'] || 'Secondary School'} Teacher</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg transition" title="Logout">
              <LogOut size={18} className="text-red-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-slate-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'students' && (
          <StudentsTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
        {activeTab === 'diagnostics' && <DiagnosticsTab />}
        {activeTab === 'assignments' && <AssignmentsTab />}
        {activeTab === 'create' && <CreateTab />}
        {activeTab === 'materials' && <TeacherMaterialsTab />}
        {activeTab === 'speak-tutor' && <TeacherSpeakToTutorTab />}
        {activeTab === 'assisted-learning' && <TeacherAssistedLearningTab />}
        {activeTab === 'lifelong-learning' && <TeacherLifelongLearningTab />}
        {activeTab === 'whiteboard' && <TeacherWhiteboardTab />}
        {activeTab === 'chat' && (
          <ChatTab
            chatInput={chatInput}
            setChatInput={setChatInput}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            showContacts={showContacts}
            setShowContacts={setShowContacts}
          />
        )}
      </main>
    </div>
  );
}

function OverviewTab() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-brand rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">Welcome back, {user?.full_name?.split(' ').pop() || 'Teacher'}!</h2>
        <p className="text-slate-100 mt-1">You have 2 pending assignments to grade and 4 new messages.</p>
        <div className="flex gap-3 mt-4">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">3 Classes</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">103 Students</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Mathematics</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'My Classes', value: '3', icon: <GraduationCap size={20} />, color: 'bg-brand text-white' },
          { label: 'Total Students', value: '103', icon: <Users size={20} />, color: 'bg-slate-700 text-white' },
          { label: 'Assignments', value: '5', icon: <FileText size={20} />, color: 'bg-amber-500 text-white' },
          { label: 'Avg Class Score', value: '76%', icon: <BarChart3 size={20} />, color: 'bg-cyan-600 text-white' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} mb-3`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-brand">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Classes */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-brand mb-4">My Classes</h3>
          <div className="space-y-3">
            {MY_CLASSES.map(cls => (
              <div key={cls.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="text-brand font-bold text-sm">{cls.level}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-brand">{cls.name}</p>
                    <p className="text-xs text-slate-500">{cls.subject} - {cls.students} students</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-brand mb-4">Recent Submissions</h3>
          <div className="space-y-3">
            {[
              { student: 'Achieng Grace', assignment: 'Algebra Practice', time: '15 min ago' },
              { student: 'Okello David', assignment: 'Algebra Practice', time: '1 hr ago' },
              { student: 'Nakamya Patience', assignment: 'Algebra Practice', time: '2 hrs ago' },
              { student: 'Ochieng Brian', assignment: 'Algebra Practice', time: '3 hrs ago' },
              { student: 'Mugisha Alex', assignment: 'Calculus Test', time: 'Yesterday' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xs font-semibold">{item.student[0]}</span>
                </div>
                <div>
                  <p className="text-sm text-brand font-medium">{item.student}</p>
                  <p className="text-xs text-slate-500">Submitted: {item.assignment}</p>
                  <p className="text-[10px] text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsTab({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) {
  const filtered = MY_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand">My Students</h2>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or class..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={16} className="text-slate-400" />
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Class</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Avg Score</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Attendance</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Last Active</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(student => (
                <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-brand text-xs font-semibold">{student.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-brand text-sm">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.regNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{student.class}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${student.avgScore >= 80 ? 'text-brand' : student.avgScore >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                      {student.avgScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{student.attendance}%</td>
                  <td className="py-3 px-4 text-xs text-slate-500">{student.lastActive}</td>
                  <td className="py-3 px-4">
                    <button className="text-brand hover:text-slate-700 text-sm font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DiagnosticsTab() {
  const [selectedClass, setSelectedClass] = useState('Senior 4 Blue');

  const classDiagnostics = [
    { student: 'Namuli Sarah', regNo: 'LUB/2026/007', avgScore: 78, effort: 85, attendance: 96, trend: 'improving' as const, weakTopics: ['Integration', 'Electromagnetic Induction'], strongTopics: ['Quadratic Equations', 'Cell Division'], completionRate: 80 },
    { student: 'Okello David', regNo: 'LUB/2026/012', avgScore: 45, effort: 40, attendance: 72, trend: 'declining' as const, weakTopics: ['Differentiation', 'Integration', 'Probability', 'Genetics'], strongTopics: [], completionRate: 35 },
    { student: 'Nakamya Grace', regNo: 'LUB/2026/015', avgScore: 82, effort: 92, attendance: 98, trend: 'improving' as const, weakTopics: ['Electrochemistry'], strongTopics: ['Quadratic Equations', "Newton's Laws", 'Organic Chemistry'], completionRate: 95 },
    { student: 'Mugisha Peter', regNo: 'LUB/2026/019', avgScore: 55, effort: 60, attendance: 85, trend: 'stable' as const, weakTopics: ['Integration', 'Human Reproduction', 'Post-Colonial Uganda'], strongTopics: ['Cell Division'], completionRate: 55 },
    { student: 'Achieng Ruth', regNo: 'LUB/2026/023', avgScore: 30, effort: 25, attendance: 60, trend: 'declining' as const, weakTopics: ['Differentiation', 'Integration', 'Probability', 'Vectors', 'Electromagnetic Induction', 'Wave Optics'], strongTopics: [], completionRate: 20 },
    { student: 'Ssewankambo D.', regNo: 'LUB/2026/031', avgScore: 68, effort: 75, attendance: 90, trend: 'stable' as const, weakTopics: ['Conditional probability', 'Le Chatelier calculations'], strongTopics: ['Essay Writing', 'Grammar'], completionRate: 70 },
  ];

  const atRiskStudents = classDiagnostics.filter(s => s.avgScore < 50 || s.effort < 40 || s.attendance < 75);
  const topicWeaknessCounts: Record<string, number> = {};
  classDiagnostics.forEach(s => s.weakTopics.forEach(t => { topicWeaknessCounts[t] = (topicWeaknessCounts[t] || 0) + 1; }));
  const topWeakTopics = Object.entries(topicWeaknessCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const avgClassScore = Math.round(classDiagnostics.reduce((sum, s) => sum + s.avgScore, 0) / classDiagnostics.length);
  const avgEffort = Math.round(classDiagnostics.reduce((sum, s) => sum + s.effort, 0) / classDiagnostics.length);
  const avgAttendance = Math.round(classDiagnostics.reduce((sum, s) => sum + s.attendance, 0) / classDiagnostics.length);
  const avgCompletion = Math.round(classDiagnostics.reduce((sum, s) => sum + s.completionRate, 0) / classDiagnostics.length);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand">Student Diagnostics</h2>
        <p className="text-slate-500 text-sm mt-1">Understand exactly where each student struggles and why</p>
      </div>

      {/* Class Selector */}
      <div className="flex gap-2">
        {['Senior 4 Blue', 'Senior 4 Red', 'Senior 3 Green'].map(c => (
          <button key={c} onClick={() => setSelectedClass(c)} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${selectedClass === c ? 'bg-brand text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{c}</button>
        ))}
      </div>

      {/* Class Health Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Class Average', value: `${avgClassScore}%`, icon: <BarChart3 size={20} />, color: avgClassScore >= 70 ? 'bg-brand' : avgClassScore >= 50 ? 'bg-amber-500' : 'bg-red-500' },
          { label: 'Effort Score', value: `${avgEffort}%`, icon: <Target size={20} />, color: avgEffort >= 70 ? 'bg-brand' : avgEffort >= 50 ? 'bg-amber-500' : 'bg-red-500' },
          { label: 'Attendance', value: `${avgAttendance}%`, icon: <Calendar size={20} />, color: avgAttendance >= 90 ? 'bg-brand' : avgAttendance >= 75 ? 'bg-amber-500' : 'bg-red-500' },
          { label: 'Assignment Completion', value: `${avgCompletion}%`, icon: <CheckCircle2 size={20} />, color: avgCompletion >= 70 ? 'bg-brand' : avgCompletion >= 50 ? 'bg-amber-500' : 'bg-red-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${stat.color} mb-2`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-brand">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* At-Risk Students Alert */}
      {atRiskStudents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-red-600" />
            <h3 className="font-bold text-red-900">{atRiskStudents.length} Students At Risk</h3>
          </div>
          <p className="text-sm text-red-700 mb-3">These students have low scores, low effort, or poor attendance and need immediate intervention:</p>
          <div className="space-y-2">
            {atRiskStudents.map(s => (
              <div key={s.regNo} className="bg-white rounded-lg p-3 border border-red-100 flex items-center justify-between">
                <div>
                  <p className="font-medium text-brand text-sm">{s.student} <span className="text-xs text-slate-400">({s.regNo})</span></p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-red-600">Score: {s.avgScore}%</span>
                    <span className="text-xs text-amber-600">Effort: {s.effort}%</span>
                    <span className="text-xs text-slate-500">Attendance: {s.attendance}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {s.trend === 'declining' && <TrendingDown size={14} className="text-red-500" />}
                  {s.trend === 'improving' && <TrendingUp size={14} className="text-slate-500" />}
                  {s.trend === 'stable' && <span className="text-xs text-slate-400">Stable</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Struggled Topics */}
      {topWeakTopics.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-amber-500" />
            <h3 className="font-bold text-brand">Most Struggled Topics (Class-Wide)</h3>
          </div>
          <p className="text-sm text-slate-500 mb-3">Topics where the most students are struggling or developing:</p>
          <div className="space-y-3">
            {topWeakTopics.map(([topic, count]) => (
              <div key={topic} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-brand">{topic}</span>
                    <span className="text-xs text-red-600 font-medium">{count} student{count > 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(count / classDiagnostics.length) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-Student Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-brand mb-4">Individual Student Analysis</h3>
        <div className="space-y-3">
          {classDiagnostics.map(s => (
            <div key={s.regNo} className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-brand text-sm">{s.student}</p>
                  <p className="text-xs text-slate-400">{s.regNo}</p>
                </div>
                <div className="flex items-center gap-3">
                  {s.trend === 'improving' && <span className="flex items-center gap-1 text-xs text-brand font-medium"><TrendingUp size={12} /> Improving</span>}
                  {s.trend === 'declining' && <span className="flex items-center gap-1 text-xs text-red-600 font-medium"><TrendingDown size={12} /> Declining</span>}
                  {s.trend === 'stable' && <span className="text-xs text-slate-400 font-medium">Stable</span>}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div><p className="text-xs text-slate-500">Score</p><p className={`font-bold text-sm ${s.avgScore >= 70 ? 'text-brand' : s.avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{s.avgScore}%</p></div>
                <div><p className="text-xs text-slate-500">Effort</p><p className={`font-bold text-sm ${s.effort >= 70 ? 'text-brand' : s.effort >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{s.effort}%</p></div>
                <div><p className="text-xs text-slate-500">Attendance</p><p className={`font-bold text-sm ${s.attendance >= 90 ? 'text-brand' : s.attendance >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{s.attendance}%</p></div>
                <div><p className="text-xs text-slate-500">Completion</p><p className={`font-bold text-sm ${s.completionRate >= 70 ? 'text-brand' : s.completionRate >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{s.completionRate}%</p></div>
              </div>
              {s.weakTopics.length > 0 && (
                <div className="flex items-start gap-1.5">
                  <AlertTriangle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-700">Weak topics:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.weakTopics.map(t => <span key={t} className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">{t}</span>)}
                    </div>
                  </div>
                </div>
              )}
              {s.strongTopics.length > 0 && (
                <div className="flex items-start gap-1.5 mt-2">
                  <CheckCircle2 size={12} className="text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-700">Strong topics:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.strongTopics.map(t => <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">{t}</span>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Assessment Integrity Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-blue-600" />
          <h3 className="font-bold text-brand">Assessment Integrity</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">Monitor exam security and detect potential integrity issues.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Clean Submissions', value: '94%', desc: 'No integrity flags detected', color: 'bg-brand' },
            { label: 'Flagged Reviews', value: '3', desc: 'Require teacher review', color: 'bg-amber-500' },
            { label: 'Avg Time/Assessment', value: '24 min', desc: 'Within expected range', color: 'bg-slate-700' },
          ].map(item => (
            <div key={item.label} className="border border-slate-100 rounded-lg p-4">
              <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center text-white mb-2`}>
                <Shield size={14} />
              </div>
              <p className="text-xl font-bold text-brand">{item.value}</p>
              <p className="text-sm font-medium text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssignmentsTab() {
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'graded'>('all');
  const filtered = MY_ASSIGNMENTS.filter(a => filter === 'all' || a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">Assignments</h2>
        <div className="flex gap-2">
          {(['all', 'active', 'upcoming', 'graded'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
                filter === f ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  a.status === 'graded' ? 'bg-slate-100' : a.status === 'active' ? 'bg-amber-100' : 'bg-slate-100'
                }`}>
                  {a.status === 'graded' ? <CheckCircle2 size={22} className="text-brand" /> :
                   a.status === 'active' ? <Clock size={22} className="text-amber-600" /> :
                   <Calendar size={22} className="text-blue-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-brand">{a.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{a.class} - {a.type}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> Due: {a.dueDate}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {a.submitted}/{a.total} submitted</span>
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                a.status === 'graded' ? 'bg-slate-100 text-slate-700' :
                a.status === 'active' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {a.status}
              </span>
            </div>
            {a.status === 'active' && a.submitted > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Submissions</span>
                  <span>{Math.round(a.submitted / a.total * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-slate-500 h-1.5 rounded-full" style={{ width: `${a.submitted / a.total * 100}%` }} />
                </div>
                <button className="mt-3 px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition">
                  Grade Submissions ({a.submitted} pending)
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CreateTab() {
  const { user } = useAuth();
  const eduLevel = (user?.education_level || 'secondary') as 'primary' | 'secondary' | 'tertiary' | 'university' | 'vocational';

  const typeOptions: Record<string, { id: string; label: string; icon: React.ReactNode }[]> = {
    primary: [
      { id: 'homework', label: 'Homework', icon: <FileText size={20} /> },
      { id: 'quiz', label: 'Quiz', icon: <CheckCircle2 size={20} /> },
      { id: 'test', label: 'Test', icon: <BarChart3 size={20} /> },
    ],
    secondary: [
      { id: 'homework', label: 'Homework', icon: <FileText size={20} /> },
      { id: 'quiz', label: 'Quiz', icon: <CheckCircle2 size={20} /> },
      { id: 'test', label: 'Test', icon: <BarChart3 size={20} /> },
      { id: 'project', label: 'Project', icon: <GraduationCap size={20} /> },
    ],
    tertiary: [
      { id: 'coursework', label: 'Coursework', icon: <FileText size={20} /> },
      { id: 'test', label: 'Exam', icon: <BarChart3 size={20} /> },
    ],
    university: [
      { id: 'coursework', label: 'Coursework', icon: <FileText size={20} /> },
      { id: 'assignment', label: 'Assignment', icon: <CheckCircle2 size={20} /> },
      { id: 'research', label: 'Research', icon: <GraduationCap size={20} /> },
      { id: 'exam', label: 'Exam', icon: <BarChart3 size={20} /> },
    ],
    vocational: [
      { id: 'practical', label: 'Practical', icon: <Wrench size={20} /> },
      { id: 'assessment', label: 'Assessment', icon: <CheckCircle2 size={20} /> },
    ],
  };

  const levelLabels: Record<string, { unit: string; instructor: string; learner: string }> = {
    primary: { unit: 'Class', instructor: 'Teacher', learner: 'Pupil' },
    secondary: { unit: 'Class', instructor: 'Teacher', learner: 'Student' },
    tertiary: { unit: 'Program', instructor: 'Lecturer', learner: 'Student' },
    university: { unit: 'Course', instructor: 'Lecturer', learner: 'Student' },
    vocational: { unit: 'Batch', instructor: 'Instructor', learner: 'Trainee' },
  };

  const labels = levelLabels[eduLevel] || levelLabels.secondary;
  const types = typeOptions[eduLevel] || typeOptions.secondary;

  const [type, setType] = useState(types[0].id);
  const [title, setTitle] = useState('');
  const [selectedClass, setSelectedClass] = useState(MY_CLASSES[0]?.name || '');
  const [dueDate, setDueDate] = useState('');
  const [maxPoints, setMaxPoints] = useState('');
  const [weight, setWeight] = useState('');
  const [instructions, setInstructions] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [questions, setQuestions] = useState<{ id: number; text: string; points: string; type: 'open' | 'mcq' | 'short_answer'; options?: string[]; correctAnswer?: string }[]>([
    { id: 1, text: '', points: '', type: 'open' },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);

  const addQuestion = () => {
    setQuestions(prev => [...prev, { id: Date.now(), text: '', points: '', type: 'open' }]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateQuestion = (id: number, field: string, value: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const toggleMcq = (id: number) => {
    setQuestions(prev => prev.map(q => q.id === id ? {
      ...q,
      type: q.type === 'mcq' ? 'open' : 'mcq',
      options: q.type === 'mcq' ? undefined : ['', '', '', ''],
      correctAnswer: q.type === 'mcq' ? undefined : '',
    } : q));
  };

  const updateOption = (qId: number, optIdx: number, value: string) => {
    setQuestions(prev => prev.map(q => q.id === qId && q.options ? {
      ...q,
      options: q.options.map((o, i) => i === optIdx ? value : o),
    } : q));
  };

  const setCorrectAnswer = (qId: number, answer: string) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, correctAnswer: answer } : q));
  };

  const handleCreate = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setTitle(''); setDueDate(''); setMaxPoints(''); setWeight(''); setInstructions(''); setTimeLimit('');
    setQuestions([{ id: Date.now(), text: '', points: '', type: 'open' }]);
  };

  const handleSaveDraft = () => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2000);
  };

  const totalPoints = questions.reduce((sum, q) => sum + (parseInt(q.points) || 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {showSuccess && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-brand" />
          <div>
            <p className="font-bold text-brand text-sm">Assignment Created Successfully!</p>
            <p className="text-xs text-slate-700">Students will be notified and can begin working.</p>
          </div>
        </div>
      )}
      {savedDraft && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
          <FileText size={20} className="text-blue-600" />
          <p className="font-bold text-blue-900 text-sm">Draft Saved</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-brand">Create {type === 'coursework' ? 'Coursework' : type === 'practical' ? 'Practical Assessment' : type === 'research' ? 'Research Assignment' : type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full font-medium">{eduLevel.charAt(0).toUpperCase() + eduLevel.slice(1)} Level</span>
        </div>
        <p className="text-slate-500 mb-6 text-sm">Create a new assessment for your {labels.unit.toLowerCase()}s</p>

        {/* Type Selection */}
        <div className={`grid gap-3 mb-6`} style={{ gridTemplateColumns: `repeat(${types.length}, 1fr)` }}>
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`p-3 rounded-lg border text-center transition ${
                type === t.id
                  ? 'border-brand bg-slate-50 text-brand'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-center mb-1">{t.icon}</div>
              <p className="text-xs font-medium">{t.label}</p>
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={`e.g. ${type === 'quiz' ? 'Trigonometry Quiz' : type === 'coursework' ? 'Data Structures Coursework' : type === 'practical' ? 'Welding Assessment' : type === 'research' ? 'Research Proposal' : 'Quadratic Equations Worksheet'}`}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{labels.unit}</label>
              <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm">
                {MY_CLASSES.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Points</label>
              <input type="number" value={maxPoints} onChange={e => setMaxPoints(e.target.value)} placeholder="e.g. 20" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Weight (%)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 10" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
            </div>
          </div>

          {(type === 'quiz' || type === 'exam' || type === 'test' || type === 'assessment') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time Limit (minutes)</label>
              <input type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} placeholder="e.g. 30" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">General Instructions</label>
            <textarea
              rows={3}
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Enter general instructions for this assessment..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm resize-none"
            />
          </div>

          {/* Questions Section */}
          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-brand">Questions</h3>
                <p className="text-xs text-slate-500">{questions.length} question{questions.length !== 1 ? 's' : ''} &middot; {totalPoints || 0} total points from questions</p>
              </div>
              <button onClick={addQuestion} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-medium rounded-lg hover:bg-brand-600 transition">
                <Plus size={14} /> Add Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-700">Question {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleMcq(q.id)} className={`text-[10px] px-2 py-1 rounded font-medium transition ${q.type === 'mcq' ? 'bg-brand text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>
                        {q.type === 'mcq' ? 'MCQ' : 'Open-Ended'}
                      </button>
                      {questions.length > 1 && (
                        <button onClick={() => removeQuestion(q.id)} className="p-1 text-red-400 hover:text-red-600 transition">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={q.text}
                    onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                    placeholder="Enter question text..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-brand focus:border-transparent outline-none mb-2"
                  />

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-slate-500">Points:</label>
                      <input
                        type="number"
                        value={q.points}
                        onChange={e => updateQuestion(q.id, 'points', e.target.value)}
                        placeholder="5"
                        className="w-16 px-2 py-1 border border-slate-200 rounded text-xs text-center"
                      />
                    </div>
                    {q.type === 'mcq' && q.options && (
                      <span className="text-[10px] text-brand font-medium">Select correct answer below</span>
                    )}
                  </div>

                  {q.type === 'mcq' && q.options && (
                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <button
                            onClick={() => setCorrectAnswer(q.id, String.fromCharCode(65 + optIdx))}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition ${
                              q.correctAnswer === String.fromCharCode(65 + optIdx)
                                ? 'border-brand bg-brand text-white'
                                : 'border-slate-300 text-slate-400 hover:border-slate-400'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </button>
                          <input
                            type="text"
                            value={opt}
                            onChange={e => updateOption(q.id, optIdx, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                            className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleCreate} className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2">
              <Plus size={18} />
              Create {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
            <button onClick={handleSaveDraft} className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherSpeakToTutorTab() {
  const [activeCall, setActiveCall] = useState<number | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const callLog = [
    { id: 1, student: 'Namuli Sarah', subject: 'Mathematics', time: '10:30 AM', duration: '5:23', status: 'completed' as const, topic: 'Quadratic equations help' },
    { id: 2, student: 'Okello David', subject: 'Physics', time: '9:15 AM', duration: '3:45', status: 'completed' as const, topic: 'Newton\'s Laws explanation' },
    { id: 3, student: 'Nakamya Grace', subject: 'Mathematics', time: '8:45 AM', duration: '8:12', status: 'completed' as const, topic: 'Integration practice' },
    { id: 4, student: 'Ssewankambo James', subject: 'Chemistry', time: 'Yesterday', duration: '4:30', status: 'missed' as const, topic: 'Organic chemistry quiz review' },
    { id: 5, student: 'Achieng Mary', subject: 'Mathematics', time: 'Yesterday', duration: '6:15', status: 'completed' as const, topic: 'Probability questions' },
  ];

  const incomingCalls = [
    { id: 10, student: 'Mugisha Peter', subject: 'Biology', topic: 'Genetics homework help' },
  ];

  const answerCall = (id: number) => {
    setActiveCall(id);
    setCallDuration(0);
    timerRef.current = setInterval(() => setCallDuration(p => p + 1), 1000);
  };

  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveCall(null);
    setCallDuration(0);
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const currentCallStudent = incomingCalls.find(c => c.id === activeCall);

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-brand">Student Call Log</h2><p className="text-slate-500 text-sm mt-1">Incoming calls from students and your call history</p></div>

      {activeCall && currentCallStudent && (
        <div className="bg-brand rounded-2xl p-8 text-white text-center">
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl font-bold">{currentCallStudent.student[0]}</span></div>
          <h3 className="text-xl font-bold">{currentCallStudent.student}</h3>
          <p className="text-slate-400 text-sm mt-1">{currentCallStudent.subject} - {currentCallStudent.topic}</p>
          <p className="text-2xl font-mono font-bold text-emerald-400 mt-4">{fmt(callDuration)}</p>
          <p className="text-emerald-400 text-xs">Connected</p>
          <button onClick={endCall} className="mt-6 w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center mx-auto transition"><span className="w-6 h-6 bg-white rounded-full" /></button>
        </div>
      )}

      {!activeCall && incomingCalls.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-bold text-amber-900 mb-3">Incoming Calls</h3>
          {incomingCalls.map(c => (
            <div key={c.id} className="flex items-center justify-between bg-white rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center animate-pulse"><span className="text-white font-bold">{c.student[0]}</span></div>
                <div><p className="font-semibold text-brand text-sm">{c.student}</p><p className="text-xs text-slate-500">{c.subject} - {c.topic}</p></div>
              </div>
              <button onClick={() => answerCall(c.id)} className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition">Answer</button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-brand mb-4">Call History</h3>
        <div className="space-y-3">
          {callLog.map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.status === 'completed' ? 'bg-slate-100' : 'bg-red-50'}`}>
                  <span className={`font-bold text-sm ${c.status === 'completed' ? 'text-slate-700' : 'text-red-600'}`}>{c.student[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-brand text-sm">{c.student}</p>
                  <p className="text-xs text-slate-500">{c.topic}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${c.status === 'completed' ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-600'}`}>{c.status}</span>
                <p className="text-xs text-slate-400 mt-1">{c.time} &middot; {c.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeacherAssistedLearningTab() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const paths = [
    { id: 'differentiation', title: 'Differentiation Strategies', desc: 'Methods for supporting diverse learners in mixed-ability classrooms', lessons: 8, duration: '2 weeks' },
    { id: 'accessibility', title: 'Accessibility & Inclusive Teaching', desc: 'Support students with disabilities: visual, hearing, cognitive, and motor impairments', lessons: 10, duration: '3 weeks' },
    { id: 'sign-language', title: 'Basic Sign Language for Teachers', desc: 'Learn Ugandan Sign Language basics to communicate with deaf students', lessons: 12, duration: '4 weeks' },
    { id: 'assessment-design', title: 'Assessment Design Workshop', desc: 'Create effective assessments aligned to learning objectives', lessons: 6, duration: '1 week' },
    { id: 'tech-integration', title: 'Technology Integration', desc: 'Using digital tools to enhance teaching and learning', lessons: 10, duration: '3 weeks' },
    { id: 'classroom-mgmt', title: 'Classroom Management', desc: 'Evidence-based strategies for effective classroom management', lessons: 5, duration: '1 week' },
  ];

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-brand">Assisted Learning</h2><p className="text-slate-500 text-sm mt-1">Professional development and tools to support every learner</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paths.map(p => (
          <div key={p.id} className={`bg-white rounded-xl border p-5 transition cursor-pointer ${selectedPath === p.id ? 'border-brand' : 'border-slate-200 hover:border-slate-300'}`} onClick={() => setSelectedPath(p.id)}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-slate-400">{p.duration}</span></div>
            <h3 className="font-bold text-brand text-sm">{p.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
            <p className="text-xs text-slate-400 mt-2">{p.lessons} modules</p>
            {selectedPath === p.id && <button className="mt-3 w-full py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition" onClick={e => { e.stopPropagation(); }}>Start Path</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TeacherLifelongLearningTab() {
  const resources = [
    { category: 'Professional Development', items: [
      { title: 'Uganda National Teacher Standards', desc: 'Review and align with national teaching standards', type: 'Self-paced' },
      { title: 'Continuous Professional Development (CPD)', desc: 'Track and plan your CPD hours and activities', type: 'Tracker' },
      { title: 'New Curriculum Implementation', desc: 'Master the updated UCE/UACE curriculum changes', type: 'Workshop' },
    ]},
    { category: 'Leadership & Growth', items: [
      { title: 'Department Head Preparation', desc: 'Skills for academic leadership and department management', type: 'Mentorship' },
      { title: 'Research & Publication', desc: 'Contribute to educational research in Uganda', type: 'Self-paced' },
      { title: 'School Administration Fundamentals', desc: 'Pathway from teacher to school administrator', type: 'Mentorship' },
    ]},
    { category: 'Wellbeing & Balance', items: [
      { title: 'Teacher Wellness Program', desc: 'Stress management and work-life balance for educators', type: 'Workshop' },
      { title: 'Financial Planning for Teachers', desc: 'Savings, investments, and retirement planning', type: 'Self-paced' },
    ]},
  ];

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-brand">Lifelong Learning</h2><p className="text-slate-500 text-sm mt-1">Continue growing as an educator throughout your career</p></div>
      {resources.map(g => (
        <div key={g.category}>
          <h3 className="font-bold text-brand mb-3">{g.category}</h3>
          <div className="space-y-3">
            {g.items.map(item => (
              <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                <div><h4 className="font-semibold text-brand text-sm">{item.title}</h4><p className="text-xs text-slate-500 mt-0.5">{item.desc}</p><span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded mt-1 inline-block">{item.type}</span></div>
                <button className="px-3 py-1.5 bg-brand text-white text-xs font-medium rounded-lg hover:bg-brand-600 transition flex-shrink-0 ml-4">Explore</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TeacherWhiteboardTab() {
  const boards = [
    { id: 1, title: 'S4 Math - Quadratic Equations', lastEdited: '1 hr ago', shared: true, students: 38 },
    { id: 2, title: 'S4 Physics - Force Diagrams', lastEdited: '3 hrs ago', shared: true, students: 35 },
    { id: 3, title: 'Lesson Plan Sketches', lastEdited: 'Yesterday', shared: false, students: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-brand">Whiteboard</h2><p className="text-slate-500 text-sm mt-1">Collaborative whiteboard powered by Microsoft Whiteboard</p></div>
        <a href="https://whiteboard.microsoft.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition">Open Microsoft Whiteboard</a>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-brand mb-2">Microsoft Whiteboard for Teaching</h3>
        <p className="text-sm text-slate-500 mb-4">Create interactive whiteboards for your classes. Students can join and collaborate in real-time during lessons.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Live Teaching', desc: 'Draw and explain concepts in real-time to your class' },
            { title: 'Student Collaboration', desc: 'Students can join and contribute to the board' },
            { title: 'Export & Share', desc: 'Save boards as images or share links with your class' },
          ].map(f => (
            <div key={f.title} className="p-3 bg-slate-50 rounded-lg"><p className="font-medium text-brand text-sm">{f.title}</p><p className="text-xs text-slate-500 mt-0.5">{f.desc}</p></div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-brand mb-4">My Class Whiteboards</h3>
        <div className="space-y-3">
          {boards.map(b => (
            <div key={b.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center"><PenTool size={18} className="text-slate-600" /></div>
                <div><p className="font-medium text-brand text-sm">{b.title}</p><p className="text-xs text-slate-400">Last edited {b.lastEdited}{b.shared && ` - Shared with ${b.students} students`}</p></div>
              </div>
              <a href="https://whiteboard.microsoft.com/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-brand text-white text-xs font-medium rounded-lg hover:bg-brand-600 transition">Open</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeacherMaterialsTab() {
  const { user } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadClassLevel, setUploadClassLevel] = useState('S4');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadToast, setUploadToast] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [materials, setMaterials] = useState([
    { id: '1', title: 'Quadratic Equations - Worked Examples', subject: 'Mathematics', type: 'PDF', size: '2.3 MB', uploaded: '2 days ago', fileUrl: '', downloads: 45 },
    { id: '2', title: "Newton's Laws Video Explanation", subject: 'Physics', type: 'Video', size: '18 min', uploaded: '5 days ago', fileUrl: '', downloads: 32 },
    { id: '3', title: 'Integration Practice Problems', subject: 'Mathematics', type: 'PDF', size: '1.1 MB', uploaded: '1 week ago', fileUrl: '', downloads: 67 },
    { id: '4', title: 'Cell Division Diagram Notes', subject: 'Biology', type: 'PDF', size: '3.4 MB', uploaded: '2 weeks ago', fileUrl: '', downloads: 28 },
  ]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const getFileType = (file: File) => {
    if (file.type.startsWith('video/')) return 'Video';
    if (file.type === 'application/pdf') return 'PDF';
    return 'Document';
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      'application/pdf', 'video/mp4', 'video/webm',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg', 'image/png',
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Unsupported file type. Use PDF, MP4, DOC, PPT, or images.');
      return;
    }
    if (file.size > 52428800) {
      setUploadError('File too large. Maximum size is 50MB.');
      return;
    }
    setSelectedFile(file);
    setUploadError('');
    if (!uploadTitle) setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadTitle.trim() || !uploadSubject) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError('');

    try {
      const userId = user?.id || 'unknown';
      const timestamp = Date.now();
      const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${userId}/${timestamp}_${sanitizedName}`;

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) { clearInterval(progressInterval); return 90; }
          return prev + 10;
        });
      }, 200);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      setUploadProgress(95);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('study-materials')
        .getPublicUrl(filePath);

      const fileUrl = urlData?.publicUrl || '';
      const fileType = getFileType(selectedFile);
      const fileSize = formatFileSize(selectedFile.size);

      // Insert into courses table
      const { error: dbError } = await supabase.from('courses').insert({
        material_id: `MAT-${timestamp}`,
        school_id: user?.school_id || null,
        teacher_id: userId,
        title: uploadTitle.trim(),
        subject: uploadSubject,
        class_level: uploadClassLevel,
        description: uploadDescription.trim() || null,
        file_url: fileUrl,
        is_premium: false,
        is_global: false,
        verification_status: 'pending',
        allow_download: true,
      });

      if (dbError) {
        // Storage upload succeeded but DB insert failed - still show the material locally
        console.error('DB insert error:', dbError);
      }

      setUploadProgress(100);

      // Add to local state
      setMaterials(prev => [
        {
          id: `local-${timestamp}`,
          title: uploadTitle.trim(),
          subject: uploadSubject,
          type: fileType,
          size: fileSize,
          uploaded: 'Just now',
          fileUrl,
          downloads: 0,
        },
        ...prev,
      ]);

      setUploadToast(`"${uploadTitle}" uploaded successfully!`);
      resetForm();
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setShowUpload(false);
    setSelectedFile(null);
    setUploadTitle('');
    setUploadSubject('');
    setUploadDescription('');
    setUploadClassLevel('S4');
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setUploadToast(''), 3000);
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    try {
      // Extract file path from URL
      if (fileUrl) {
        const urlParts = fileUrl.split('/study-materials/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1].split('?')[0];
          await supabase.storage.from('study-materials').remove([filePath]);
        }
      }
      // Delete from courses table
      await supabase.from('courses').delete().eq('id', id);
    } catch {
      // Silently handle - still remove from local state
    }
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {uploadToast && (
        <div className="bg-brand text-white px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 size={16} /> {uploadToast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand">Study Materials</h2>
          <p className="text-slate-500 text-sm mt-1">Upload and manage learning resources for your students</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2">
          <Plus size={16} /> Upload Material
        </button>
      </div>

      {showUpload && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand">Upload New Material</h3>
            <button onClick={resetForm} className="p-1 hover:bg-slate-100 rounded"><X size={18} className="text-slate-400" /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input type="text" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="e.g. Quadratic Equations Practice Set" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select value={uploadSubject} onChange={e => setUploadSubject(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none">
                  <option value="">Select subject</option>
                  <option>Mathematics</option><option>Physics</option><option>Biology</option>
                  <option>Chemistry</option><option>English</option><option>History</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class Level</label>
                <select value={uploadClassLevel} onChange={e => setUploadClassLevel(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none">
                  <option>S1</option><option>S2</option><option>S3</option><option>S4</option>
                  <option>S5</option><option>S6</option><option>P1</option><option>P2</option>
                  <option>P3</option><option>P4</option><option>P5</option><option>P6</option><option>P7</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description (optional)</label>
              <textarea rows={2} value={uploadDescription} onChange={e => setUploadDescription(e.target.value)} placeholder="Brief description of the material..." className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">File</label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                  isDragOver ? 'border-brand bg-slate-50' : selectedFile ? 'border-brand bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input ref={fileInputRef} type="file" onChange={handleInputChange} accept=".pdf,.mp4,.webm,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png" className="hidden" />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileType(selectedFile) === 'Video' ? 'bg-rose-600' : 'bg-brand'}`}>
                      {getFileType(selectedFile) === 'Video' ? <Video size={18} className="text-white" /> : <FileText size={18} className="text-white" />}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-brand text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)} - {getFileType(selectedFile)}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="ml-2 p-1 hover:bg-slate-200 rounded"><X size={14} className="text-slate-500" /></button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus size={20} className="text-slate-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Click to select file or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, MP4, DOC, PPT, JPG, PNG up to 50MB</p>
                  </>
                )}
              </div>
            </div>

            {uploadError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{uploadError}</div>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Uploading...</span>
                  <span className="font-medium text-brand">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-brand h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !uploadTitle.trim() || !uploadSubject || uploading}
                className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : 'Upload File'}
              </button>
              <button onClick={resetForm} disabled={uploading} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition disabled:opacity-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-brand mb-4">My Uploaded Materials ({materials.length})</h3>
        {materials.length === 0 ? (
          <div className="text-center py-8">
            <FileText size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No materials uploaded yet. Click "Upload Material" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.type === 'Video' ? 'bg-rose-600' : 'bg-brand'}`}>
                    {m.type === 'Video' ? <Video size={18} className="text-white" /> : <FileText size={18} className="text-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-brand text-sm">{m.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>{m.subject}</span>
                      <span>{m.type}</span>
                      <span>{m.size}</span>
                      <span>{m.downloads} downloads</span>
                      <span>Uploaded {m.uploaded}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.fileUrl && (
                    <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-slate-100 rounded-lg transition" title="Download">
                      <Download size={14} className="text-slate-500" />
                    </a>
                  )}
                  <button onClick={() => handleDelete(m.id, m.fileUrl)} className="p-1.5 hover:bg-red-50 rounded-lg transition" title="Delete">
                    <X size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChatTab({ chatInput, setChatInput, selectedChat, setSelectedChat, showContacts, setShowContacts }: {
  chatInput: string;
  setChatInput: (v: string) => void;
  selectedChat: number;
  setSelectedChat: (v: number) => void;
  showContacts: boolean;
  setShowContacts: (v: boolean) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
      <div className="flex h-full">
        {/* Contact List */}
        <div className={`${showContacts ? 'w-full md:w-80' : 'hidden md:block md:w-80'} border-r border-slate-200 flex flex-col`}>
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-brand">Messages</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {CHAT_CONTACTS.map(contact => (
              <button
                key={contact.id}
                onClick={() => { setSelectedChat(contact.id); setShowContacts(false); }}
                className={`w-full text-left p-4 hover:bg-slate-50 transition border-b border-slate-100 ${
                  selectedChat === contact.id ? 'bg-slate-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    contact.isGroup ? 'bg-slate-100' : 'bg-gradient-to-br from-brand-700 to-brand-800'
                  }`}>
                    <span className={`text-sm font-semibold ${contact.isGroup ? 'text-brand' : 'text-white'}`}>
                      {contact.isGroup ? <Users size={18} /> : contact.name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-brand text-sm truncate">{contact.name}</p>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{contact.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{contact.lastMessage}</p>
                  </div>
                  {contact.unread > 0 && (
                    <span className="w-5 h-5 bg-brand rounded-full text-[10px] text-white flex items-center justify-center font-bold flex-shrink-0">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${!showContacts ? 'w-full md:flex-1' : 'hidden md:flex md:flex-1'} flex flex-col`}>
          <div className="p-4 border-b border-slate-200 flex items-center gap-3">
            <button onClick={() => setShowContacts(true)} className="md:hidden p-1 hover:bg-slate-100 rounded">
              <ChevronRight size={20} className="text-slate-600 rotate-180" />
            </button>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              CHAT_CONTACTS[selectedChat - 1]?.isGroup ? 'bg-slate-100' : 'bg-gradient-to-br from-brand-700 to-brand-800'
            }`}>
              <span className={`text-xs font-semibold ${CHAT_CONTACTS[selectedChat - 1]?.isGroup ? 'text-brand' : 'text-white'}`}>
                {CHAT_CONTACTS[selectedChat - 1]?.name[0]}
              </span>
            </div>
            <div>
              <p className="font-semibold text-brand text-sm">{CHAT_CONTACTS[selectedChat - 1]?.name}</p>
              <p className="text-[10px] text-slate-500">{CHAT_CONTACTS[selectedChat - 1]?.role}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {CHAT_MESSAGES.map(msg => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.isMe
                    ? 'bg-brand text-white rounded-br-md'
                    : 'bg-slate-100 text-brand rounded-bl-md'
                }`}>
                  <p>{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${msg.isMe ? 'text-slate-200' : 'text-slate-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
              />
              <button className="w-10 h-10 bg-brand hover:bg-brand-600 rounded-full flex items-center justify-center transition">
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
