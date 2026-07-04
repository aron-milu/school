import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Home as HomeIcon, FileText, Users, Menu, LogOut, ChevronLeft, ChevronRight, Download, Target, Bot, Headphones, HandHelping, Sparkles, GraduationCap, PenTool, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', label: 'Home', icon: <HomeIcon size={18} /> },
    { to: '#features', label: 'Features', icon: <FileText size={18} /> },
    { to: '#pricing', label: 'Pricing', icon: <BookOpen size={18} /> },
    { to: '#docs', label: 'Docs', icon: <Users size={18} /> },
  ];

  useEffect(() => {
    localStorage.setItem('soma:sidebar-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  const isAuthenticated = !!user;
  const roleToPath = (r?: string) => {
    if (!r) return '/';
    switch (r) {
      case 'school_admin': return '/school-admin';
      case 'super_admin': return '/super-admin';
      default: return `/${r}`;
    }
  };
  const basePath = roleToPath(user?.role);
  const roleLabel = user?.role
    ? {
        student: 'Student workspace',
        teacher: 'Teacher workspace',
        school_admin: 'School admin',
        super_admin: 'Super admin',
        guardian: 'Guardian portal',
      }[user.role] || 'Workspace'
    : 'Learning platform';

  return (
    <aside
      className={`hidden md:flex sticky top-0 h-screen transition-all duration-200 flex-shrink-0 ${collapsed ? 'w-20' : 'w-72'} ${isAuthenticated ? 'bg-white text-slate-800 border-r border-slate-200 shadow-sm' : 'bg-transparent text-white'}`}
      aria-label="Primary navigation"
    >
      <div className="h-full flex flex-col py-5 px-3">
        <div className="flex items-center justify-between gap-3 px-1 pb-5 border-b border-slate-100">
          <div className="min-w-0 flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-lg bg-white flex items-center justify-center shadow-sm shadow-brand/20">
              <BrandLogo className="h-full w-full object-contain" />
            </div>
            <div className={`min-w-0 transition-all duration-150 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'}`}>
              <span className={`block truncate font-bold text-lg ${isAuthenticated ? 'text-slate-950' : 'text-white'}`}>Soma365</span>
              <span className={`block truncate text-[11px] font-medium ${isAuthenticated ? 'text-slate-500' : 'text-white/70'}`}>{roleLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(c => !c)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-pressed={collapsed}
              className={`hidden md:inline-flex h-9 w-9 items-center justify-center rounded-lg border transition focus:outline-none focus:ring-2 ${isAuthenticated ? 'border-slate-200 text-slate-500 hover:bg-slate-50 focus:ring-brand/40' : 'border-white/15 bg-white/10 hover:bg-white/15 focus:ring-white/30'}`}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <button
              onClick={() => setCollapsed(c => !c)}
              aria-label="Toggle sidebar"
              className={`ml-auto h-9 w-9 rounded-lg md:hidden focus:outline-none focus:ring-2 ${isAuthenticated ? 'border border-slate-200 text-slate-500 hover:bg-slate-50 focus:ring-brand/40' : 'bg-white/10 focus:ring-white/30'}`}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 pt-5">
          <nav className="h-full overflow-y-auto pr-1 flex flex-col gap-1.5" role="navigation" aria-label="Main">
            {isAuthenticated ? (
              // Dashboard menu for logged-in users, role-specific.
              <>
                {(() => {
                  const role = user?.role;
                  if (role === 'teacher') {
                    return [
                      { id: 'dashboard', to: `${basePath}/overview`, label: 'Home', icon: <HomeIcon size={18} /> },
                      { id: 'students', to: `${basePath}/students`, label: 'My Students', icon: <BookOpen size={18} /> },
                      { id: 'diagnostics', to: `${basePath}/diagnostics`, label: 'Diagnostics', icon: <Target size={18} /> },
                      { id: 'assignments', to: `${basePath}/assignments`, label: 'Assignments', icon: <FileText size={18} /> },
                      { id: 'create', to: `${basePath}/create`, label: 'Create', icon: <BookOpen size={18} /> },
                      { id: 'materials', to: `${basePath}/materials`, label: 'Study Materials', icon: <Download size={18} /> },
                      { id: 'speak-tutor', to: `${basePath}/speak-tutor`, label: 'Speak to Tutor', icon: <Headphones size={18} /> },
                      { id: 'assisted-learning', to: `${basePath}/assisted-learning`, label: 'Assisted Learning', icon: <Sparkles size={18} /> },
                      { id: 'lifelong-learning', to: `${basePath}/lifelong-learning`, label: 'Lifelong Learning', icon: <GraduationCap size={18} /> },
                      { id: 'whiteboard', to: `${basePath}/whiteboard`, label: 'Whiteboard', icon: <PenTool size={18} /> },
                      { id: 'chat', to: `${basePath}/chat`, label: 'Chat', icon: <MessageSquare size={18} /> },
                    ];
                  }
                  if (role === 'school_admin') {
                    return [
                      { id: 'overview', to: `${basePath}/overview`, label: 'Home', icon: <HomeIcon size={18} /> },
                      { id: 'classes', to: `${basePath}/classes`, label: 'Classes', icon: <BookOpen size={18} /> },
                      { id: 'students', to: `${basePath}/students`, label: 'Students', icon: <Users size={18} /> },
                      { id: 'teachers', to: `${basePath}/teachers`, label: 'Teachers', icon: <BookOpen size={18} /> },
                      { id: 'fees', to: `${basePath}/fees`, label: 'School Fees', icon: <FileText size={18} /> },
                    ];
                  }
                  if (role === 'super_admin') {
                    return [
                      { id: 'overview', to: `${basePath}/overview`, label: 'Home', icon: <HomeIcon size={18} /> },
                      { id: 'schools', to: `${basePath}/schools`, label: 'Manage Schools', icon: <BookOpen size={18} /> },
                      { id: 'fees', to: `${basePath}/fees`, label: 'Fee Tracking', icon: <FileText size={18} /> },
                      { id: 'create-school', to: `${basePath}/create-school`, label: 'Create School', icon: <BookOpen size={18} /> },
                    ];
                  }
                  if (role === 'guardian') {
                    return [
                      { id: 'overview', to: `${basePath}/overview`, label: 'Home', icon: <HomeIcon size={18} /> },
                      { id: 'children', to: `${basePath}/children`, label: 'My Children', icon: <Users size={18} /> },
                      { id: 'performance', to: `${basePath}/performance`, label: 'Performance', icon: <Target size={18} /> },
                      { id: 'fees', to: `${basePath}/fees`, label: 'Fees', icon: <FileText size={18} /> },
                      { id: 'reports', to: `${basePath}/reports`, label: 'Reports', icon: <BookOpen size={18} /> },
                      { id: 'communication', to: `${basePath}/communication`, label: 'Communication', icon: <MessageSquare size={18} /> },
                    ];
                  }
                  return [
                    { id: 'dashboard', to: `${basePath}/dashboard`, label: 'Home', icon: <HomeIcon size={18} /> },
                    { id: 'courses', to: `${basePath}/courses`, label: 'My Subjects', icon: <BookOpen size={18} /> },
                    { id: 'assignments', to: `${basePath}/assignments`, label: 'Assignments', icon: <FileText size={18} /> },
                    { id: 'materials', to: `${basePath}/materials`, label: 'Study Materials', icon: <Download size={18} /> },
                    { id: 'mastery', to: `${basePath}/mastery`, label: 'My Progress', icon: <Target size={18} /> },
                    { id: 'ai-tutor', to: `${basePath}/ai-tutor`, label: 'AI Tutor', icon: <Bot size={18} /> },
                    { id: 'speak-tutor', to: `${basePath}/speak-tutor`, label: 'Speak to Tutor', icon: <Headphones size={18} /> },
                    { id: 'ask-teacher', to: `${basePath}/ask-teacher`, label: 'Ask Teacher', icon: <HandHelping size={18} /> },
                    { id: 'assisted-learning', to: `${basePath}/assisted-learning`, label: 'Assisted Learning', icon: <Sparkles size={18} /> },
                    { id: 'lifelong-learning', to: `${basePath}/lifelong-learning`, label: 'Lifelong Learning', icon: <GraduationCap size={18} /> },
                    { id: 'whiteboard', to: `${basePath}/whiteboard`, label: 'Whiteboard', icon: <PenTool size={18} /> },
                    { id: 'chat', to: `${basePath}/chat`, label: 'Messages', icon: <MessageSquare size={18} /> },
                    { id: 'communities', to: `${basePath}/communities`, label: 'Communities', icon: <Users size={18} /> },
                  ];
                })().map(it => (
                  <NavLink
                    key={it.id}
                    to={it.to}
                    title={it.label}
                    className={({ isActive }) => `group relative flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand/40 ${isActive ? 'bg-brand text-white shadow-sm shadow-brand/20' : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'}`}
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition ${isActive ? 'bg-white/15 text-white' : 'text-brand bg-brand-50 group-hover:bg-white'}`} aria-hidden>{it.icon}</span>
                        <span className={`truncate transition-all duration-150 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'}`}>{it.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </>
            ) : (
              navItems.map(item => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 ${isActive ? 'bg-white/10' : ''}`}
                >
                  <span className="text-white/90" aria-hidden>{item.icon}</span>
                  <span className={`text-sm transition-all duration-150 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'}`}>{item.label}</span>
                </NavLink>
              ))
            )}
          </nav>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          {user ? (
            <div className={`flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-9 h-9 shrink-0 bg-brand text-white rounded-lg flex items-center justify-center text-sm font-semibold shadow-sm shadow-brand/20">
                {user.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              <div className={`flex-1 flex flex-col ${collapsed ? 'hidden' : 'flex'}`}>
                <span className="truncate font-semibold text-sm text-slate-900">{user.full_name || user.email}</span>
                <button onClick={() => logout()} className="mt-0.5 text-xs text-slate-500 hover:text-red-600 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand/40 rounded">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <NavLink to="/login" className="block bg-white text-brand px-3 py-2 rounded-lg text-center md:text-left focus:outline-none focus:ring-2 focus:ring-white/30">Sign in</NavLink>
          )}
        </div>
      </div>
    </aside>
  );
}
