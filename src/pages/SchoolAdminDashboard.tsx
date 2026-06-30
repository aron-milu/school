import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogOut, BookOpen, Users, Plus, Search, X,
  GraduationCap, UserCheck, Bell, Settings,
  Eye, MoreVertical, Phone, Mail,
  Calendar, BarChart3, CreditCard, CheckCircle2
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDashboardTab, getDashboardTabPath } from '../lib/dashboardRoutes';

type Tab = 'overview' | 'classes' | 'students' | 'teachers' | 'fees';
const TAB_IDS: readonly Tab[] = ['overview', 'classes', 'students', 'teachers', 'fees'];

const CLASSES = [
  { id: 1, name: 'Senior 1 Blue', level: 'S1', stream: 'Blue', students: 45, teacher: 'Mr. Okello James', subjects: 10 },
  { id: 2, name: 'Senior 1 Red', level: 'S1', stream: 'Red', students: 42, teacher: 'Ms. Nakamya Grace', subjects: 10 },
  { id: 3, name: 'Senior 2 Blue', level: 'S2', stream: 'Blue', students: 40, teacher: 'Dr. Mugisha Peter', subjects: 10 },
  { id: 4, name: 'Senior 2 Red', level: 'S2', stream: 'Red', students: 38, teacher: 'Mrs. Achieng Ruth', subjects: 10 },
  { id: 5, name: 'Senior 3 Green', level: 'S3', stream: 'Green', students: 35, teacher: 'Mr. Ssewankambo D.', subjects: 8 },
  { id: 6, name: 'Senior 4 Blue', level: 'S4', stream: 'Blue', students: 38, teacher: 'Ms. Apolot Sarah', subjects: 8 },
  { id: 7, name: 'Senior 4 Red', level: 'S4', stream: 'Red', students: 35, teacher: 'Mr. Ochieng Paul', subjects: 8 },
  { id: 8, name: 'Senior 5 Arts', level: 'S5', stream: 'Arts', students: 30, teacher: 'Ms. Nalubega Anne', subjects: 4 },
  { id: 9, name: 'Senior 5 Sciences', level: 'S5', stream: 'Sciences', students: 28, teacher: 'Mr. Wambuzi Sam', subjects: 4 },
  { id: 10, name: 'Senior 6 Arts', level: 'S6', stream: 'Arts', students: 25, teacher: 'Ms. Kintu Victoria', subjects: 4 },
  { id: 11, name: 'Senior 6 Sciences', level: 'S6', stream: 'Sciences', students: 22, teacher: 'Mr. Ssentongo David', subjects: 4 },
];

const STUDENTS = [
  { id: 1, name: 'Namuli Sarah', class: 'S4 Blue', regNo: 'LUB/2026/001', gender: 'Female', guardian: 'Mr. Namuli John', phone: '+256 700 100001', status: 'active' },
  { id: 2, name: 'Okello David', class: 'S4 Blue', regNo: 'LUB/2026/002', gender: 'Male', guardian: 'Mrs. Okello Mary', phone: '+256 700 100002', status: 'active' },
  { id: 3, name: 'Nakamya Patience', class: 'S4 Red', regNo: 'LUB/2026/003', gender: 'Female', guardian: 'Mr. Nakamya Peter', phone: '+256 700 100003', status: 'active' },
  { id: 4, name: 'Mugisha Alex', class: 'S3 Green', regNo: 'LUB/2026/004', gender: 'Male', guardian: 'Mrs. Mugisha Jane', phone: '+256 700 100004', status: 'active' },
  { id: 5, name: 'Achieng Grace', class: 'S2 Blue', regNo: 'LUB/2026/005', gender: 'Female', guardian: 'Mr. Achieng Robert', phone: '+256 700 100005', status: 'active' },
  { id: 6, name: 'Ssewankambo Mark', class: 'S1 Blue', regNo: 'LUB/2026/006', gender: 'Male', guardian: 'Mrs. Ssewankambo Agnes', phone: '+256 700 100006', status: 'inactive' },
  { id: 7, name: 'Apolot Vivian', class: 'S5 Sciences', regNo: 'LUB/2026/007', gender: 'Female', guardian: 'Mr. Apolot James', phone: '+256 700 100007', status: 'active' },
  { id: 8, name: 'Ochieng Brian', class: 'S6 Sciences', regNo: 'LUB/2026/008', gender: 'Male', guardian: 'Mrs. Ochieng Sarah', phone: '+256 700 100008', status: 'active' },
];

const TEACHERS = [
  { id: 1, name: 'Mr. Okello James', staffId: 'TCH/001', subjects: ['Mathematics', 'Physics'], classes: ['S4 Blue', 'S4 Red', 'S3 Green'], phone: '+256 700 200001', email: 'okello@lubiri.sc.ug', status: 'active' },
  { id: 2, name: 'Ms. Nakamya Grace', staffId: 'TCH/002', subjects: ['Physics', 'Mathematics'], classes: ['S1 Blue', 'S1 Red', 'S2 Blue'], phone: '+256 700 200002', email: 'nakamya@lubiri.sc.ug', status: 'active' },
  { id: 3, name: 'Dr. Mugisha Peter', staffId: 'TCH/003', subjects: ['Biology', 'Chemistry'], classes: ['S2 Blue', 'S2 Red', 'S3 Green'], phone: '+256 700 200003', email: 'mugisha@lubiri.sc.ug', status: 'active' },
  { id: 4, name: 'Mrs. Achieng Ruth', staffId: 'TCH/004', subjects: ['Chemistry'], classes: ['S4 Blue', 'S4 Red'], phone: '+256 700 200004', email: 'achieng@lubiri.sc.ug', status: 'active' },
  { id: 5, name: 'Mr. Ssewankambo D.', staffId: 'TCH/005', subjects: ['English Language'], classes: ['S3 Green', 'S5 Arts'], phone: '+256 700 200005', email: 'ssewankambo@lubiri.sc.ug', status: 'active' },
  { id: 6, name: 'Ms. Apolot Sarah', staffId: 'TCH/006', subjects: ['History', 'Geography'], classes: ['S4 Blue', 'S4 Red', 'S6 Arts'], phone: '+256 700 200006', email: 'apolot@lubiri.sc.ug', status: 'on_leave' },
];

export default function SchoolAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>(() => getDashboardTab(window.location.pathname, TAB_IDS, 'overview'));
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState<'class' | 'student' | 'teacher' | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const tab = getDashboardTab(location.pathname, TAB_IDS, 'overview');
    setActiveTab(tab);

    const legacyHashTab = location.hash.replace('#', '') as Tab;
    if (TAB_IDS.includes(legacyHashTab)) {
      navigate(getDashboardTabPath('/school-admin', legacyHashTab), { replace: true });
    } else if (location.pathname === '/school-admin' || location.pathname === '/school-admin/') {
      navigate(getDashboardTabPath('/school-admin', tab), { replace: true });
    }
  }, [location.pathname, location.hash, navigate]);

  const navigateToTab = (tab: Tab) => {
    setActiveTab(tab);
    navigate(getDashboardTabPath('/school-admin', tab));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-brand text-sm">Soma365</h1>
              <p className="text-[10px] text-slate-500">{({ primary: 'Primary School', secondary: 'Secondary School', university: 'University', tertiary: 'Tertiary College', vocational: 'Vocational Institute' } as Record<string, string>)[user?.education_level || 'secondary'] || 'Secondary School'} - Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
              <Bell size={18} className="text-amber-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">5</span>
            </button>
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-brand text-sm">{user?.full_name}</p>
              <p className="text-[10px] text-slate-500">{({ primary: 'Primary School', secondary: 'Secondary School', university: 'University', tertiary: 'Tertiary College', vocational: 'Vocational Institute' } as Record<string, string>)[user?.education_level || 'secondary'] || 'Secondary School'} Administrator</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg transition" title="Logout">
              <LogOut size={18} className="text-red-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation moved to sidebar; route paths control active page. */}

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {activeTab === 'overview' && <OverviewTab onNavigate={navigateToTab} onAdd={setShowAddModal} />}
        {activeTab === 'classes' && <ClassesTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} onAdd={() => setShowAddModal('class')} />}
        {activeTab === 'students' && <StudentsTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} onAdd={() => setShowAddModal('student')} />}
        {activeTab === 'teachers' && <TeachersTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} onAdd={() => setShowAddModal('teacher')} />}
        {activeTab === 'fees' && <FeesTab />}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {showAddModal === 'class' && <AddClassForm onClose={() => setShowAddModal(null)} />}
            {showAddModal === 'student' && <AddStudentForm onClose={() => setShowAddModal(null)} />}
            {showAddModal === 'teacher' && <AddTeacherForm onClose={() => setShowAddModal(null)} />}
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ onNavigate, onAdd }: { onNavigate: (tab: Tab) => void; onAdd: (type: 'class' | 'student' | 'teacher') => void }) {
  const stats = [
    { label: 'Total Students', value: '1,250', change: '+45 this term', icon: <Users size={20} />, color: 'bg-brand text-white' },
    { label: 'Total Teachers', value: '68', change: '+3 new', icon: <UserCheck size={20} />, color: 'bg-brand text-white' },
    { label: 'Active Classes', value: '24', change: 'All levels S1-S6', icon: <GraduationCap size={20} />, color: 'bg-slate-600 text-white' },
    { label: 'Avg Attendance', value: '94%', change: '+2% from last term', icon: <BarChart3 size={20} />, color: 'bg-slate-700 text-white' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} mb-3`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-brand">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-xs text-brand mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-brand mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Class', icon: <GraduationCap size={20} />, action: () => onAdd('class') },
            { label: 'Enroll Student', icon: <Users size={20} />, action: () => onAdd('student') },
            { label: 'Register Teacher', icon: <UserCheck size={20} />, action: () => onAdd('teacher') },
            { label: 'View Reports', icon: <BarChart3 size={20} />, action: () => onNavigate('classes') },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition text-center"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-2 text-brand">{item.icon}</div>
              <p className="font-medium text-brand text-sm">{item.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-brand">Classes by Level</h3>
            <button onClick={() => onNavigate('classes')} className="text-sm text-brand font-medium hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map(level => {
              const levelClasses = CLASSES.filter(c => c.level === level);
              const totalStudents = levelClasses.reduce((sum, c) => sum + c.students, 0);
              return (
                <div key={level} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <span className="text-brand font-bold text-sm">{level}</span>
                    </div>
                    <div>
                      <p className="font-medium text-brand text-sm">Senior {level.slice(1)}</p>
                      <p className="text-xs text-slate-500">{levelClasses.length} classes - {levelClasses.map(c => c.stream).join(', ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brand text-sm">{totalStudents}</p>
                    <p className="text-xs text-slate-500">students</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-brand mb-4">Upcoming</h3>
            <div className="space-y-3">
              {[
                { text: 'Term 2 results due', time: '5 days', color: 'bg-slate-50 border-slate-200' },
                { text: 'Staff development day', time: '10 days', color: 'bg-slate-50 border-slate-200' },
                { text: 'License renewal', time: '20 days', color: 'bg-red-50 border-red-200' },
                { text: 'Parent-teacher meeting', time: '14 days', color: 'bg-slate-50 border-slate-200' },
              ].map(item => (
                <div key={item.text} className={`p-3 ${item.color} border rounded-lg`}>
                  <p className="font-medium text-brand text-sm">{item.text}</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Calendar size={10} /> In {item.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* School Info */}
          <div className="bg-gradient-to-br from-brand to-brand-600 rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-3">Lubiri Secondary School</h3>
            <div className="space-y-2 text-sm">
              <div><span className="opacity-75">Reg:</span> <span className="font-semibold">LUB-2026</span></div>
              <div><span className="opacity-75">District:</span> <span className="font-semibold">Kampala</span></div>
              <div><span className="opacity-75">Tier:</span> <span className="font-semibold">Premium</span></div>
              <div><span className="opacity-75">Status:</span> <span className="font-semibold">Active</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassesTab({ searchQuery, setSearchQuery, onAdd }: { searchQuery: string; setSearchQuery: (q: string) => void; onAdd: () => void }) {
  const filtered = CLASSES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">Classes</h2>
        <button onClick={onAdd} className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2">
          <Plus size={16} /> Add Class
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search classes..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cls => (
          <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="text-brand font-bold text-sm">{cls.level}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-brand">{cls.name}</h3>
                  <p className="text-xs text-slate-500">{cls.teacher}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-slate-100 rounded"><MoreVertical size={16} className="text-slate-400" /></button>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1"><Users size={12} /> {cls.students} students</span>
              <span className="flex items-center gap-1"><BookOpen size={12} /> {cls.subjects} subjects</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1.5 bg-slate-50 text-brand text-xs font-medium rounded-lg hover:bg-slate-100 transition flex items-center justify-center gap-1">
                <Eye size={12} /> View
              </button>
              <button className="flex-1 px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-1">
                <Settings size={12} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentsTab({ searchQuery, setSearchQuery, onAdd }: { searchQuery: string; setSearchQuery: (q: string) => void; onAdd: () => void }) {
  const filtered = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.regNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">Students</h2>
        <button onClick={onAdd} className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2">
          <Plus size={16} /> Enroll Student
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, class, or reg number..."
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
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Reg No</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Class</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Guardian</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Status</th>
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
                        <p className="text-xs text-slate-500">{student.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{student.regNo}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{student.class}</td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-slate-600">{student.guardian}</p>
                    <p className="text-xs text-slate-400">{student.phone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      student.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-brand hover:text-brand-600 text-sm font-medium">View</button>
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

function TeachersTab({ searchQuery, setSearchQuery, onAdd }: { searchQuery: string; setSearchQuery: (q: string) => void; onAdd: () => void }) {
  const filtered = TEACHERS.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">Teachers</h2>
        <button onClick={onAdd} className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2">
          <Plus size={16} /> Register Teacher
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or subject..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(teacher => (
          <div key={teacher.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-brand font-semibold text-sm">{teacher.name.split(' ').pop()?.[0]}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-brand text-sm">{teacher.name}</h3>
                  <p className="text-xs text-slate-500">{teacher.staffId}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                teacher.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {teacher.status === 'on_leave' ? 'On Leave' : teacher.status}
              </span>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <BookOpen size={12} /> Subjects: {teacher.subjects.join(', ')}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <GraduationCap size={12} /> Classes: {teacher.classes.join(', ')}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone size={12} /> {teacher.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail size={12} /> {teacher.email}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1.5 bg-slate-50 text-brand text-xs font-medium rounded-lg hover:bg-slate-100 transition flex items-center justify-center gap-1">
                <Eye size={12} /> View
              </button>
              <button className="flex-1 px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-1">
                <Settings size={12} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddClassForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-5" onSubmit={e => { e.preventDefault(); onClose(); }}>
      <h3 className="text-xl font-bold text-brand">Create New Class</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Class Level</label>
          <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm">
            <option>S1</option><option>S2</option><option>S3</option><option>S4</option><option>S5</option><option>S6</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Stream</label>
          <input type="text" placeholder="e.g. Blue" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Class Teacher</label>
          <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm">
            {TEACHERS.map(t => <option key={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-600 transition">Create Class</button>
        <button type="button" onClick={onClose} className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">Cancel</button>
      </div>
    </form>
  );
}

function AddStudentForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-5" onSubmit={e => { e.preventDefault(); onClose(); }}>
      <h3 className="text-xl font-bold text-brand">Enroll Student</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input type="text" placeholder="e.g. Namuli Sarah" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
          <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm">
            {CLASSES.map(c => <option key={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
          <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm">
            <option>Female</option><option>Male</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Guardian Name</label>
          <input type="text" placeholder="e.g. Mr. Namuli John" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Guardian Phone</label>
          <input type="tel" placeholder="+256 700 000000" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-600 transition">Enroll Student</button>
        <button type="button" onClick={onClose} className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">Cancel</button>
      </div>
    </form>
  );
}

function AddTeacherForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-5" onSubmit={e => { e.preventDefault(); onClose(); }}>
      <h3 className="text-xl font-bold text-brand">Register Teacher</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input type="text" placeholder="e.g. Mr. Okello James" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" placeholder="teacher@school.sc.ug" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input type="tel" placeholder="+256 700 000000" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Subjects</label>
          <input type="text" placeholder="e.g. Mathematics, Physics" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Classes</label>
          <select multiple className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm h-24">
            {CLASSES.map(c => <option key={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-600 transition">Register Teacher</button>
        <button type="button" onClick={onClose} className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">Cancel</button>
      </div>
    </form>
  );
}

function useToast() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return { toast, showToast };
}

function ToastBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-brand text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium">
        <CheckCircle2 size={16} />
        {message}
      </div>
    </div>
  );
}

const FEE_SUMMARY = {
  totalExpected: '45,000,000 UGX',
  collected: '32,500,000 UGX',
  outstanding: '12,500,000 UGX',
  collectionRate: 72,
};

const FEE_BREAKDOWN = [
  { class: 'S1 Blue', students: 45, paidPercent: 95 },
  { class: 'S2 Red', students: 38, paidPercent: 88 },
  { class: 'S3 Green', students: 35, paidPercent: 76 },
  { class: 'S4 Blue', students: 38, paidPercent: 82 },
];

const RECENT_PAYMENTS = [
  { id: 1, student: 'Namuli Sarah', class: 'S4 Blue', amount: '1,500,000 UGX', date: '2026-05-08', receipt: 'RCP-2026-0401' },
  { id: 2, student: 'Okello David', class: 'S4 Blue', amount: '1,500,000 UGX', date: '2026-05-07', receipt: 'RCP-2026-0402' },
  { id: 3, student: 'Nakamya Patience', class: 'S4 Red', amount: '800,000 UGX', date: '2026-05-06', receipt: 'RCP-2026-0403' },
  { id: 4, student: 'Mugisha Alex', class: 'S3 Green', amount: '1,200,000 UGX', date: '2026-05-05', receipt: 'RCP-2026-0404' },
  { id: 5, student: 'Achieng Grace', class: 'S2 Blue', amount: '1,500,000 UGX', date: '2026-05-04', receipt: 'RCP-2026-0405' },
];

const OUTSTANDING_STUDENTS = [
  { id: 1, name: 'Ssewankambo Mark', class: 'S1 Blue', amount: '1,500,000 UGX', daysOverdue: 15 },
  { id: 2, name: 'Apolot Vivian', class: 'S5 Sciences', amount: '2,000,000 UGX', daysOverdue: 10 },
  { id: 3, name: 'Ochieng Brian', class: 'S6 Sciences', amount: '1,800,000 UGX', daysOverdue: 7 },
];

function FeesTab() {
  const { toast, showToast } = useToast();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ student: '', amount: '', receipt: '' });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Payment of ${paymentForm.amount || '0 UGX'} recorded for ${paymentForm.student || 'student'} (Receipt: ${paymentForm.receipt || 'N/A'})`);
    setPaymentForm({ student: '', amount: '', receipt: '' });
    setShowPaymentForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">School Fees</h2>
        <button
          onClick={() => setShowPaymentForm(!showPaymentForm)}
          className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2"
        >
          <CreditCard size={16} /> Record Payment
        </button>
      </div>

      {/* Fee Collection Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Expected', value: FEE_SUMMARY.totalExpected, color: 'bg-brand text-white' },
          { label: 'Collected', value: FEE_SUMMARY.collected, color: 'bg-slate-700 text-white' },
          { label: 'Outstanding', value: FEE_SUMMARY.outstanding, color: 'bg-slate-600 text-white' },
          { label: 'Collection Rate', value: `${FEE_SUMMARY.collectionRate}%`, color: 'bg-brand-600 text-white' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color} mb-3`}>
              <CreditCard size={20} />
            </div>
            <p className="text-2xl font-bold text-brand">{item.value}</p>
            <p className="text-sm text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Fee Breakdown by Class */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-brand mb-4">Fee Breakdown by Class</h3>
        <div className="space-y-3">
          {FEE_BREAKDOWN.map(item => (
            <div key={item.class} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="text-brand font-bold text-sm">{item.class.split(' ')[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-brand text-sm">{item.class}</p>
                  <p className="text-xs text-slate-500">{item.students} students</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-slate-100 rounded-full h-2.5">
                  <div className="bg-brand h-2.5 rounded-full" style={{ width: `${item.paidPercent}%` }} />
                </div>
                <span className="text-sm font-semibold text-brand w-12 text-right">{item.paidPercent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-bold text-brand">Recent Payments</h3>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Class</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-xs uppercase">Receipt No</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_PAYMENTS.map(payment => (
                <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-brand text-xs font-semibold">{payment.student[0]}</span>
                      </div>
                      <p className="font-medium text-brand text-sm">{payment.student}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{payment.class}</td>
                  <td className="py-3 px-4 text-sm font-medium text-brand">{payment.amount}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{payment.date}</td>
                  <td className="py-3 px-4 text-sm text-slate-500 font-mono">{payment.receipt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Students with Outstanding Fees */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-brand mb-4">Outstanding Fees</h3>
        <div className="space-y-3">
          {OUTSTANDING_STUDENTS.map(student => (
            <div key={student.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-brand font-bold text-sm">{student.name[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-brand text-sm">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.class} - {student.amount} outstanding - {student.daysOverdue} days overdue</p>
                </div>
              </div>
              <button
                onClick={() => showToast(`Reminder sent to guardian of ${student.name}`)}
                className="px-3 py-1.5 bg-brand text-white text-xs font-medium rounded-lg hover:bg-brand-600 transition"
              >
                Send Reminder
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Record Payment Form */}
      {showPaymentForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-brand mb-4">Record Payment</h3>
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
              <input
                type="text"
                placeholder="e.g. Namuli Sarah"
                value={paymentForm.student}
                onChange={e => setPaymentForm(prev => ({ ...prev, student: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount (UGX)</label>
              <input
                type="text"
                placeholder="e.g. 1,500,000"
                value={paymentForm.amount}
                onChange={e => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Receipt Number</label>
              <input
                type="text"
                placeholder="e.g. RCP-2026-0401"
                value={paymentForm.receipt}
                onChange={e => setPaymentForm(prev => ({ ...prev, receipt: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-600 transition">
                Submit Payment
              </button>
              <button type="button" onClick={() => setShowPaymentForm(false)} className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <ToastBanner message={toast} />
    </div>
  );
}
