import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { AccountType, EducationLevel } from '../types';
import { BookOpen, GraduationCap, Building2 } from 'lucide-react';

const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string; icon: React.ReactNode }[] = [
  { value: 'INDIVIDUAL_STUDENT', label: 'Individual Student', icon: <GraduationCap size={18} /> },
  { value: 'INSTITUTION_STUDENT', label: 'Institutional Student', icon: <Building2 size={18} /> },
  { value: 'TEACHER', label: 'Teacher', icon: <BookOpen size={18} /> },
];

const PRIMARY_CLASS_OPTIONS = [
  { value: 'P1', label: 'Primary 1' },
  { value: 'P2', label: 'Primary 2' },
  { value: 'P3', label: 'Primary 3' },
  { value: 'P4', label: 'Primary 4' },
  { value: 'P5', label: 'Primary 5' },
  { value: 'P6', label: 'Primary 6' },
  { value: 'P7', label: 'Primary 7' },
];

const SECONDARY_CLASS_OPTIONS = [
  { value: 'S1', label: 'Senior 1 (S1)' },
  { value: 'S2', label: 'Senior 2 (S2)' },
  { value: 'S3', label: 'Senior 3 (S3)' },
  { value: 'S4', label: 'Senior 4 (S4)' },
  { value: 'S5', label: 'Senior 5 (S5)' },
  { value: 'S6', label: 'Senior 6 (S6)' },
];

const EDUCATION_LEVEL_OPTIONS = [
  { value: 'primary', label: 'Primary (P1-P7)' },
  { value: 'secondary', label: 'Secondary (S1-S6)' },
  { value: 'tertiary', label: 'Tertiary / Technical College' },
  { value: 'university', label: 'University' },
  { value: 'vocational', label: 'Vocational' },
];

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    institutionId: '',
    invitationCode: '',
    accountType: 'INDIVIDUAL_STUDENT' as AccountType,
    educationLevel: '' as EducationLevel | '',
    classId: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [error, setError] = useState('');
  const [teacherFiles, setTeacherFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('submitting');

    try {
      await register({
        full_name: form.full_name,
        password: form.password,
        accountType: form.accountType,
        invitationCode: form.invitationCode || undefined,
        institutionId: form.institutionId || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        ...(isStudent ? { educationLevel: form.educationLevel, classId: form.classId || undefined } : {}),
        ...(form.accountType === 'TEACHER' ? { kycFiles: teacherFiles } : {}),
      });
      setStatus('done');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setStatus('idle');
    }
  };

  const showInstitutionFields = form.accountType !== 'INDIVIDUAL_STUDENT';
  const isStudent = form.accountType === 'INDIVIDUAL_STUDENT' || form.accountType === 'INSTITUTION_STUDENT';

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100 py-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid overflow-hidden rounded-[2rem] bg-white/90 shadow-[0_40px_120px_rgba(30,144,255,0.14)] ring-1 ring-slate-200/70 lg:grid-cols-[1.6fr_1.2fr]">
          
          {/* Left Column - Hero Section */}
          <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[url('https://images.unsplash.com/photo-1427504494785-cdaf8faf00d1?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center text-white min-h-[720px]">
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
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Join our community</p>
                  <h1 className="mt-4 text-4xl font-extrabold leading-tight">Get started with smarter learning.</h1>
                  <p className="mt-4 max-w-xl text-base text-white/80">Create your account to access progress tracking, live lessons, assignments, and connect with educators and peers.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    { icon: <GraduationCap size={18} />, label: 'Quality content' },
                    { icon: <Building2 size={18} />, label: 'Institution support' },
                    { icon: <BookOpen size={18} />, label: 'Expert teaching' },
                    { icon: <GraduationCap size={18} />, label: 'Track progress' },
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
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">Trusted by educators</p>
                <p className="mt-3 text-2xl font-semibold">100+ institutions</p>
              </div>
            </div>
          </div>

          {/* Right Column - Form Section */}
          <div className="bg-white p-6 sm:p-8 lg:p-10">
            <div className="relative lg:hidden mb-8 rounded-[2rem] overflow-hidden shadow-[0_25px_60px_rgba(30,144,255,0.16)]">
              <img
                src="https://images.unsplash.com/photo-1427504494785-cdaf8faf00d1?auto=format&fit=crop&w=1200&q=80"
                alt="Students studying together"
                className="h-56 w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent p-5 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-100/90">Get started</p>
                <h2 className="mt-3 text-2xl font-bold">Join Soma365</h2>
                <p className="mt-2 text-sm text-slate-200">Create your account and start your learning journey today.</p>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white shadow-md">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
                  <p className="text-sm text-slate-500">Sign up to access the Soma365 platform.</p>
                </div>
              </div>
            </div>

            {error && (
              <div role="alert" aria-live="assertive" className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {status === 'done' && (
              <div role="status" aria-live="polite" className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                Account created successfully! Redirecting to sign in...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Full name</label>
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={e => setForm(s => ({ ...s, full_name: e.target.value }))}
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  disabled={status === 'submitting'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Account type</label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {ACCOUNT_TYPE_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setForm(s => ({ ...s, accountType: option.value }))}
                      className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        form.accountType === option.value
                          ? 'bg-brand text-white shadow-sm'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {option.icon}
                      <span className="hidden sm:inline">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    disabled={status === 'submitting'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(s => ({ ...s, phone: e.target.value }))}
                    placeholder="+256 700 000 000"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    disabled={status === 'submitting'}
                  />
                </div>
              </div>

              {isStudent && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Education level</label>
                    <select
                      value={form.educationLevel}
                      onChange={e => {
                        const level = e.target.value as EducationLevel | '';
                        setForm(s => ({
                          ...s,
                          educationLevel: level,
                          classId: level === 'primary' || level === 'secondary' ? s.classId : '',
                        }));
                      }}
                      required={isStudent}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      <option value="">Select level...</option>
                      {EDUCATION_LEVEL_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Choose the Uganda curriculum stage for your current studies.</p>
                  </div>

                  {(form.educationLevel === 'primary' || form.educationLevel === 'secondary') && (
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Class</label>
                      <select
                        value={form.classId}
                        onChange={e => setForm(s => ({ ...s, classId: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      >
                        <option value="">Select class...</option>
                        {(form.educationLevel === 'primary' ? PRIMARY_CLASS_OPTIONS : SECONDARY_CLASS_OPTIONS).map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-500 mt-2">Choose the class that matches your current Uganda curriculum level.</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm(s => ({ ...s, password: e.target.value }))}
                  placeholder="Create a strong password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  disabled={status === 'submitting'}
                />
              </div>

              {showInstitutionFields && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Institution ID</label>
                    <input
                      type="text"
                      required={form.accountType !== 'INDIVIDUAL_STUDENT'}
                      value={form.institutionId}
                      onChange={e => setForm(s => ({ ...s, institutionId: e.target.value }))}
                      placeholder="Your institution ID"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Invitation code</label>
                    <input
                      type="text"
                      required
                      value={form.invitationCode}
                      onChange={e => setForm(s => ({ ...s, invitationCode: e.target.value }))}
                      placeholder="Your invitation code"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      disabled={status === 'submitting'}
                    />
                  </div>
                </>
              )}

              {form.accountType === 'TEACHER' && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Upload supporting documents (optional)</label>
                  <p className="text-xs text-gray-500 mb-2">PDF or images. Up to 3 files. Max 50MB each.</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={e => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        const valid: File[] = [];
                        for (const f of files) {
                          if (f.size > 50_000_000) continue;
                          if (valid.length + teacherFiles.length >= 3) break;
                          valid.push(f);
                        }
                        if (valid.length) setTeacherFiles(prev => [...prev, ...valid]);
                      }}
                      className="w-full cursor-pointer"
                    />
                    <div className="mt-3 space-y-2">
                      {teacherFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-2 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-700">{f.name}</p>
                            <p className="text-xs text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button type="button" onClick={() => setTeacherFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-red-600">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {form.accountType === 'INDIVIDUAL_STUDENT' && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-600">Individual students can register without an institution. Provide either email or phone to continue.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-500">
              Already have an account? <Link to="/login" className="font-semibold text-brand hover:underline">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
