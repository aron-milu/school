import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import { BookOpen, Users, GraduationCap, Wrench, Activity } from 'lucide-react';

const ROLE_ROUTES: Record<UserRole, string> = {
  student: '/student',
  teacher: '/teacher',
  school_admin: '/school-admin',
  super_admin: '/super-admin',
  guardian: '/guardian',
};

function StatCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/3 p-5 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-wide text-slate-300">{label}</p>
      <div className="mt-3 flex items-baseline gap-3">
        <p className="text-2xl font-semibold text-white">{value}</p>
        {delta && <p className="text-sm text-green-300">{delta}</p>}
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-xs uppercase tracking-wider text-slate-300">Soma365 • Smart school portal</div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">A single platform to empower learners, teachers and guardians.</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">Clean workflows, clear analytics, and role-aware tools — built for modern schools in Uganda and beyond.</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to={user ? ROLE_ROUTES[user.role] : '/login'}
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                {user ? 'Open dashboard' : 'Try demo account'}
              </Link>
              <a href="#features" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90">
                See features
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatCard label="Active students" value="1,240" delta="+4.2%" />
              <StatCard label="Assignments due" value="28" delta="-1.1%" />
              <StatCard label="Guardian logins" value="3,102" delta="+6.8%" />
            </div>

            <div className="mt-10 rounded-2xl bg-white/3 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white">Quick actions</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link to="/teacher/upload" className="rounded-lg bg-white/6 px-4 py-2 text-sm text-white/90">Create assignment</Link>
                <Link to="/student/register" className="rounded-lg bg-white/6 px-4 py-2 text-sm text-white/90">Register student</Link>
                <Link to="/materials/upload" className="rounded-lg bg-white/6 px-4 py-2 text-sm text-white/90">Upload material</Link>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-white/6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 shadow-xl">
              <div className="h-44 rounded-xl bg-[url('/hero-dashboard.svg')] bg-cover bg-center bg-no-repeat filter contrast-90 brightness-90 rounded-md" />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Platform preview</p>
                  <p className="mt-1 text-lg font-semibold">One experience across every role</p>
                </div>
                <div className="rounded-full bg-white/6 px-3 py-1 text-sm text-slate-200">Live demo</div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white/6 p-2 text-cyan-300"><GraduationCap size={18} /></div>
                  <div>
                    <p className="text-sm font-semibold">Student progress</p>
                    <p className="text-xs text-slate-400">Real-time reports & benchmarks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white/6 p-2 text-cyan-300"><Users size={18} /></div>
                  <div>
                    <p className="text-sm font-semibold">Teacher tools</p>
                    <p className="text-xs text-slate-400">Plans, grading, resources</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section id="features" className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { title: 'Smart analytics', description: 'Immediate insights into grades, attendance, and improvement opportunities.' },
            { title: 'Secure access', description: 'Role-based permissions for teachers, guardians and admins.' },
            { title: 'Ready to demo', description: 'Preconfigured demo accounts to explore features quickly.' },
          ].map(f => (
            <div key={f.title} className="rounded-2xl border border-white/6 bg-white/3 p-6">
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{f.description}</p>
            </div>
          ))}
        </section>

        <footer className="mt-12 border-t border-white/6 pt-8 text-center text-sm text-slate-400">© {new Date().getFullYear()} Soma365 — Built for modern Ugandan education.</footer>
      </div>
    </div>
  );
}

