import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { Provider } from '@supabase/supabase-js';
import { BookOpen, GraduationCap, Building2, Wrench, Users, Shield, Mail, Phone, Eye, EyeOff } from 'lucide-react';
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
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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

  const [info, setInfo] = useState('');
  const [selectedDemo, setSelectedDemo] = useState('');
  const handleSocialSignIn = (provider: 'google' | 'microsoft') => {
    const hasSupabase = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) && !!supabase;
    const providerName = provider === 'microsoft' ? 'azure' : provider;
    if (!hasSupabase) {
      setInfo(`${provider === 'google' ? 'Google' : 'Microsoft'} sign-in is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable.`);
      setTimeout(() => setInfo(''), 5000);
      return;
    }

    (async () => {
      try {
        if (!supabase) {
          setInfo('Social sign-in is unavailable in demo mode.');
          setTimeout(() => setInfo(''), 5000);
          return;
        }
        setInfo('Redirecting to provider...');
        await supabase.auth.signInWithOAuth({ provider: providerName as Provider });
      } catch (err) {
        setInfo('Social sign-in failed. Check console for details.');
        console.error(err);
        setTimeout(() => setInfo(''), 5000);
      }
    })();
  };

  // Redirect to home after login — do this in an effect to avoid updating
  // router state during render (which causes React warnings).
  useEffect(() => {
    if (user && !isLoading) {
      navigate(ROLE_ROUTES[user.role], { replace: true });
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100 py-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid overflow-hidden rounded-[2rem] bg-white/90 shadow-[0_40px_120px_rgba(30,144,255,0.14)] ring-1 ring-slate-200/70 lg:grid-cols-[1.6fr_1.2fr]">
          <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center text-white min-h-[720px]">
            <div className="absolute inset-0 bg-slate-950/70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_25%)]" />
            <div className="absolute inset-0 opacity-60">
              <svg aria-hidden="true" viewBox="0 0 640 420" className="h-full w-full">
                <defs>
                  <linearGradient id="hexPatternStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
                  </linearGradient>
                </defs>
                <g stroke="url(#hexPatternStroke)" strokeWidth="1.5" fill="none">
                  <polygon points="120,90 170,60 220,90 220,150 170,180 120,150" />
                  <polygon points="220,90 270,60 320,90 320,150 270,180 220,150" />
                  <polygon points="170,170 220,140 270,170 270,230 220,260 170,230" />
                  <polygon points="60,230 110,200 160,230 160,290 110,320 60,290" />
                  <polygon points="280,230 330,200 380,230 380,290 330,320 280,290" />
                  <path d="M 220 90 L 270 60" />
                  <path d="M 170 180 L 220 230" />
                  <path d="M 320 150 L 380 170" />
                </g>
                <g fill="rgba(255,255,255,0.9)">
                  <circle cx="180" cy="80" r="6" />
                  <circle cx="320" cy="110" r="6" />
                  <circle cx="240" cy="240" r="6" />
                </g>
              </svg>
            </div>
            <div className="relative z-10 p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-sm">
                  <BookOpen className="text-white" size={24} />
                </div>
                <span className="text-xl font-semibold tracking-tight">Soma365</span>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Education simplified</p>
                  <h1 className="mt-4 text-4xl font-extrabold leading-tight">A smarter way to learn and manage school.</h1>
                  <p className="mt-4 max-w-xl text-base text-white/80">Login to access progress tracking, live lessons, assignments, and communication tools across every school level.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    { icon: <GraduationCap size={18} />, label: 'Live lessons' },
                    { icon: <Building2 size={18} />, label: 'Exam prep' },
                    { icon: <Wrench size={18} />, label: 'Skill training' },
                    { icon: <Users size={18} />, label: 'Parent access' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 rounded-3xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 text-white">{item.icon}</div>
                      <span className="text-sm font-medium text-white">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 p-12">
              <div className="rounded-[2rem] bg-white/10 p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white/10">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">Trusted by schools across the region</p>
                <p className="mt-3 text-2xl font-semibold">100+ institutions</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 lg:p-10">
            <div className="relative lg:hidden mb-8 rounded-[2rem] overflow-hidden shadow-[0_25px_60px_rgba(30,144,255,0.16)]">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                alt="Students doing group learning"
                className="h-56 w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent p-5 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-100/90">Welcome back</p>
                <h2 className="mt-3 text-2xl font-bold">Sign in and continue learning</h2>
                <p className="mt-2 text-sm text-slate-200">Access your school dashboard, assignments, and progress reports from one place.</p>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Sign in</h2>
                  <p className="text-sm text-slate-500">Enter your details to access the Soma365 platform.</p>
                </div>
              </div>
            </div>

            {error && (
              <div role="alert" aria-live="assertive" className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {info && (
              <div role="status" aria-live="polite" className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                {info}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => handleSocialSignIn('google')}
                className="inline-flex min-w-0 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:shadow-sm"
                aria-label="Sign in with Google"
              >
                <svg className="h-5 w-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M533.5 278.4c0-18.5-1.5-36.3-4.3-53.6H272v101.4h147.1c-6.3 34.4-25.1 63.6-53.4 83v68h86.1c50.5-46.6 81.7-115.1 81.7-198.8z" fill="#4285F4"/>
                  <path d="M272 544.3c73.8 0 135.8-24.5 181-66.7l-86.1-68c-24 16.1-54.9 25.6-94.9 25.6-72.9 0-134.6-49.1-156.7-115.2H25.8v72.1C70.1 480.1 166.7 544.3 272 544.3z" fill="#34A853"/>
                  <path d="M115.3 325.3c-10.6-31.8-10.6-65.9 0-97.7V155.5H25.8c-40.6 81.2-40.6 177.5 0 258.8l89.5-89z" fill="#FBBC05"/>
                  <path d="M272 107.7c39.6 0 75 13.6 103 40.4l77.3-77.3C407.6 24.2 345.6 0 272 0 166.7 0 70.1 64.2 25.8 155.5l89.5 72.1C137.4 156.8 199.1 107.7 272 107.7z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <button
                onClick={() => handleSocialSignIn('microsoft')}
                className="inline-flex min-w-0 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:shadow-sm"
                aria-label="Sign in with Microsoft"
              >
                <span className="grid h-5 w-5 grid-cols-2 grid-rows-2 gap-0">
                  <span className="block h-full w-full bg-[#F35325]" />
                  <span className="block h-full w-full bg-[#81BC06]" />
                  <span className="block h-full w-full bg-[#05A6F0]" />
                  <span className="block h-full w-full bg-[#FFBA08]" />
                </span>
                Microsoft
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
              <div className="flex items-center gap-2 rounded-2xl bg-white p-1">
                <button
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    loginMethod === 'email' ? 'bg-brand text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 justify-center">
                    <Mail size={16} /> Email
                  </span>
                </button>
                <button
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    loginMethod === 'phone' ? 'bg-brand text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 justify-center">
                    <Phone size={16} /> Phone
                  </span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  {loginMethod === 'email' ? 'Email' : 'Phone Number'}
                </label>
                <input
                  type={loginMethod === 'email' ? 'email' : 'tel'}
                  value={credential}
                  onChange={e => setCredential(e.target.value)}
                  placeholder={loginMethod === 'email' ? 'you@example.com' : '+256 700 000 000'}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    disabled={isLoading}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-2 focus:ring-brand/50"
                  />
                  Remember me
                </label>

                <Link to="/forgot-password" className="text-sm font-medium text-brand hover:underline">Forgot password?</Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-500">
              Don't have an account? <Link to="/signup" className="font-semibold text-brand hover:underline">Create one</Link>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Demo accounts</p>
              <div className="mt-3 space-y-3">
                <select
                  value={selectedDemo}
                  onChange={e => {
                    const val = e.target.value;
                    setSelectedDemo(val);
                    if (!val) return;
                    try {
                      const parsed = JSON.parse(val);
                      setCredential(parsed.email || '');
                      setPassword(parsed.password || '');
                    } catch {
                      // ignore
                    }
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  aria-label="Select a demo account"
                >
                  <option value="">Choose a demo account...</option>
                  {DEMO_ACCOUNTS.map(group => (
                    <optgroup label={group.group} key={group.group}>
                      {group.accounts.map(ac => (
                        <option key={ac.email} value={JSON.stringify({ email: ac.email, password: ac.password })}>
                          {ac.name} — {ac.role} ({ac.email})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => {
                      if (!selectedDemo) return setInfo('Please select a demo account first.');
                      try {
                        const p = JSON.parse(selectedDemo);
                        handleMockLogin(p.email, p.password);
                      } catch {
                        setInfo('Invalid demo selection');
                      }
                    }}
                    className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                  >
                    Use selected demo
                  </button>
                  <button
                    onClick={() => { setSelectedDemo(''); setCredential(''); setPassword(''); }}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
