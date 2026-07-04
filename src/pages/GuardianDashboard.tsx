import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogOut, BookOpen, Users, Bell, BarChart3,
  TrendingUp, CheckCircle2, Link2,
  CreditCard, Calendar, FileText,
  UserPlus, Star, MessageSquare, Download, Send, X
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDashboardTab, getDashboardTabPath } from '../lib/dashboardRoutes';

type Tab = 'overview' | 'children' | 'performance' | 'subscription' | 'fees' | 'reports' | 'communication';
const TAB_IDS: readonly Tab[] = ['overview', 'children', 'performance', 'subscription', 'fees', 'reports', 'communication'];

const CHILDREN = [
  {
    id: 1, name: 'Namuli Sarah', class: 'S4 Blue', regNo: 'LUB/2026/001',
    school: 'Lubiri Secondary School', avgScore: 82, attendance: 96,
    rank: '5/38', subjects: [
      { name: 'Mathematics', score: 85, grade: 'D1', teacher: 'Mr. Okello James' },
      { name: 'Physics', score: 78, grade: 'D2', teacher: 'Ms. Nakamya Grace' },
      { name: 'Biology', score: 80, grade: 'D2', teacher: 'Dr. Mugisha Peter' },
      { name: 'Chemistry', score: 88, grade: 'D1', teacher: 'Mrs. Achieng Ruth' },
      { name: 'English', score: 90, grade: 'D1', teacher: 'Mr. Ssewankambo D.' },
      { name: 'History', score: 72, grade: 'C3', teacher: 'Ms. Apolot Sarah' },
    ],
    recentGrades: [
      { assignment: 'Quadratic Equations Worksheet', subject: 'Mathematics', score: 18, total: 20, date: '2026-04-20' },
      { assignment: 'Chemistry Quiz', subject: 'Chemistry', score: 13, total: 15, date: '2026-04-18' },
      { assignment: 'English Essay', subject: 'English', score: 22, total: 25, date: '2026-04-15' },
    ],
    upcoming: [
      { title: 'Physics Lab Report', dueDate: '2026-04-30', subject: 'Physics' },
      { title: 'Biology Essay', dueDate: '2026-05-02', subject: 'Biology' },
    ],
  },
  {
    id: 2, name: 'Namuli Peter', class: 'S2 Blue', regNo: 'LUB/2026/045',
    school: 'Lubiri Secondary School', avgScore: 74, attendance: 91,
    rank: '12/40', subjects: [
      { name: 'Mathematics', score: 70, grade: 'C3', teacher: 'Ms. Nakamya Grace' },
      { name: 'Physics', score: 72, grade: 'C3', teacher: 'Ms. Nakamya Grace' },
      { name: 'Biology', score: 78, grade: 'D2', teacher: 'Dr. Mugisha Peter' },
      { name: 'Chemistry', score: 68, grade: 'C4', teacher: 'Mrs. Achieng Ruth' },
      { name: 'English', score: 82, grade: 'D2', teacher: 'Mr. Ssewankambo D.' },
    ],
    recentGrades: [
      { assignment: 'Algebra Test', subject: 'Mathematics', score: 14, total: 20, date: '2026-04-19' },
    ],
    upcoming: [
      { title: 'Chemistry Homework', dueDate: '2026-04-28', subject: 'Chemistry' },
    ],
  },
];

const SUBSCRIPTION_PLANS = [
  {
    id: 1, name: 'Basic', price: 50000, period: 'term',
    features: ['View child grades', 'Attendance reports', 'Basic notifications'],
    color: 'bg-slate-100 border-slate-300', textColor: 'text-brand', btnColor: 'bg-brand-600 hover:bg-brand',
  },
  {
    id: 2, name: 'Premium', price: 120000, period: 'term',
    features: ['Everything in Basic', 'Detailed performance analytics', 'Direct messaging with teachers', 'Assignment notifications', 'Priority support'],
    color: 'bg-slate-50 border-slate-300', textColor: 'text-brand', btnColor: 'bg-brand hover:bg-brand-600', popular: true,
  },
  {
    id: 3, name: 'Family', price: 200000, period: 'term',
    features: ['Everything in Premium', 'Up to 4 children', 'Family dashboard', 'Term reports via email', 'Dedicated support line'],
    color: 'bg-amber-50 border-amber-300', textColor: 'text-amber-900', btnColor: 'bg-amber-600 hover:bg-amber-700',
  },
];

export default function GuardianDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>(() => getDashboardTab(window.location.pathname, TAB_IDS, 'overview'));
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0].id);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const tab = getDashboardTab(location.pathname, TAB_IDS, 'overview');
    setActiveTab(tab);

    const legacyHashTab = location.hash.replace('#', '') as Tab;
    if (TAB_IDS.includes(legacyHashTab)) {
      navigate(getDashboardTabPath('/guardian', legacyHashTab), { replace: true });
    } else if (location.pathname === '/guardian' || location.pathname === '/guardian/') {
      navigate(getDashboardTabPath('/guardian', tab), { replace: true });
    }
  }, [location.pathname, location.hash, navigate]);

  const navigateToTab = (tab: Tab) => {
    setActiveTab(tab);
    navigate(getDashboardTabPath('/guardian', tab));
  };

  const currentChild = CHILDREN.find(c => c.id === selectedChild) || CHILDREN[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
              <BrandLogo className="h-full w-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-brand text-sm">Soma365</h1>
              <p className="text-[10px] text-slate-500">{({ primary: 'Primary School', secondary: 'Secondary School', university: 'University', tertiary: 'Tertiary College', vocational: 'Vocational Institute' } as Record<string, string>)[user?.education_level || 'secondary'] || 'Secondary School'} - Guardian</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
              <Bell size={18} className="text-amber-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">2</span>
            </button>
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-brand text-sm">{user?.full_name}</p>
              <p className="text-[10px] text-slate-500">{({ primary: 'Primary School', secondary: 'Secondary School', university: 'University', tertiary: 'Tertiary College', vocational: 'Vocational Institute' } as Record<string, string>)[user?.education_level || 'secondary'] || 'Secondary School'} Guardian</p>
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
        {activeTab === 'overview' && <OverviewTab selectedChild={selectedChild} setSelectedChild={setSelectedChild} onNavigate={navigateToTab} />}
        {activeTab === 'children' && <ChildrenTab selectedChild={selectedChild} setSelectedChild={setSelectedChild} />}
        {activeTab === 'performance' && <PerformanceTab child={currentChild} />}
        {activeTab === 'fees' && <FeesTab />}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'communication' && <CommunicationTab />}
        {activeTab === 'subscription' && <SubscriptionTab />}
      </div>
    </div>
  );
}

function OverviewTab({ selectedChild, setSelectedChild, onNavigate }: {
  selectedChild: number; setSelectedChild: (v: number) => void; onNavigate: (tab: Tab) => void;
}) {
  const child = CHILDREN.find(c => c.id === selectedChild) || CHILDREN[0];

  return (
    <div className="space-y-6">
      {/* Child Selector */}
      <div className="flex gap-3">
        {CHILDREN.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedChild(c.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedChild === c.id ? 'bg-brand text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
            }`}
          >
            <Users size={14} />
            {c.name}
          </button>
        ))}
      </div>

      {/* Child Summary */}
      <div className="bg-brand rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{child.name}</h2>
            <p className="text-slate-100 mt-1">{child.class} - {child.school}</p>
            <p className="text-slate-100 text-sm">Reg: {child.regNo}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{child.avgScore}%</p>
            <p className="text-slate-100 text-sm">Average Score</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Average Score', value: `${child.avgScore}%`, icon: <BarChart3 size={20} />, color: 'bg-slate-100 text-brand' },
          { label: 'Class Rank', value: child.rank, icon: <Star size={20} />, color: 'bg-amber-500 text-white' },
          { label: 'Attendance', value: `${child.attendance}%`, icon: <CheckCircle2 size={20} />, color: 'bg-emerald-600 text-white' },
          { label: 'Subjects', value: `${child.subjects.length}`, icon: <BookOpen size={20} />, color: 'bg-brand text-white' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} mb-3`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-brand">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Grades */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-brand">Recent Grades</h3>
            <button onClick={() => onNavigate('performance')} className="text-sm text-brand font-medium hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {child.recentGrades.map((grade, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <FileText size={18} className="text-brand" />
                  </div>
                  <div>
                    <p className="font-medium text-brand text-sm">{grade.assignment}</p>
                    <p className="text-xs text-slate-500">{grade.subject} - {grade.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brand text-sm">{grade.score}/{grade.total}</p>
                  <p className="text-xs text-emerald-600">{Math.round(grade.score / grade.total * 100)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-brand mb-4">Upcoming Assignments</h3>
            <div className="space-y-3">
              {child.upcoming.map((item, i) => (
                <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="font-medium text-brand text-sm">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.subject}</p>
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><Calendar size={10} /> Due: {item.dueDate}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-brand rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button onClick={() => onNavigate('performance')} className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 rounded-lg transition text-sm flex items-center justify-center gap-2">
                <TrendingUp size={16} /> View Full Report
              </button>
              <button onClick={() => onNavigate('subscription')} className="w-full bg-white text-brand font-medium py-2 rounded-lg hover:bg-slate-50 transition text-sm flex items-center justify-center gap-2">
                <CreditCard size={16} /> Manage Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChildrenTab({ selectedChild, setSelectedChild }: {
  selectedChild: number; setSelectedChild: (v: number) => void;
}) {
  const [showLinkModal, setShowLinkModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">My Children</h2>
        <button
          onClick={() => setShowLinkModal(true)}
          className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2"
        >
          <Link2 size={16} /> Link Child
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CHILDREN.map(child => (
          <div
            key={child.id}
            onClick={() => setSelectedChild(child.id)}
            className={`bg-white rounded-xl shadow-sm border p-6 cursor-pointer hover:shadow-md transition ${
              selectedChild === child.id ? 'border-slate-400 bg-slate-50/50' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-brand font-semibold text-lg">{child.name[0]}</span>
                </div>
                <div>
                  <h3 className="font-bold text-brand">{child.name}</h3>
                  <p className="text-sm text-slate-500">{child.class} - {child.school}</p>
                  <p className="text-xs text-slate-400">Reg: {child.regNo}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-brand">{child.avgScore}%</p>
                <p className="text-[10px] text-slate-500">Average</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-brand">{child.attendance}%</p>
                <p className="text-[10px] text-slate-500">Attendance</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-brand">{child.rank}</p>
                <p className="text-[10px] text-slate-500">Rank</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-slate-50 text-brand text-xs font-medium rounded-lg hover:bg-slate-100 transition flex items-center justify-center gap-1">
                <TrendingUp size={12} /> Performance
              </button>
              <button className="flex-1 px-3 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-1">
                <FileText size={12} /> Reports
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Link Child Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowLinkModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-brand mb-2">Link a Child</h3>
            <p className="text-slate-500 text-sm mb-6">Enter your child's registration number to link them to your account</p>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowLinkModal(false); }}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. LUB/2026/001"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Child's Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Namuli Sarah"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2">
                  <UserPlus size={16} /> Link Child
                </button>
                <button type="button" onClick={() => setShowLinkModal(false)} className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PerformanceTab({ child }: { child: typeof CHILDREN[0] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">Performance Report</h2>
        <span className="text-sm text-slate-500">{child.name} - {child.class}</span>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-brand mb-4">Subject Performance</h3>
        <div className="space-y-4">
          {child.subjects.map(subject => (
            <div key={subject.name} className="flex items-center gap-4">
              <div className="w-28 flex-shrink-0">
                <p className="font-medium text-brand text-sm">{subject.name}</p>
                <p className="text-[10px] text-slate-500">{subject.teacher}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{subject.score}%</span>
                  <span className="font-semibold">{subject.grade}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      subject.score >= 80 ? 'bg-emerald-500' :
                      subject.score >= 70 ? 'bg-blue-500' :
                      subject.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${subject.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grade Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-brand mb-4">UACE Grading Scale</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { grade: 'D1', range: '80-100%', color: 'bg-emerald-100 text-emerald-700' },
            { grade: 'D2', range: '75-79%', color: 'bg-emerald-100 text-emerald-700' },
            { grade: 'C3', range: '70-74%', color: 'bg-blue-100 text-blue-700' },
            { grade: 'C4', range: '65-69%', color: 'bg-blue-100 text-blue-700' },
            { grade: 'C5', range: '60-64%', color: 'bg-amber-100 text-amber-700' },
            { grade: 'C6', range: '55-59%', color: 'bg-amber-100 text-amber-700' },
            { grade: 'P7', range: '50-54%', color: 'bg-orange-100 text-orange-700' },
            { grade: 'P8-F9', range: 'Below 50%', color: 'bg-red-100 text-red-700' },
          ].map(item => (
            <div key={item.grade} className={`p-3 rounded-lg ${item.color}`}>
              <p className="font-bold text-sm">{item.grade}</p>
              <p className="text-xs">{item.range}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Grades Detail */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-brand mb-4">Recent Assignment Grades</h3>
        <div className="space-y-3">
          {child.recentGrades.map((grade, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
              <div>
                <p className="font-medium text-brand text-sm">{grade.assignment}</p>
                <p className="text-xs text-slate-500">{grade.subject} - {grade.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-brand">{grade.score}/{grade.total}</p>
                <p className={`text-xs font-medium ${
                  grade.score / grade.total >= 0.8 ? 'text-emerald-600' :
                  grade.score / grade.total >= 0.7 ? 'text-blue-600' :
                  grade.score / grade.total >= 0.6 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {Math.round(grade.score / grade.total * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubscriptionTab() {
  const [currentPlan] = useState('Basic');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">Subscription</h2>
        <span className="px-3 py-1 bg-slate-100 text-brand-600 rounded-full text-sm font-medium">
          Current: {currentPlan}
        </span>
      </div>

      {/* Current Plan Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-brand">Current Plan: {currentPlan}</h3>
            <p className="text-sm text-slate-500 mt-1">Access to basic features including grade viewing and attendance reports</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-brand">50,000</p>
            <p className="text-sm text-slate-500">UGX/term</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Calendar size={14} />
          <span>Next billing: Term 3, 2026 (September 2026)</span>
        </div>
      </div>

      {/* Available Plans */}
      <h3 className="text-lg font-bold text-brand">Available Plans</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SUBSCRIPTION_PLANS.map(plan => (
          <div
            key={plan.id}
            className={`rounded-xl border-2 p-6 ${plan.color} relative ${
              currentPlan.toLowerCase() === plan.name.toLowerCase() ? 'ring-2 ring-slate-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand text-white text-xs font-bold rounded-full">
                POPULAR
              </div>
            )}
            <h4 className={`text-xl font-bold ${plan.textColor}`}>{plan.name}</h4>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold text-brand">{(plan.price / 1000).toFixed(0)}K</span>
              <span className="text-slate-500 text-sm"> UGX/{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={14} className="text-slate-700 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2.5 rounded-lg text-white font-medium transition text-sm ${plan.btnColor} ${
                currentPlan.toLowerCase() === plan.name.toLowerCase() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={currentPlan.toLowerCase() === plan.name.toLowerCase()}
            >
              {currentPlan.toLowerCase() === plan.name.toLowerCase() ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-brand mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard size={20} className="text-brand" />
              <h4 className="font-semibold text-brand">Mobile Money</h4>
            </div>
            <p className="text-sm text-slate-500">Pay via MTN MoMo or Airtel Money</p>
          </div>
          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard size={20} className="text-brand" />
              <h4 className="font-semibold text-brand">Bank Transfer</h4>
            </div>
            <p className="text-sm text-slate-500">Direct bank deposit or transfer</p>
          </div>
        </div>
      </div>
    </div>
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

function FeesTab() {
  const { toast, showToast } = useToast();

  const feeItems = [
    { name: 'Tuition', amount: 1500000 },
    { name: 'Boarding', amount: 800000 },
    { name: 'Lunch', amount: 400000 },
    { name: 'Uniform', amount: 150000 },
    { name: 'Books', amount: 200000 },
  ];

  const totalDue = feeItems.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = 1850000;
  const outstanding = totalDue - totalPaid;

  const paymentHistory = [
    { date: '2026-02-10', amount: 1000000, receipt: 'RCPT-2026-001', method: 'Mobile Money' },
    { date: '2026-03-15', amount: 500000, receipt: 'RCPT-2026-002', method: 'Bank Transfer' },
    { date: '2026-04-05', amount: 350000, receipt: 'RCPT-2026-003', method: 'Mobile Money' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">School Fees</h2>
        <span className="px-3 py-1 bg-slate-100 text-brand-600 rounded-full text-sm font-medium">
          Term 2, 2026
        </span>
      </div>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-sm text-slate-500 mb-1">Total Due</p>
          <p className="text-2xl font-bold text-brand">{totalDue.toLocaleString()} UGX</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-sm text-slate-500 mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-emerald-600">{totalPaid.toLocaleString()} UGX</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-sm text-slate-500 mb-1">Outstanding</p>
          <p className="text-2xl font-bold text-red-600">{outstanding.toLocaleString()} UGX</p>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-brand mb-4">Fee Breakdown</h3>
        <div className="space-y-3">
          {feeItems.map(item => (
            <div key={item.name} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <CreditCard size={18} className="text-brand" />
                </div>
                <p className="font-medium text-brand text-sm">{item.name}</p>
              </div>
              <p className="font-semibold text-brand">{item.amount.toLocaleString()} UGX</p>
            </div>
          ))}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border-t-2 border-slate-200 mt-2">
            <p className="font-bold text-brand">Total</p>
            <p className="font-bold text-brand">{totalDue.toLocaleString()} UGX</p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-brand mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 font-medium text-slate-500">Date</th>
                <th className="text-left py-3 px-2 font-medium text-slate-500">Amount</th>
                <th className="text-left py-3 px-2 font-medium text-slate-500">Method</th>
                <th className="text-left py-3 px-2 font-medium text-slate-500">Receipt No.</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3 px-2 text-brand">{payment.date}</td>
                  <td className="py-3 px-2 text-brand font-medium">{payment.amount.toLocaleString()} UGX</td>
                  <td className="py-3 px-2 text-slate-600">{payment.method}</td>
                  <td className="py-3 px-2 text-slate-500 font-mono text-xs">{payment.receipt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Make Payment */}
      <div className="flex justify-end">
        <button
          onClick={() => showToast('Payment initiated')}
          className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2"
        >
          <CreditCard size={16} /> Make Payment
        </button>
      </div>

      <ToastBanner message={toast} />
    </div>
  );
}

function ReportsTab() {
  const { toast, showToast } = useToast();

  const termReports = CHILDREN.map(child => ({
    child,
    term: 'Term 2, 2026',
    classTeacherComment: child.id === 1
      ? 'Sarah is a diligent student who consistently performs above average. She needs to improve her consistency in History.'
      : 'Peter shows potential but needs to put in more effort in Mathematics and Chemistry. Good improvement in English.',
    headTeacherComment: 'Overall satisfactory performance. Encourage regular revision.',
    attendanceSummary: { present: child.id === 1 ? 92 : 87, absent: child.id === 1 ? 4 : 9, late: child.id === 1 ? 3 : 5 },
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">Academic Reports</h2>
        <span className="px-3 py-1 bg-slate-100 text-brand-600 rounded-full text-sm font-medium">
          Term 2, 2026
        </span>
      </div>

      {termReports.map(report => (
        <div key={report.child.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-brand">{report.child.name}</h3>
              <p className="text-sm text-slate-500">{report.child.class} - {report.child.school}</p>
            </div>
            <button
              onClick={() => showToast('Report downloaded')}
              className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2"
            >
              <Download size={14} /> Download Report
            </button>
          </div>

          {/* Subject Grades */}
          <div className="mb-4">
            <h4 className="font-semibold text-brand text-sm mb-2">Subject Grades</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-2 font-medium text-slate-500">Subject</th>
                    <th className="text-center py-2 px-2 font-medium text-slate-500">Score</th>
                    <th className="text-center py-2 px-2 font-medium text-slate-500">Grade</th>
                    <th className="text-left py-2 px-2 font-medium text-slate-500">Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {report.child.subjects.map(subject => (
                    <tr key={subject.name} className="border-b border-slate-100">
                      <td className="py-2 px-2 text-brand font-medium">{subject.name}</td>
                      <td className="py-2 px-2 text-center">
                        <span className={`font-semibold ${
                          subject.score >= 80 ? 'text-emerald-600' :
                          subject.score >= 70 ? 'text-blue-600' :
                          subject.score >= 60 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {subject.score}%
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          subject.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                          subject.score >= 70 ? 'bg-blue-100 text-blue-700' :
                          subject.score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {subject.grade}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-500 text-xs">{subject.teacher}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-emerald-600">{report.attendanceSummary.present}</p>
              <p className="text-[10px] text-slate-500">Days Present</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-red-600">{report.attendanceSummary.absent}</p>
              <p className="text-[10px] text-slate-500">Days Absent</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-amber-600">{report.attendanceSummary.late}</p>
              <p className="text-[10px] text-slate-500">Days Late</p>
            </div>
          </div>

          {/* Teacher Comments */}
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs font-medium text-slate-500 mb-1">Class Teacher Comment</p>
              <p className="text-sm text-brand">{report.classTeacherComment}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs font-medium text-slate-500 mb-1">Head Teacher Comment</p>
              <p className="text-sm text-brand">{report.headTeacherComment}</p>
            </div>
          </div>
        </div>
      ))}

      <ToastBanner message={toast} />
    </div>
  );
}

function CommunicationTab() {
  const { toast, showToast } = useToast();
  const [meetingSubject, setMeetingSubject] = useState('');
  const [meetingMessage, setMeetingMessage] = useState('');
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  const messages = [
    {
      id: 1, type: 'announcement', date: '2026-05-01', from: 'School Administration',
      subject: 'Term 2 Mid-Term Exams Schedule',
      body: 'Dear parents, mid-term examinations will commence on 15th May 2026. Please ensure your children are well prepared. The exam timetable has been shared with all students.',
    },
    {
      id: 2, type: 'meeting', date: '2026-04-28', from: 'Mr. Okello James (Mathematics)',
      subject: 'Parent-Teacher Meeting Request',
      body: 'I would like to discuss Namuli Sarah\'s progress in Mathematics. She has been performing well but I have some recommendations for further improvement. Please schedule a meeting at your earliest convenience.',
    },
    {
      id: 3, type: 'announcement', date: '2026-04-20', from: 'School Administration',
      subject: 'Sports Day - 10th May 2026',
      body: 'All parents are invited to the annual sports day on 10th May 2026. Events begin at 9:00 AM. Please come and support your children.',
    },
    {
      id: 4, type: 'announcement', date: '2026-04-15', from: 'School Administration',
      subject: 'Fee Payment Reminder',
      body: 'This is a reminder that Term 2 fees are due by 30th April 2026. outstanding balances will attract a late payment surcharge. Please contact the bursar\'s office for any queries.',
    },
  ];

  const handleRequestMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMeetingForm(false);
    setMeetingSubject('');
    setMeetingMessage('');
    showToast('Meeting request sent');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">Communication</h2>
        <button
          onClick={() => setShowMeetingForm(true)}
          className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2"
        >
          <Calendar size={16} /> Request Meeting
        </button>
      </div>

      {/* Contact School Administration */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-brand mb-3">Contact School Administration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare size={20} className="text-brand" />
              <h4 className="font-semibold text-brand">General Inquiries</h4>
            </div>
            <p className="text-sm text-slate-500">admin@lubiri.ss.ac.ug</p>
            <p className="text-sm text-slate-500">+256 414 123 456</p>
          </div>
          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard size={20} className="text-brand" />
              <h4 className="font-semibold text-brand">Bursar's Office</h4>
            </div>
            <p className="text-sm text-slate-500">bursar@lubiri.ss.ac.ug</p>
            <p className="text-sm text-slate-500">+256 414 123 457</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-brand mb-4">Messages from School</h3>
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`p-4 rounded-lg border ${
              msg.type === 'meeting' ? 'border-amber-200 bg-amber-50/50' : 'border-slate-100'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-brand text-sm">{msg.subject}</p>
                  <p className="text-xs text-slate-500">{msg.from} - {msg.date}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  msg.type === 'meeting' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {msg.type === 'meeting' ? 'Meeting Request' : 'Announcement'}
                </span>
              </div>
              <p className="text-sm text-slate-600">{msg.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Request Meeting Modal */}
      {showMeetingForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowMeetingForm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-brand">Request Meeting with Teacher</h3>
              <button onClick={() => setShowMeetingForm(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleRequestMeeting}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teacher</label>
                <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none text-sm bg-white">
                  <option>Mr. Okello James (Mathematics)</option>
                  <option>Ms. Nakamya Grace (Physics)</option>
                  <option>Dr. Mugisha Peter (Biology)</option>
                  <option>Mrs. Achieng Ruth (Chemistry)</option>
                  <option>Mr. Ssewankambo D. (English)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={meetingSubject}
                  onChange={e => setMeetingSubject(e.target.value)}
                  placeholder="e.g. Discuss academic progress"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  value={meetingMessage}
                  onChange={e => setMeetingMessage(e.target.value)}
                  placeholder="Describe what you would like to discuss..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2">
                  <Send size={16} /> Send Request
                </button>
                <button type="button" onClick={() => setShowMeetingForm(false)} className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastBanner message={toast} />
    </div>
  );
}
