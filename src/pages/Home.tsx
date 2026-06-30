import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import { BookOpen, Users, GraduationCap, Wrench } from 'lucide-react';

const ROLE_ROUTES: Record<UserRole, string> = {
  student: '/student',
  teacher: '/teacher',
  school_admin: '/school-admin',
  super_admin: '/super-admin',
  guardian: '/guardian',
};

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.3),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_20%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300 backdrop-blur-sm">
                Soma365: the smart education experience
              </div>

              <div className="space-y-6 max-w-2xl">
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Empower every learner, teacher, and guardian with a single modern school portal.</h1>
                <p className="text-lg leading-8 text-slate-300">From student progress tracking to teacher productivity and guardian engagement, Soma365 delivers polished workflows, clear insights, and a beautiful experience for every role.</p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to={user ? ROLE_ROUTES[user.role] : '/login'}
                  className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-8 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-300"
                >
                  {user ? 'Open dashboard' : 'Login to Demo'}
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-8 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/15"
                >
                  See key benefits
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Trusted by', value: '120+ schools' },
                  { label: 'Student growth', value: '98% on track' },
                  { label: 'Guardian access', value: '24/7 updates' },
                ].map(item => (
                  <div key={item.label} className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{item.label}</p>
                    <p className="mt-4 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.25rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
              <div className="rounded-[1.75rem] border border-cyan-400/10 bg-slate-950/90 p-6 shadow-inner shadow-slate-950/20">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Platform preview</p>
                    <h2 className="mt-3 text-3xl font-bold text-white">One experience across every role.</h2>
                  </div>
                  <span className="rounded-2xl bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200">Live demo</span>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: <GraduationCap size={20} />, title: 'Student progress', text: 'Real-time performance and assignment summaries.' },
                    { icon: <Users size={20} />, title: 'Teacher tools', text: 'Plan lessons, share materials, and manage classes.' },
                    { icon: <Wrench size={20} />, title: 'Vocational focus', text: 'Practice, assessment, and skills tracking.' },
                    { icon: <BookOpen size={20} />, title: 'Guardian insights', text: 'Stay connected with attendance and reports.' },
                  ].map(item => (
                    <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/90 p-5 transition hover:border-cyan-400/30">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">{item.icon}</div>
                      <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section id="features" className="mt-20 rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                { title: 'Smart analytics', description: 'Immediate insights into grades, attendance, and improvement opportunities.' },
                { title: 'Secure access', description: 'Role-based permissions with trusted guardian and staff workflows.' },
                { title: 'Ready to demo', description: 'Sample student and staff accounts make it easy to explore instantly.' },
              ].map(feature => (
                <div key={feature.title} className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-8 transition hover:-translate-y-1 hover:border-cyan-400/20">
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-6 text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t border-slate-800 bg-slate-950/80 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Soma365 — Built for modern Ugandan education.
      </footer>
    </div>
  );
}

