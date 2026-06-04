import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, GraduationCap, Building2, Wrench, Users, Shield, Mail, Phone } from 'lucide-react';
import type { UserRole } from '../types';

const ROLE_ROUTES: Record<UserRole, string> = {
  student: '/student',
  teacher: '/teacher',
  school_admin: '/school-admin',
  super_admin: '/super-admin',
  guardian: '/guardian',
};

const DEMO_ACCOUNTS = [
  { group: 'Secondary School', icon: <GraduationCap size={14} />, accounts: [
    { email: 'student@example.com', password: 'password123', phone: '+256700000004', name: 'Namuli Sarah', role: 'Student' },
    { email: 'teacher@example.com', password: 'password123', phone: '+256700000003', name: 'Mark Lee', role: 'Teacher' },
    { email: 'admin@example.com', password: 'password123', phone: '+256700000002', name: 'School Admin', role: 'Admin' },
  ]},
  { group: 'Primary School', icon: <BookOpen size={14} />, accounts: [
    { email: 'primary-student@example.com', password: 'password123', phone: '+256700000101', name: 'Nakamya Grace', role: 'Pupil' },
    { email: 'primary-teacher@example.com', password: 'password123', phone: '+256700000102', name: 'Mrs. Apolot Sarah', role: 'Teacher' },
    { email: 'primary-admin@example.com', password: 'password123', phone: '+256700000103', name: 'Headteacher Mukasa', role: 'Admin' },
  ]},
  { group: 'University', icon: <Building2 size={14} />, accounts: [
    { email: 'uni-student@example.com', password: 'password123', phone: '+256700000301', name: 'Okello David', role: 'Student' },
    { email: 'uni-lecturer@example.com', password: 'password123', phone: '+256700000302', name: 'Dr. Mugisha Peter', role: 'Lecturer' },
    { email: 'uni-admin@example.com', password: 'password123', phone: '+256700000303', name: 'Registrar Kintu', role: 'Admin' },
  ]},
  { group: 'Tertiary College', icon: <GraduationCap size={14} />, accounts: [
    { email: 'tertiary-student@example.com', password: 'password123', phone: '+256700000501', name: 'Ssewankambo James', role: 'Student' },
    { email: 'tertiary-lecturer@example.com', password: 'password123', phone: '+256700000502', name: 'Eng. Achieng Ruth', role: 'Lecturer' },
  ]},
  { group: 'Vocational', icon: <Wrench size={14} />, accounts: [
    { email: 'voc-student@example.com', password: 'password123', phone: '+256700000701', name: 'Achieng Mary', role: 'Trainee' },
    { email: 'voc-instructor@example.com', password: 'password123', phone: '+256700000702', name: 'Mr. Ochieng Paul', role: 'Instructor' },
  ]},
  { group: 'Platform', icon: <Shield size={14} />, accounts: [
    { email: 'superadmin@example.com', password: 'password123', phone: '+256700000001', name: 'Super Admin', role: 'Super Admin' },
    { email: 'guardian@example.com', password: 'password123', phone: '+256700000005', name: 'Guardian Parent', role: 'Guardian' },
  ]},
];

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try { await login(credential, password); } catch { setError('Invalid credentials. Please try again.'); } finally { setIsLoading(false); }
  };

  const handleMockLogin = async (mockEmail: string, mockPassword: string) => {
    setCredential(mockEmail);
    setPassword(mockPassword);
    setError('');
    setIsLoading(true);
    try { await login(mockEmail, mockPassword); } catch { setError('Login failed. Please try again.'); } finally { setIsLoading(false); }
  };

  if (user && !isLoading) {
    const route = ROLE_ROUTES[user.role];
    navigate(route, { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand via-brand to-gray-100">
      <div className="flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-0">

            {/* Left Panel */}
            <div className="hidden lg:flex lg:col-span-3 bg-brand rounded-l-2xl flex-col justify-between p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <BookOpen className="text-brand" size={22} />
                  </div>
                  <span className="text-xl font-bold text-white tracking-tight">Soma365</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-bold text-white leading-tight">
                    Learning for<br />every level.
                  </h1>
                  <p className="text-brand-100 text-base leading-relaxed max-w-md">
                    From primary school to university, vocational training to tertiary colleges. One platform, every learner.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md">
                  {[
                    { icon: <GraduationCap size={18} />, label: 'Primary & Secondary' },
                    { icon: <Building2 size={18} />, label: 'Universities' },
                    { icon: <Wrench size={18} />, label: 'Vocational' },
                    { icon: <Users size={18} />, label: 'Tertiary Colleges' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20">
                      <div className="text-brand-100">{item.icon}</div>
                      <span className="text-sm text-white font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-xs text-brand-200">Empowering Ugandan education through technology</p>
              </div>
            </div>

            {/* Right Panel */}
            <div className="lg:col-span-2 bg-white rounded-2xl lg:rounded-l-none p-8 space-y-6 shadow-2xl">
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
                  <BookOpen className="text-white" size={22} />
                </div>
                <span className="text-xl font-bold text-brand tracking-tight">Soma365</span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand">Sign in</h2>
                <p className="text-gray-500 text-sm mt-1">Access your learning dashboard</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              {/* Login method toggle */}
              <div className="flex gap-2 border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-2 px-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition ${
                    loginMethod === 'email' ? 'bg-brand text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Mail size={16} /> Email
                </button>
                <button
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 py-2 px-3 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition ${
                    loginMethod === 'phone' ? 'bg-brand text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Phone size={16} /> Phone
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    {loginMethod === 'email' ? 'Email' : 'Phone Number'}
                  </label>
                  <input
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    value={credential}
                    onChange={e => setCredential(e.target.value)}
                    placeholder={loginMethod === 'email' ? 'you@example.com' : '+256 700 000 000'}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition text-sm"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition text-sm"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand hover:bg-brand-600 disabled:bg-brand-300 text-white font-semibold py-2.5 rounded-lg transition text-sm"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="border-t border-gray-200 pt-5">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Demo Accounts</p>
                <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                  {DEMO_ACCOUNTS.map(group => (
                    <div key={group.group}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="text-gray-500">{group.icon}</div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{group.group}</span>
                      </div>
                      <div className="space-y-1">
                        {group.accounts.map(account => (
                          <button
                            key={account.email}
                            onClick={() => handleMockLogin(account.email, account.password)}
                            disabled={isLoading}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-brand text-xs group-hover:text-brand-600">{account.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">{account.role}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">{account.email}</p>
                            <p className="text-[9px] text-gray-400">{account.phone}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
