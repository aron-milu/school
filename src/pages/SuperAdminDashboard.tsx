import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogOut, Globe, AlertCircle, Plus, Search, X,
  Building2, Users, TrendingUp, Settings, Bell,
  Eye, MoreVertical, MapPin, Phone, Mail, CreditCard,
  AlertTriangle, FileText, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Tab = 'overview' | 'schools' | 'create-school' | 'fees';

const UGANDA_DISTRICTS = [
  'Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Entebbe', 'Mbarara',
  'Gulu', 'Lira', 'Mbale', 'Fort Portal', 'Masaka', 'Arua',
  'Soroti', 'Hoima', 'Kabale', 'Tororo', 'Iganga', 'Luwero',
  'Mityana', 'Mubende', 'Ntungamo', 'Rukungiri', 'Kasese',
  'Bushenyi', 'Kamuli', 'Pallisa', 'Kumi', 'Nebbi', 'Apac',
];

const SCHOOLS = [
  // Secondary Schools
  { id: 1, name: 'Lubiri Secondary School', regNo: 'LUB-2026', district: 'Kampala', tier: 'Premium', status: 'active', level: 'secondary', students: 1250, teachers: 68, admin: 'Mr. Ssentongo David', phone: '+256 700 000001', email: 'admin@lubiri.sc.ug' },
  { id: 2, name: "St. Mary's College Kisubi", regNo: 'SMC-2025', district: 'Wakiso', tier: 'Premium', status: 'active', level: 'secondary', students: 890, teachers: 52, admin: 'Bro. Mukasa Joseph', phone: '+256 700 000002', email: 'admin@smc.ac.ug' },
  { id: 3, name: 'Mengo Senior School', regNo: 'MSS-2024', district: 'Kampala', tier: 'Institutional', status: 'suspended', level: 'secondary', students: 950, teachers: 55, admin: 'Ms. Nalubega Anne', phone: '+256 700 000003', email: 'admin@mengo.sc.ug' },
  { id: 4, name: "King's College Budo", regNo: 'KCB-2025', district: 'Wakiso', tier: 'Premium', status: 'active', level: 'secondary', students: 1100, teachers: 62, admin: 'Mr. Ssemakula Robert', phone: '+256 700 000004', email: 'admin@kcb.ac.ug' },
  { id: 5, name: 'Nabisunsa Girls School', regNo: 'NGS-2026', district: 'Kampala', tier: 'Premium', status: 'active', level: 'secondary', students: 780, teachers: 45, admin: 'Ms. Nakamya Fatima', phone: '+256 700 000005', email: 'admin@nabisunsa.sc.ug' },
  { id: 6, name: 'Namilyango College', regNo: 'NMC-2025', district: 'Mukono', tier: 'Institutional', status: 'trial', level: 'secondary', students: 620, teachers: 38, admin: 'Mr. Ochieng Paul', phone: '+256 700 000006', email: 'admin@namilyango.ac.ug' },
  { id: 7, name: 'Gayaza High School', regNo: 'GHS-2026', district: 'Wakiso', tier: 'Premium', status: 'active', level: 'secondary', students: 950, teachers: 58, admin: 'Ms. Kintu Victoria', phone: '+256 700 000007', email: 'admin@gayaza.ac.ug' },
  { id: 8, name: 'Busoga College Mwiri', regNo: 'BCM-2024', district: 'Jinja', tier: 'Trial', status: 'expired', level: 'secondary', students: 430, teachers: 28, admin: 'Mr. Wambuzi Sam', phone: '+256 700 000008', email: 'admin@mwiri.sc.ug' },
  // Primary Schools
  { id: 9, name: 'Kampala Primary School', regNo: 'KPS-2026', district: 'Kampala', tier: 'Premium', status: 'active', level: 'primary', students: 680, teachers: 32, admin: 'Headteacher Mukasa', phone: '+256 700 000009', email: 'admin@kps.ac.ug' },
  { id: 10, name: 'Buganda Road Primary', regNo: 'BRP-2025', district: 'Kampala', tier: 'Institutional', status: 'active', level: 'primary', students: 520, teachers: 24, admin: 'Mrs. Nakamya Grace', phone: '+256 700 000010', email: 'admin@brp.ac.ug' },
  { id: 11, name: 'Namilyango Junior School', regNo: 'NJS-2026', district: 'Mukono', tier: 'Trial', status: 'trial', level: 'primary', students: 310, teachers: 18, admin: 'Mr. Ochieng Paul', phone: '+256 700 000011', email: 'admin@njs.ac.ug' },
  // University
  { id: 12, name: 'Makerere University', regNo: 'MAK-2026', district: 'Kampala', tier: 'Premium', status: 'active', level: 'university', students: 35000, teachers: 1200, admin: 'Registrar Kintu', phone: '+256 700 000012', email: 'registrar@mak.ac.ug' },
  { id: 13, name: 'Uganda Christian University', regNo: 'UCU-2025', district: 'Mukono', tier: 'Premium', status: 'active', level: 'university', students: 8500, teachers: 340, admin: 'Dr. Ssempijja', phone: '+256 700 000013', email: 'registrar@ucu.ac.ug' },
  { id: 14, name: 'Mbarara University', regNo: 'MUST-2026', district: 'Mbarara', tier: 'Institutional', status: 'active', level: 'university', students: 4200, teachers: 180, admin: 'Prof. Nawangwe', phone: '+256 700 000014', email: 'registrar@must.ac.ug' },
  // Tertiary
  { id: 15, name: 'Uganda Technical College Elgon', regNo: 'UTC-2026', district: 'Mbale', tier: 'Institutional', status: 'active', level: 'tertiary', students: 1200, teachers: 65, admin: 'Eng. Achieng Ruth', phone: '+256 700 000015', email: 'admin@utc-elgon.ac.ug' },
  { id: 16, name: 'Uganda Petroleum Institute', regNo: 'UPIK-2025', district: 'Hoima', tier: 'Premium', status: 'active', level: 'tertiary', students: 450, teachers: 28, admin: 'Mr. Wambuzi Sam', phone: '+256 700 000016', email: 'admin@upik.ac.ug' },
  // Vocational
  { id: 17, name: 'Kampala Vocational Training Centre', regNo: 'KVTC-2026', district: 'Kampala', tier: 'Institutional', status: 'active', level: 'vocational', students: 380, teachers: 22, admin: 'Mr. Ochieng Paul', phone: '+256 700 000017', email: 'admin@kvtc.ac.ug' },
  { id: 18, name: 'Nakawa Vocational Institute', regNo: 'NVI-2025', district: 'Kampala', tier: 'Trial', status: 'trial', level: 'vocational', students: 210, teachers: 15, admin: 'Mrs. Apio Jane', phone: '+256 700 000018', email: 'admin@nvi.ac.ug' },
];

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp size={18} /> },
    { id: 'schools', label: 'Manage Schools', icon: <Building2 size={18} /> },
    { id: 'fees', label: 'Fee Tracking', icon: <CreditCard size={18} /> },
    { id: 'create-school', label: 'Create School', icon: <Plus size={18} /> },
  ];

  const filteredSchools = SCHOOLS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || (s as any).level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
              <Globe className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-brand text-sm">Soma365</h1>
              <p className="text-[10px] text-slate-500">Platform - Super Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
              <Bell size={18} className="text-amber-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-slate-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">2</span>
            </button>
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-brand text-sm">{user?.full_name}</p>
              <p className="text-[10px] text-slate-500">Super Administrator</p>
              <p className="text-[9px] text-slate-400">All Education Levels</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-slate-50 rounded-lg transition" title="Logout">
              <LogOut size={18} className="text-slate-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-slate-200">
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
        {activeTab === 'overview' && (
          <OverviewTab onNavigate={setActiveTab} />
        )}
        {activeTab === 'schools' && (
          <SchoolsTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredSchools={filteredSchools}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
          />
        )}
        {activeTab === 'fees' && (
          <FeesTab />
        )}
        {activeTab === 'create-school' && (
          <CreateSchoolTab />
        )}
      </main>

      {/* Create School Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <CreateSchoolForm onClose={() => setShowCreateModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const stats = [
    { label: 'Total Schools', value: '156', change: '+12 this month', icon: <Building2 size={20} />, color: 'bg-blue-600 text-white' },
    { label: 'Total Students', value: '45,230', change: '+2,450 this week', icon: <Users size={20} />, color: 'bg-emerald-600 text-white' },
    { label: 'Revenue (UGX)', value: '12.5M', change: '+8.2% this month', icon: <TrendingUp size={20} />, color: 'bg-amber-500 text-white' },
    { label: 'System Uptime', value: '99.8%', change: 'Excellent', icon: <Settings size={20} />, color: 'bg-cyan-600 text-white' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
            </div>
            <p className="text-2xl font-bold text-brand">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-xs text-emerald-600 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Schools */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-brand">Recently Added Schools</h3>
            <button onClick={() => onNavigate('schools')} className="text-sm text-brand font-medium hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {SCHOOLS.slice(0, 5).map(school => (
              <div key={school.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building2 size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-brand text-sm">{school.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">{(school as any).level || 'secondary'}</span>
                      <p className="text-xs text-slate-500">{school.district} - {school.students.toLocaleString()} students</p>
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  school.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  school.status === 'suspended' ? 'bg-amber-100 text-amber-700' :
                  school.status === 'trial' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {school.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-brand mb-4">System Status</h3>
            <div className="space-y-3">
              {[
                { name: 'API Server', status: 'Operational' },
                { name: 'Database', status: 'Operational' },
                { name: 'File Storage', status: 'Operational' },
                { name: 'Email Service', status: 'Operational' },
              ].map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">{s.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-xs text-emerald-600">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-brand mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-600" />
              Alerts
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-medium text-brand text-sm">1 pending school approval</p>
                <p className="text-xs text-slate-500 mt-0.5">Busoga College Mwiri</p>
              </div>
              <div className="p-3 bg-slate-50 border border-red-200 rounded-lg">
                <p className="font-medium text-brand text-sm">1 expired license</p>
                <p className="text-xs text-slate-500 mt-0.5">BCM-2024 needs renewal</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-brand text-sm">2 schools near storage limit</p>
                <p className="text-xs text-slate-500 mt-0.5">Action needed</p>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="bg-brand rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Add New School</h3>
            <p className="text-slate-300 text-sm mb-4">Onboard a new secondary school to the platform</p>
            <button
              onClick={() => onNavigate('create-school')}
              className="w-full bg-white text-brand font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Create School
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SchoolsTab({ searchQuery, setSearchQuery, filteredSchools, selectedSchool, setSelectedSchool, levelFilter, setLevelFilter }: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredSchools: typeof SCHOOLS;
  selectedSchool: number | null;
  setSelectedSchool: (v: number | null) => void;
  levelFilter: string;
  setLevelFilter: (v: string) => void;
}) {
  const levels = ['all', 'primary', 'secondary', 'tertiary', 'university', 'vocational'];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">Manage Schools</h2>
        <span className="text-sm text-slate-500">{filteredSchools.length} schools</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {levels.map(l => (
          <button key={l} onClick={() => setLevelFilter(l)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${levelFilter === l ? 'bg-brand text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {l === 'all' ? 'All Levels' : l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by school name or district..."
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School List */}
        <div className={`${selectedSchool ? 'hidden lg:block lg:col-span-1' : 'col-span-1 lg:col-span-2'} space-y-3`}>
          {filteredSchools.map(school => (
            <div
              key={school.id}
              onClick={() => setSelectedSchool(school.id)}
              className={`bg-white rounded-xl shadow-sm border p-5 cursor-pointer hover:shadow-md transition ${
                selectedSchool === school.id ? 'border-slate-400 bg-slate-50/30' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-brand text-sm">{school.name}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">{(school as any).level || 'secondary'}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{school.regNo} - {school.district}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Users size={12} /> {school.students.toLocaleString()} students</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {school.district}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    school.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    school.status === 'suspended' ? 'bg-amber-100 text-amber-700' :
                    school.status === 'trial' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {school.status}
                  </span>
                  <button className="p-1 hover:bg-slate-100 rounded"><MoreVertical size={16} className="text-slate-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* School Detail */}
        {selectedSchool && (() => {
          const school = SCHOOLS.find(s => s.id === selectedSchool);
          if (!school) return null;
          return (
            <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-brand">{school.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">Reg: {school.regNo} | {school.district} District</p>
                </div>
                <button onClick={() => setSelectedSchool(null)} className="lg:hidden p-1 hover:bg-slate-100 rounded">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500">Students</p>
                  <p className="text-xl font-bold text-brand">{school.students}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500">Teachers</p>
                  <p className="text-xl font-bold text-brand">{school.teachers}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500">License</p>
                  <p className="text-xl font-bold text-brand">{school.tier}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500">Status</p>
                  <p className={`text-xl font-bold ${
                    school.status === 'active' ? 'text-emerald-600' :
                    school.status === 'suspended' ? 'text-amber-600' : 'text-red-600'
                  }`}>{school.status}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-brand">School Admin</h4>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-brand font-medium">{school.admin}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone size={14} /> {school.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail size={14} /> {school.email}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2">
                  <Settings size={16} /> Manage
                </button>
                <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition flex items-center gap-2">
                  <Eye size={16} /> View Details
                </button>
                {school.status === 'suspended' && (
                  <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition">
                    Reactivate
                  </button>
                )}
                {school.status === 'expired' && (
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                    Renew License
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function CreateSchoolTab() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-brand mb-2">Create New School</h2>
        <p className="text-slate-500 mb-8">Register a new secondary school on the Soma365</p>
        <CreateSchoolForm onClose={() => {}} />
      </div>
    </div>
  );
}

function CreateSchoolForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '', regNo: '', district: '', tier: 'Trial',
    adminName: '', adminEmail: '', adminPhone: '',
    address: '', studentCount: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); onClose(); }}>
      {/* School Info */}
      <div>
        <h3 className="font-semibold text-brand mb-4 flex items-center gap-2">
          <Building2 size={18} className="text-brand" />
          School Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">School Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g. Lubiri Secondary School"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
            <input
              type="text"
              value={formData.regNo}
              onChange={e => handleChange('regNo', e.target.value)}
              placeholder="e.g. LUB-2026"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
            <select
              value={formData.district}
              onChange={e => handleChange('district', e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
            >
              <option value="">Select district</option>
              {UGANDA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">License Tier</label>
            <select
              value={formData.tier}
              onChange={e => handleChange('tier', e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
            >
              <option value="Trial">Trial (30 days)</option>
              <option value="Institutional">Institutional</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Expected Student Count</label>
            <input
              type="number"
              value={formData.studentCount}
              onChange={e => handleChange('studentCount', e.target.value)}
              placeholder="e.g. 500"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder="e.g. Plot 12, Lubiri Road, Kampala"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div>
        <h3 className="font-semibold text-brand mb-4 flex items-center gap-2">
          <Users size={18} className="text-brand" />
          School Administrator
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Full Name</label>
            <input
              type="text"
              value={formData.adminName}
              onChange={e => handleChange('adminName', e.target.value)}
              placeholder="e.g. Mr. Ssentongo David"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
            <input
              type="email"
              value={formData.adminEmail}
              onChange={e => handleChange('adminEmail', e.target.value)}
              placeholder="e.g. admin@school.sc.ug"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Phone</label>
            <input
              type="tel"
              value={formData.adminPhone}
              onChange={e => handleChange('adminPhone', e.target.value)}
              placeholder="e.g. +256 700 000000"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2"
        >
          <Plus size={18} />
          Create School
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function FeesTab() {
  const feeSummary = {
    totalCollected: '2.4B UGX',
    totalOutstanding: '890M UGX',
    collectionRate: 73,
  };

  const schoolFees = SCHOOLS.map(school => {
    const rates: Record<number, { collected: string; outstanding: string; rate: number }> = {
      1:  { collected: '320M UGX', outstanding: '45M UGX', rate: 88 },
      2:  { collected: '280M UGX', outstanding: '30M UGX', rate: 90 },
      3:  { collected: '150M UGX', outstanding: '120M UGX', rate: 56 },
      4:  { collected: '310M UGX', outstanding: '40M UGX', rate: 89 },
      5:  { collected: '180M UGX', outstanding: '25M UGX', rate: 88 },
      6:  { collected: '95M UGX',  outstanding: '55M UGX',  rate: 63 },
      7:  { collected: '290M UGX', outstanding: '35M UGX',  rate: 89 },
      8:  { collected: '40M UGX',  outstanding: '60M UGX',  rate: 40 },
      9:  { collected: '110M UGX', outstanding: '15M UGX',  rate: 88 },
      10: { collected: '85M UGX',  outstanding: '20M UGX',  rate: 81 },
      11: { collected: '35M UGX',  outstanding: '30M UGX',  rate: 54 },
      12: { collected: '450M UGX', outstanding: '180M UGX', rate: 71 },
      13: { collected: '200M UGX', outstanding: '90M UGX',  rate: 69 },
      14: { collected: '120M UGX', outstanding: '50M UGX',  rate: 71 },
      15: { collected: '75M UGX',  outstanding: '40M UGX',  rate: 65 },
      16: { collected: '60M UGX',  outstanding: '15M UGX',  rate: 80 },
      17: { collected: '50M UGX',  outstanding: '20M UGX',  rate: 71 },
      18: { collected: '20M UGX',  outstanding: '20M UGX',  rate: 50 },
    };
    const data = rates[school.id] || { collected: '0 UGX', outstanding: '0 UGX', rate: 0 };
    return { ...school, ...data };
  });

  const topPerforming = [...schoolFees]
    .filter(s => s.status === 'active')
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5);

  const lowCollection = schoolFees.filter(s => s.rate < 70);

  const handleGenerateReport = () => {
    alert('Fee report generated! The report will be downloaded shortly.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">Fee Tracking</h2>
        <button
          onClick={handleGenerateReport}
          className="px-4 py-2.5 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition flex items-center gap-2"
        >
          <FileText size={16} />
          Generate Report
        </button>
      </div>

      {/* Platform-wide Fee Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-600 text-white">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-brand">{feeSummary.totalCollected}</p>
          <p className="text-sm text-slate-500">Total Collected</p>
          <p className="text-xs text-emerald-600 mt-1">Across all schools</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-500 text-white">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-brand">{feeSummary.totalOutstanding}</p>
          <p className="text-sm text-slate-500">Total Outstanding</p>
          <p className="text-xs text-amber-600 mt-1">Pending collections</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-600 text-white">
              <BarChart3 size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-brand">{feeSummary.collectionRate}%</p>
          <p className="text-sm text-slate-500">Collection Rate</p>
          <p className="text-xs text-blue-600 mt-1">Platform average</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Collection by School */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-brand">Fee Collection by School</h3>
          </div>
          <div className="space-y-3">
            {schoolFees.map(school => (
              <div key={school.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building2 size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-brand text-sm">{school.name}</p>
                    <p className="text-xs text-slate-500">{school.district}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand">{school.collected}</p>
                    <p className="text-xs text-slate-500">Collected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand">{school.outstanding}</p>
                    <p className="text-xs text-slate-500">Outstanding</p>
                  </div>
                  <div className="text-right min-w-[60px]">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      school.rate >= 80 ? 'bg-emerald-100 text-emerald-700' :
                      school.rate >= 70 ? 'bg-blue-100 text-blue-700' :
                      school.rate >= 50 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {school.rate}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Performing Schools */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-brand mb-4">Top Performing Schools</h3>
            <div className="space-y-3">
              {topPerforming.map((school, idx) => (
                <div key={school.id} className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-700">#{idx + 1}</span>
                    <div>
                      <p className="font-medium text-brand text-sm">{school.name}</p>
                      <p className="text-xs text-slate-500">{school.collected} collected</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    {school.rate}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Collection Rate Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-brand mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600" />
              Low Collection Alerts
            </h3>
            <div className="space-y-3">
              {lowCollection.map(school => (
                <div key={school.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="font-medium text-brand text-sm">{school.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-500">{school.outstanding} outstanding</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      {school.rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
