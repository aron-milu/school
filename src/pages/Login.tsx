import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { Provider } from '@supabase/supabase-js';
import BrandLogo from '../components/BrandLogo';
import { GraduationCap, Building2, Wrench, Shield, Eye, EyeOff } from 'lucide-react';
import type { UserRole } from '../types';

const ROLE_ROUTES: Record<UserRole, string> = {
  student: '/student',
  teacher: '/teacher',
  school_admin: '/school-admin',
  super_admin: '/super-admin',
  guardian: '/guardian',
};

const FEATURES = [
  {
    icon: <GraduationCap size={18} />,
    title: 'All-in-one tool',
    description: 'Build, run, and scale your apps — end to end.',
  },
  {
    icon: <Wrench size={18} />,
    title: 'Easily add & manage your services',
    description: 'Bring together tasks, projects, timelines, files and more.',
  },
  {
    icon: <Shield size={18} />,
    title: 'Your own company branding',
    description: 'Create your own unique identity for every dashboard.',
  },
  {
    icon: <Building2 size={18} />,
    title: 'Instant Update',
    description: 'Get access to new products and updates throughout the year.',
  },
];

const DEMO_ACCOUNTS = [
  {
    group: 'Secondary School',
    accounts: [
      { email: 'student@example.com', password: 'password123', name: 'Namuli Sarah', role: 'Student' },
      { email: 'teacher@example.com', password: 'password123', name: 'Mark Lee', role: 'Teacher' },
      { email: 'admin@example.com', password: 'password123', name: 'School Admin', role: 'Admin' },
    ],
  },
  {
    group: 'Primary School',
    accounts: [
      { email: 'primary-student@example.com', password: 'password123', name: 'Nakamya Grace', role: 'Pupil' },
      { email: 'primary-teacher@example.com', password: 'password123', name: 'Mrs. Apolot Sarah', role: 'Teacher' },
      { email: 'primary-admin@example.com', password: 'password123', name: 'Headteacher Mukasa', role: 'Admin' },
    ],
  },
  {
    group: 'University',
    accounts: [
      { email: 'uni-student@example.com', password: 'password123', name: 'Okello David', role: 'Student' },
      { email: 'uni-lecturer@example.com', password: 'password123', name: 'Dr. Mugisha Peter', role: 'Lecturer' },
      { email: 'uni-admin@example.com', password: 'password123', name: 'Registrar Kintu', role: 'Admin' },
    ],
  },
  {
    group: 'Platform',
    accounts: [
      { email: 'superadmin@example.com', password: 'password123', name: 'Super Admin', role: 'Super Admin' },
      { email: 'guardian@example.com', password: 'password123', name: 'Guardian Parent', role: 'Guardian' },
    ],
  },
];

export default function Login() {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoPicker, setShowDemoPicker] = useState(false);
  const [demoProvider, setDemoProvider] = useState<'google' | 'microsoft' | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [selectedDemo, setSelectedDemo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleMockLogin = async (mockEmail: string, mockPassword: string) => {
    setCredential(mockEmail);
    setPassword(mockPassword);
    setError('');
    setInfo('');
    setIsLoading(true);

    try {
      await login(mockEmail, mockPassword);
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setIsLoading(true);

    try {
      await login(credential, password);
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (provider: 'google' | 'microsoft') => {
    const isConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY && !!supabase;
    const providerName = provider === 'microsoft' ? 'azure' : provider;

    if (!isConfigured) {
      // Open the demo picker instead of showing the demo controls directly
      setDemoProvider(provider);
      setShowDemoPicker(true);
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
        console.error(err);
        setInfo('Social sign-in failed. Check console for details.');
        setTimeout(() => setInfo(''), 5000);
      }
    })();
  };

  useEffect(() => {
    if (user && !isLoading) {
      navigate(ROLE_ROUTES[user.role], { replace: true });
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_40px_120px_rgba(30,144,255,0.14)] ring-1 ring-slate-200/70 md:items-stretch md:grid-cols-[1.45fr_1.05fr]">
          <div className="hidden md:flex relative flex-col justify-between rounded-l-[2rem] bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center text-white min-h-[620px]">
            <div className="absolute inset-0 bg-slate-950/80" />
            <div className="relative z-10 p-12">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 shadow-lg backdrop-blur-sm overflow-hidden">
                  <BrandLogo className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/70">Soma356</p>
                  <p className="mt-1 text-2xl font-semibold">Modern school platform</p>
                </div>
              </div>
              <div className="mt-14 max-w-xl space-y-6">
                <p className="text-sm uppercase tracking-[0.35em] text-white/70">Build your digital product</p>
                <h1 className="text-4xl font-extrabold leading-tight">Build your digital product with our ultimate Soma356 platform.</h1>
                <p className="text-base text-white/80">A modern experience for schools, teachers, and guardians with clear navigation, progress tracking, and instant updates.</p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                {FEATURES.map(feature => (
                  <div key={feature.title} className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">{feature.icon}</div>
                    <div>
                      <p className="font-semibold text-white">{feature.title}</p>
                      <p className="text-sm text-white/80">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10 p-12">
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">Trusted by schools across the region</p>
                <p className="mt-3 text-2xl font-semibold">100+ institutions</p>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8 lg:p-10 flex items-center justify-center">
            <div className="relative mx-auto w-full max-w-xl h-full">
              <div className="pointer-events-none absolute inset-x-0 top-0 hidden overflow-hidden lg:block">
                <div className="absolute left-0 top-10 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
                <div className="absolute right-0 top-20 h-52 w-52 rounded-full bg-slate-200/60 blur-3xl" />
                <div className="absolute left-1/2 top-56 h-28 w-28 -translate-x-1/2 rounded-full bg-white/80 shadow-xl" />
              </div>
              <div className="flex flex-col gap-8 relative h-full">
                <div
                  className="rounded-[2rem] bg-slate-50/95 bg-cover bg-center bg-no-repeat p-8 shadow-sm ring-1 ring-slate-200 backdrop-blur-sm h-full min-h-[620px]"
                  style={{ backgroundImage: 'url(/login-card-bg.svg)' }}
                >
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Sign in</p>
                      <h2 className="mt-2 text-3xl font-bold text-slate-900">Welcome back</h2>
                    </div>
                    <div className="rounded-3xl bg-brand px-4 py-2 text-sm font-semibold text-white">Soma356</div>
                  </div>
                  <p className="text-sm text-slate-500">Access your progress, lessons, assignments, and communication tools in one place.</p>
                  {error && (
                    <div role="alert" aria-live="assertive" className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  {info && (
                    <div role="status" aria-live="polite" className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                      {info}
                    </div>
                  )}
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleSocialSignIn('google')}
                      className="inline-flex min-w-0 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:shadow-sm"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M533.5 278.4c0-18.5-1.5-36.3-4.3-53.6H272v101.4h147.1c-6.3 34.4-25.1 63.6-53.4 83v68h86.1c50.5-46.6 81.7-115.1 81.7-198.8z" fill="#4285F4" />
                        <path d="M272 544.3c73.8 0 135.8-24.5 181-66.7l-86.1-68c-24 16.1-54.9 25.6-94.9 25.6-72.9 0-134.6-49.1-156.7-115.2H25.8v72.1C70.1 480.1 166.7 544.3 272 544.3z" fill="#34A853" />
                        <path d="M115.3 325.3c-10.6-31.8-10.6-65.9 0-97.7V155.5H25.8c-40.6 81.2-40.6 177.5 0 258.8l89.5-89z" fill="#FBBC05" />
                        <path d="M272 107.7c39.6 0 75 13.6 103 40.4l77.3-77.3C407.6 24.2 345.6 0 272 0 166.7 0 70.1 64.2 25.8 155.5l89.5 72.1C137.4 156.8 199.1 107.7 272 107.7z" fill="#EA4335" />
                      </svg>
                      Sign in with Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialSignIn('microsoft')}
                      className="inline-flex min-w-0 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:shadow-sm"
                    >
                      <span className="grid h-5 w-5 grid-cols-2 grid-rows-2 gap-0">
                        <span className="block h-full w-full bg-[#F35325]" />
                        <span className="block h-full w-full bg-[#81BC06]" />
                        <span className="block h-full w-full bg-[#05A6F0]" />
                        <span className="block h-full w-full bg-[#FFBA08]" />
                      </span>
                      Sign in with Microsoft
                    </button>
                  </div>
                  <div className="my-6 flex items-center gap-3 text-sm text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span>Or</span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={credential}
                        onChange={e => setCredential(e.target.value)}
                        placeholder="alexanderdoe@email.com"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(value => !value)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-2 focus:ring-brand/50"
                        />
                        Remember me
                      </label>
                      <Link to="/forgot-password" className="font-medium text-brand hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </form>
                  <p className="mt-6 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-brand hover:underline">
                      Create one
                    </Link>
                  </p>
                  <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm hidden">
                    {/* Demo selector hidden - accessible via social buttons when running in demo mode */}
                  </div>
                  {showDemoPicker && (
                    <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold">Sign in with demo account {demoProvider ? `(${demoProvider})` : ''}</p>
                        <button onClick={() => setShowDemoPicker(false)} className="text-sm text-slate-500 hover:text-slate-700">Close</button>
                      </div>
                      <div className="mt-3 grid gap-2 max-h-56 overflow-auto">
                        {DEMO_ACCOUNTS.flatMap(g => g.accounts).map(acc => (
                          <button
                            key={acc.email}
                            onClick={() => {
                              setShowDemoPicker(false);
                              handleMockLogin(acc.email, acc.password);
                            }}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-100"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{acc.name}</div>
                                <div className="text-xs text-slate-500">{acc.email} • {acc.role}</div>
                              </div>
                              <div className="text-xs text-slate-400">Use</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
