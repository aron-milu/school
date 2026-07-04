import React, { ReactNode } from 'react';

type Action = { label: string; onClick?: () => void; href?: string; primary?: boolean };
type Stat = { label: string; value: string; icon?: ReactNode };

export default function HeroBanner({
  title,
  subtitle,
  actions = [],
  stats = [],
  className = '',
}: {
  title: string;
  subtitle?: string;
  actions?: Action[];
  stats?: Stat[];
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand via-sky-600 to-cyan-500 text-white shadow-[0_30px_80px_rgba(56,189,248,0.18)] ${className}`}>
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.75fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/80">Workspace</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            {subtitle && <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85">{subtitle}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              {actions.map((a, i) => (
                a.href ? (
                  <a key={i} href={a.href} className={`rounded-full px-5 py-3 text-sm font-semibold ${a.primary ? 'bg-white text-brand shadow-sm' : 'bg-white/10 text-white'}`}>
                    {a.label}
                  </a>
                ) : (
                  <button key={i} onClick={a.onClick} className={`rounded-full px-5 py-3 text-sm font-semibold ${a.primary ? 'bg-white text-brand shadow-sm' : 'bg-white/10 text-white'}`}>
                    {a.label}
                  </button>
                )
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat, i) => (
              <div key={i} className="rounded-[1.75rem] border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">{stat.icon}</div>
                  <span className="text-xs uppercase tracking-[0.24em] text-white/75">Overview</span>
                </div>
                <p className="mt-5 text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap gap-3 text-sm text-white/80">
          <span className="rounded-full bg-white/10 px-3 py-2">Class: S4 Blue</span>
          <span className="rounded-full bg-white/10 px-3 py-2">School: Lubiri Secondary</span>
          <span className="rounded-full bg-white/10 px-3 py-2">Term 2, 2026</span>
        </div>
      </div>
    </div>
  );
}
