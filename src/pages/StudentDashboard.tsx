import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogOut, BookOpen, CheckCircle2, Calendar,
  Users, FileText, Video, Download, Send, Clock, Bell,
  ChevronRight, Search, X, Bot, Sparkles, Loader2, Target,
  TrendingUp, AlertTriangle, Eye, Play, ArrowLeft,
  PenTool,
  Volume2, Mic, Type, Hand
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDashboardTab, getDashboardTabPath } from '../lib/dashboardRoutes';

type Tab = 'dashboard' | 'courses' | 'assignments' | 'materials' | 'mastery' | 'ai-tutor' | 'speak-tutor' | 'ask-teacher' | 'assisted-learning' | 'lifelong-learning' | 'whiteboard' | 'chat' | 'communities';
const TAB_IDS: readonly Tab[] = ['dashboard', 'courses', 'assignments', 'materials', 'mastery', 'ai-tutor', 'speak-tutor', 'ask-teacher', 'assisted-learning', 'lifelong-learning', 'whiteboard', 'chat', 'communities'];

const SUBJECTS = [
  { id: 1, title: 'Mathematics', instructor: 'Mr. Okello James', progress: 75, color: 'bg-brand-600', icon: '📐', students: 38 },
  { id: 2, title: 'Physics', instructor: 'Ms. Nakamya Grace', progress: 60, color: 'bg-brand-700', icon: '⚡', students: 35 },
  { id: 3, title: 'Biology', instructor: 'Dr. Mugisha Peter', progress: 45, color: 'bg-brand-600', icon: '🧬', students: 40 },
  { id: 4, title: 'Chemistry', instructor: 'Mrs. Achieng Ruth', progress: 80, color: 'bg-brand-700', icon: '🧪', students: 36 },
  { id: 5, title: 'English Language', instructor: 'Mr. Ssewankambo D.', progress: 90, color: 'bg-brand-600', icon: '📖', students: 42 },
  { id: 6, title: 'History', instructor: 'Ms. Apolot Sarah', progress: 55, color: 'bg-brand-700', icon: '🏛️', students: 33 },
];

const ASSIGNMENTS = [
  { id: 1, title: 'Quadratic Equations Worksheet', subject: 'Mathematics', dueDate: '2026-04-28', type: 'Homework', status: 'pending' as const, points: 20, instructions: 'Solve all problems on pages 45-47 of your textbook. Show all working. Questions 1-10 on factorization, 11-15 on completing the square, 16-20 on the quadratic formula.', questions: 20 },
  { id: 2, title: "Newton's Laws Practical", subject: 'Physics', dueDate: '2026-04-30', type: 'Lab Report', status: 'pending' as const, points: 30, instructions: 'Write a lab report on the experiment demonstrating Newton\'s Second Law. Include: hypothesis, apparatus, method, data table, graph of F vs a, and conclusion.', questions: 5 },
  { id: 3, title: 'Cell Division Essay', subject: 'Biology', dueDate: '2026-05-02', type: 'Essay', status: 'submitted' as const, points: 25, instructions: 'Write a 500-word essay comparing mitosis and meiosis. Include diagrams and discuss significance in growth and reproduction.', questions: 1 },
  { id: 4, title: 'Organic Chemistry Quiz', subject: 'Chemistry', dueDate: '2026-04-25', type: 'Quiz', status: 'graded' as const, points: 15, score: 13, questions: 15, instructions: 'Online quiz covering alkanes, alkenes, alkynes, and functional groups. 30-minute time limit.' },
  { id: 5, title: 'Comprehension Test', subject: 'English Language', dueDate: '2026-05-05', type: 'Test', status: 'pending' as const, points: 40, instructions: 'Read the passage about climate change in East Africa and answer all comprehension questions. Pay attention to inference and vocabulary questions.', questions: 10 },
  { id: 6, title: 'Colonial Africa Essay', subject: 'History', dueDate: '2026-05-01', type: 'Essay', status: 'pending' as const, points: 25, instructions: 'Discuss the impact of colonialism on East African societies. Cover political, economic, and social effects with specific examples from Uganda, Kenya, and Tanzania.', questions: 1 },
];

type StudyMaterial = { id: number; title: string; subject: string; type: string; size: string; downloads: number; fileUrl?: string };
// MaterialsTabProps removed — using inline prop types below

const STUDY_MATERIALS_BY_LEVEL: Record<string, StudyMaterial[]> = {
  secondary: [
    { id: 1, title: 'UACE Mathematics Past Papers 2020-2025', subject: 'Mathematics', type: 'PDF', size: '4.2 MB', downloads: 156 },
    { id: 2, title: 'O-Level Physics Formulas & Constants', subject: 'Physics', type: 'PDF', size: '1.8 MB', downloads: 234 },
    { id: 3, title: 'Biology Diagrams - Cell Structure', subject: 'Biology', type: 'Video', size: '45 min', downloads: 89 },
    { id: 4, title: 'Chemical Reactions Video Lesson', subject: 'Chemistry', type: 'Video', size: '32 min', downloads: 112 },
    { id: 5, title: 'English Summary Notes O-Level', subject: 'English Language', type: 'PDF', size: '2.1 MB', downloads: 198 },
    { id: 6, title: 'East African History Timeline', subject: 'History', type: 'PDF', size: '3.5 MB', downloads: 67 },
  ],
  primary: [
    { id: 1, title: 'Primary 7 Mathematics Revision', subject: 'Mathematics', type: 'PDF', size: '2.8 MB', downloads: 312 },
    { id: 2, title: 'English Phonics & Reading Guide', subject: 'English', type: 'PDF', size: '1.5 MB', downloads: 445 },
    { id: 3, title: 'Science for Primary Schools - Animals', subject: 'Science', type: 'Video', size: '20 min', downloads: 189 },
    { id: 4, title: 'Social Studies Map of Uganda', subject: 'Social Studies', type: 'PDF', size: '3.1 MB', downloads: 267 },
    { id: 5, title: 'Primary English Storybook Collection', subject: 'English', type: 'PDF', size: '5.4 MB', downloads: 523 },
    { id: 6, title: 'Basic Addition & Subtraction Practice', subject: 'Mathematics', type: 'Video', size: '15 min', downloads: 378 },
  ],
  university: [
    { id: 1, title: 'Calculus & Linear Algebra Notes', subject: 'Mathematics', type: 'PDF', size: '6.8 MB', downloads: 89 },
    { id: 2, title: 'Quantum Mechanics Lecture Series', subject: 'Physics', type: 'Video', size: '2 hrs', downloads: 56 },
    { id: 3, title: 'Research Methodology Guide', subject: 'General', type: 'PDF', size: '3.2 MB', downloads: 234 },
    { id: 4, title: 'Organic Chemistry Advanced Notes', subject: 'Chemistry', type: 'PDF', size: '4.5 MB', downloads: 67 },
    { id: 5, title: 'Academic Writing & Citation Guide', subject: 'English', type: 'PDF', size: '1.9 MB', downloads: 312 },
    { id: 6, title: 'Statistics for Social Sciences', subject: 'Statistics', type: 'Video', size: '1.5 hrs', downloads: 145 },
  ],
  tertiary: [
    { id: 1, title: 'Technical Drawing & CAD Basics', subject: 'Engineering', type: 'PDF', size: '5.2 MB', downloads: 78 },
    { id: 2, title: 'Electrical Installation Handbook', subject: 'Electrical', type: 'PDF', size: '3.8 MB', downloads: 112 },
    { id: 3, title: 'Business Management Principles', subject: 'Business', type: 'PDF', size: '2.4 MB', downloads: 156 },
    { id: 4, title: 'Workshop Safety & Best Practices', subject: 'General', type: 'Video', size: '25 min', downloads: 89 },
    { id: 5, title: 'Accounting Fundamentals', subject: 'Accounting', type: 'PDF', size: '3.1 MB', downloads: 134 },
    { id: 6, title: 'Computer Applications Practical Guide', subject: 'ICT', type: 'Video', size: '40 min', downloads: 201 },
  ],
  vocational: [
    { id: 1, title: 'Carpentry & Joinery Handbook', subject: 'Carpentry', type: 'PDF', size: '4.1 MB', downloads: 67 },
    { id: 2, title: 'Welding Techniques Video Guide', subject: 'Welding', type: 'Video', size: '35 min', downloads: 45 },
    { id: 3, title: 'Tailoring & Fashion Design Basics', subject: 'Fashion', type: 'PDF', size: '2.8 MB', downloads: 89 },
    { id: 4, title: 'Plumbing Installation Guide', subject: 'Plumbing', type: 'PDF', size: '3.3 MB', downloads: 56 },
    { id: 5, title: 'Catering & Hospitality Manual', subject: 'Catering', type: 'PDF', size: '2.6 MB', downloads: 78 },
    { id: 6, title: 'Motor Vehicle Maintenance', subject: 'Automotive', type: 'Video', size: '50 min', downloads: 34 },
  ],
};

const COMMUNITIES = [
  { id: 1, name: 'Senior 4 Study Group', members: 45, subject: 'All Subjects', lastActive: '2 min ago', unread: 3, messages: [
    { sender: 'Nakamya Grace', text: 'Has anyone started the Physics practical report?', time: '2 min ago' },
    { sender: 'Okello David', text: 'Yes, I\'m on the data analysis part. The graph is tricky.', time: '5 min ago' },
    { sender: 'Mugisha Peter', text: 'I can help with the graph. Meet in the library at lunch?', time: '8 min ago' },
  ]},
  { id: 2, name: 'Math Olympiad Prep', members: 28, subject: 'Mathematics', lastActive: '15 min ago', unread: 0, messages: [
    { sender: 'Mr. Okello James', text: 'New practice problems uploaded. Try the geometry section first.', time: '15 min ago' },
    { sender: 'Namuli Sarah', text: 'The circle theorems one is really challenging!', time: '20 min ago' },
  ]},
  { id: 3, name: 'Science Lab Partners', members: 22, subject: 'Physics & Chemistry', lastActive: '1 hr ago', unread: 1, messages: [
    { sender: 'Achieng Ruth', text: 'Remember safety goggles for tomorrow\'s lab session.', time: '1 hr ago' },
  ]},
  { id: 4, name: 'Book Club - African Literature', members: 18, subject: 'English', lastActive: '3 hrs ago', unread: 0, messages: [
    { sender: 'Ssewankambo D.', text: 'Next book: "A Man of the People" by Chinua Achebe', time: '3 hrs ago' },
  ]},
  { id: 5, name: 'UCE Revision Team', members: 56, subject: 'All Subjects', lastActive: '5 min ago', unread: 7, messages: [
    { sender: 'Nakamya Grace', text: 'Biology revision notes shared in the files section', time: '5 min ago' },
    { sender: 'Okello David', text: 'Thanks! Also check the math past papers there.', time: '7 min ago' },
    { sender: 'Mugisha Peter', text: 'Who is coming to the Saturday revision session?', time: '10 min ago' },
  ]},
];

type ChatMessage = { id: number; sender: string; message: string; time: string; isMe: boolean };

const CHAT_MESSAGES_BY_CONTACT: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, sender: 'Okello James', message: 'Remember to review Chapter 5 before tomorrow\'s class', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'You', message: 'Yes sir, I\'ve been going through the examples', time: '10:32 AM', isMe: true },
    { id: 3, sender: 'Okello James', message: 'Good. Also check the past paper I uploaded on quadratic equations', time: '10:33 AM', isMe: false },
    { id: 4, sender: 'You', message: 'I will. Will you be available for extra help during lunch break?', time: '10:35 AM', isMe: true },
    { id: 5, sender: 'Okello James', message: 'Yes, come to the staff room. Bring your exercise book.', time: '10:36 AM', isMe: false },
  ],
  2: [
    { id: 1, sender: 'Nakamya Grace', message: 'The lab report is due next week, right?', time: '9:10 AM', isMe: false },
    { id: 2, sender: 'You', message: 'Yes, I plan to finish the data section today.', time: '9:12 AM', isMe: true },
  ],
  3: [
    { id: 1, sender: 'Mugisha Peter', message: 'Did you submit the biology essay?', time: '8:40 AM', isMe: false },
    { id: 2, sender: 'You', message: 'Not yet, I\'m adding the conclusion now.', time: '8:42 AM', isMe: true },
  ],
  4: [
    { id: 1, sender: 'Achieng Ruth', message: 'Bring your safety goggles for tomorrow\'s lab.', time: 'Yesterday', isMe: false },
  ],
  5: [
    { id: 1, sender: 'S4 Blue Class', message: 'Who is joining the revision session?', time: 'Yesterday', isMe: false },
  ],
};

const CHAT_CONTACTS = [
  { id: 1, name: 'Mr. Okello James', role: 'Mathematics Teacher', lastMessage: 'Come to the staff room', time: '10:36 AM', unread: 1, online: true },
  { id: 2, name: 'Nakamya Grace', role: 'Physics Teacher', lastMessage: 'Lab report due Friday', time: '9:15 AM', unread: 0, online: true },
  { id: 3, name: 'Mugisha Peter', role: 'Biology Teacher', lastMessage: 'Good work on the essay', time: 'Yesterday', unread: 0, online: false },
  { id: 4, name: 'S4 Blue Class', role: 'Class Group', lastMessage: 'Meeting at 3pm', time: 'Yesterday', unread: 5, online: false },
  { id: 5, name: 'Achieng Ruth', role: 'Chemistry Teacher', lastMessage: 'Quiz results posted', time: '2 days ago', unread: 0, online: false },
];

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    try {
      const raw = localStorage.getItem('soma365-active-tab');
      if (raw && TAB_IDS.includes(raw as Tab)) return raw as Tab;
    } catch {}
    return getDashboardTab(window.location.pathname, TAB_IDS, 'dashboard');
  });
  const [selectedChat, setSelectedChat] = useState(() => CHAT_CONTACTS[0]?.id || 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [assignmentModal, setAssignmentModal] = useState<typeof ASSIGNMENTS[0] | null>(null);
  const [communityChat, setCommunityChat] = useState<typeof COMMUNITIES[0] | null>(null);
  const [communityInput, setCommunityInput] = useState('');
  const [downloadToast, setDownloadToast] = useState('');
  const [recentActivity, setRecentActivity] = useState<Array<{ text: string; time: string }>>(() => {
    try {
      const raw = localStorage.getItem('soma365-recent-activity');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [assignments, setAssignments] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('soma365-assignments');
      return raw ? JSON.parse(raw) : ASSIGNMENTS;
    } catch {
      return ASSIGNMENTS;
    }
  });
  const [startAssignment, setStartAssignment] = useState<typeof ASSIGNMENTS[0] | null>(null);
  const [startAnswers, setStartAnswers] = useState<Record<number, string>>({});

  const handleLogout = async () => { await logout(); navigate('/login'); };

  useEffect(() => {
    const tab = getDashboardTab(location.pathname, TAB_IDS, 'dashboard');
    setActiveTab(tab);

    const legacyHashTab = location.hash.replace('#', '') as Tab;
    if (TAB_IDS.includes(legacyHashTab)) {
      navigate(getDashboardTabPath('/student', legacyHashTab), { replace: true });
    } else if (location.pathname === '/student' || location.pathname === '/student/') {
      navigate(getDashboardTabPath('/student', tab), { replace: true });
    }
  }, [location.pathname, location.hash, navigate]);

  const navigateToTab = (tab: Tab) => {
    setActiveTab(tab);
    navigate(getDashboardTabPath('/student', tab));
  };

  useEffect(() => {
    try { localStorage.setItem('soma365-active-tab', activeTab); } catch {}
  }, [activeTab]);

  const dashboardTabLabels: Record<Tab, string> = {
    dashboard: 'Overview',
    courses: 'Courses',
    assignments: 'Assignments',
    materials: 'Materials',
    mastery: 'Mastery',
    'ai-tutor': 'AI Tutor',
    'speak-tutor': 'Speak Tutor',
    'ask-teacher': 'Ask Teacher',
    'assisted-learning': 'Assisted Learning',
    'lifelong-learning': 'Lifelong Learning',
    whiteboard: 'Whiteboard',
    chat: 'Chat',
    communities: 'Communities',
  };

  const dashboardNavTabs: Tab[] = ['dashboard', 'courses', 'assignments', 'materials', 'mastery', 'ai-tutor', 'chat', 'communities'];

  const currentMaterials = STUDY_MATERIALS_BY_LEVEL[user?.education_level || 'secondary'] || STUDY_MATERIALS_BY_LEVEL.secondary;
  const filteredMaterials = currentMaterials.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const levelLabels: Record<string, string> = {
    primary: 'Primary School',
    secondary: 'Secondary School',
    university: 'University',
    tertiary: 'Tertiary College',
    vocational: 'Vocational',
  };

  const handleDownload = async (material: StudyMaterial) => {
    const levelLabel = levelLabels[user?.education_level || 'secondary'] || 'Secondary School';
    setDownloadToast(`Downloading "${material.title}"...`);

    try {
      if (material.fileUrl) {
        const response = await fetch(material.fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${material.title.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}.${material.type === 'Video' ? 'mp4' : material.type === 'PDF' ? 'pdf' : 'txt'}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const extension = material.type === 'Video' ? 'mp4' : material.type === 'PDF' ? 'pdf' : 'txt';
        const fileName = `${material.title.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}.${extension}`;
        const content = `Soma365 sample ${material.type} content for "${material.title}"

Subject: ${material.subject}
Level: ${levelLabel}

This download is a demo file to show how the download feature works.`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download failed', err);
      setDownloadToast(`Failed to download "${material.title}".`);
    } finally {
      setTimeout(() => setDownloadToast(''), 2500);
      // record activity
      try {
        const entry = { text: `Downloaded ${material.title}`, time: new Date().toLocaleString() };
        const next = [entry, ...recentActivity].slice(0, 30);
        setRecentActivity(next);
        localStorage.setItem('soma365-recent-activity', JSON.stringify(next));
      } catch {}
    }
  };

  const handleStartAssignment = (a: typeof ASSIGNMENTS[0]) => {
    setStartAssignment(a);
    setStartAnswers({});
    setAssignments(prev => {
      const next = prev.map(item => item.id === a.id ? { ...item, status: 'in-progress' } : item);
      try { localStorage.setItem('soma365-assignments', JSON.stringify(next)); } catch {}
      return next;
    });
    try {
      const entry = { text: `Started assignment: ${a.title}`, time: new Date().toLocaleString() };
      const next = [entry, ...recentActivity].slice(0, 30);
      setRecentActivity(next);
      localStorage.setItem('soma365-recent-activity', JSON.stringify(next));
    } catch {}
  };

  const handleSubmitAssignment = () => {
    if (!startAssignment) return;
    // mark assignment as submitted and persist
    setAssignments(prev => {
      const next = prev.map(item => item.id === startAssignment.id ? { ...item, status: 'submitted' } : item);
      try { localStorage.setItem('soma365-assignments', JSON.stringify(next)); } catch {}
      return next;
    });
    setStartAssignment(null);
    try {
      const entry = { text: `Submitted assignment: ${startAssignment.title}`, time: new Date().toLocaleString() };
      const next = [entry, ...recentActivity].slice(0, 30);
      setRecentActivity(next);
      localStorage.setItem('soma365-recent-activity', JSON.stringify(next));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Download Toast */}
      {downloadToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium">
          <Download size={16} /> {downloadToast}
        </div>
      )}

      {/* Assignment Detail Modal */}
      {assignmentModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setAssignmentModal(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-brand">{assignmentModal.title}</h3>
              <button onClick={() => setAssignmentModal(null)} className="p-1 hover:bg-slate-100 rounded"><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex gap-4"><span className="text-slate-500 w-24">Subject:</span><span className="font-medium text-brand">{assignmentModal.subject}</span></div>
              <div className="flex gap-4"><span className="text-slate-500 w-24">Type:</span><span className="font-medium text-brand">{assignmentModal.type}</span></div>
              <div className="flex gap-4"><span className="text-slate-500 w-24">Due Date:</span><span className="font-medium text-brand">{assignmentModal.dueDate}</span></div>
              <div className="flex gap-4"><span className="text-slate-500 w-24">Points:</span><span className="font-medium text-brand">{assignmentModal.points}</span></div>
              <div className="flex gap-4"><span className="text-slate-500 w-24">Questions:</span><span className="font-medium text-brand">{assignmentModal.questions}</span></div>
              <div><span className="text-slate-500">Instructions:</span><p className="mt-1 text-slate-700 bg-slate-50 p-3 rounded-lg">{assignmentModal.instructions}</p></div>
            </div>
            {assignmentModal.status === 'graded' && assignmentModal.score !== undefined && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="font-bold text-emerald-700">Score: {assignmentModal.score}/{assignmentModal.points} ({Math.round((assignmentModal.score / assignmentModal.points) * 100)}%)</p>
              </div>
            )}
            <div className="mt-5 flex gap-2">
              {assignmentModal.status === 'pending' && (
                <button onClick={() => { setAssignmentModal(null); handleStartAssignment(assignmentModal); }} className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition">Start Assignment</button>
              )}
              <button onClick={() => setAssignmentModal(null)} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Start Assignment Modal */}
      {startAssignment && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setStartAssignment(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-brand">{startAssignment.title}</h3>
              <button onClick={() => setStartAssignment(null)} className="p-1 hover:bg-slate-100 rounded"><X size={18} className="text-slate-400" /></button>
            </div>
            <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">{startAssignment.instructions}</p>
            <div className="space-y-4">
              {Array.from({ length: Math.min(startAssignment.questions, 5) }, (_, i) => i + 1).map(q => (
                <div key={q} className="border border-slate-200 rounded-lg p-4">
                  <p className="font-medium text-brand text-sm mb-2">Question {q}</p>
                  <textarea
                    rows={3}
                    value={startAnswers[q] || ''}
                    onChange={e => setStartAnswers(prev => ({ ...prev, [q]: e.target.value }))}
                    placeholder="Type your answer here..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                  />
                </div>
              ))}
              {startAssignment.questions > 5 && <p className="text-xs text-slate-400 text-center">...and {startAssignment.questions - 5} more questions</p>}
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={handleSubmitAssignment} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition">Submit Assignment</button>
              <button onClick={() => setStartAssignment(null)} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition">Save & Continue Later</button>
            </div>
          </div>
        </div>
      )}

      {/* Community Chat Modal */}
      {communityChat && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setCommunityChat(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl flex flex-col" style={{ height: '70vh' }} onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
              <button onClick={() => setCommunityChat(null)} className="p-1 hover:bg-slate-100 rounded"><ArrowLeft size={18} className="text-slate-600" /></button>
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center"><Users size={14} className="text-white" /></div>
              <div>
                <p className="font-semibold text-brand text-sm">{communityChat.name}</p>
                <p className="text-[10px] text-slate-500">{communityChat.members} members &middot; {communityChat.subject}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {communityChat.messages.map((msg, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-[10px] font-bold text-slate-600">{msg.sender[0]}</span></div>
                  <div>
                    <p className="text-xs font-medium text-brand">{msg.sender} <span className="text-[10px] text-slate-400 font-normal">{msg.time}</span></p>
                    <p className="text-sm text-slate-700 mt-0.5">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200">
              <div className="flex gap-2">
                <input type="text" value={communityInput} onChange={e => setCommunityInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
                <button onClick={() => { if (communityInput.trim()) setCommunityInput(''); }} className="px-3 py-2 bg-brand text-white rounded-lg hover:bg-brand-600 transition"><Send size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}>
          <div className="absolute top-14 right-4 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-brand text-sm">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="text-xs text-brand font-medium hover:underline">Mark all read</button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {[
                { title: 'New Assignment', desc: 'Quadratic Equations Worksheet posted by Mr. Okello', time: '10 min ago', icon: <FileText size={14} className="text-brand" /> },
                { title: 'Quiz Graded', desc: 'Organic Chemistry Quiz: 13/15', time: '1 hr ago', icon: <CheckCircle2 size={14} className="text-emerald-600" /> },
                { title: 'Community Message', desc: 'New message in UCE Revision Team', time: '2 hrs ago', icon: <Users size={14} className="text-cyan-600" /> },
              ].map((n, i) => (
                <div key={i} className="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex items-start gap-3">
                  <div className="mt-0.5">{n.icon}</div>
                  <div><p className="text-sm font-medium text-brand">{n.title}</p><p className="text-xs text-slate-500">{n.desc}</p><p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center"><BrandLogo className="h-full w-full object-contain" /></div>
            <div><h1 className="font-bold text-brand text-sm">Soma365</h1><p className="text-[10px] text-slate-500">{({ primary: 'Primary School', secondary: 'Secondary School', university: 'University', tertiary: 'Tertiary College', vocational: 'Vocational Institute' } as Record<string, string>)[user?.education_level || 'secondary'] || 'Secondary School'} - Student</p></div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowNotifications(true)} className="relative p-2 hover:bg-slate-100 rounded-lg transition">
              <Bell size={18} className="text-amber-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">3</span>
            </button>
            <div className="text-right hidden sm:block"><p className="font-semibold text-brand text-sm">{user?.full_name}</p><p className="text-[10px] text-slate-500">{({ primary: 'Primary School', secondary: 'Secondary School', university: 'University', tertiary: 'Tertiary College', vocational: 'Vocational Institute' } as Record<string, string>)[user?.education_level || 'secondary'] || 'Secondary School'} Student</p></div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg transition" title="Logout"><LogOut size={18} className="text-red-500" /></button>
          </div>
        </div>
      </header>

      {/* Quick dashboard navigation for primary student workflows. */}

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Your workspace</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">Keep your learning on track</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1">
              {dashboardNavTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => navigateToTab(tab)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-brand text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {dashboardTabLabels[tab]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {activeTab === 'dashboard' && <DashboardTab assignments={assignments} onViewAssignments={() => navigateToTab('assignments')} onViewMaterials={() => navigateToTab('materials')} onViewAssignment={(a) => setAssignmentModal(a)} />}
        {activeTab === 'courses' && <CoursesTab onContinue={() => navigateToTab('mastery')} />}
        {activeTab === 'assignments' && <AssignmentsTab assignments={assignments} setAssignments={setAssignments} onViewDetails={setAssignmentModal} onStartAssignment={handleStartAssignment} />}
        {activeTab === 'materials' && <MaterialsTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredMaterials={filteredMaterials} onDownload={handleDownload} level={user?.education_level || 'secondary'} />}
        {activeTab === 'mastery' && <MasteryTab />}
        {activeTab === 'ai-tutor' && <AITutorTab />}
        {activeTab === 'speak-tutor' && <SpeakToTutorTab />}
        {activeTab === 'ask-teacher' && <AskTeacherTab />}
        {activeTab === 'assisted-learning' && <AssistedLearningTab />}
        {activeTab === 'lifelong-learning' && <LifelongLearningTab />}
        {activeTab === 'whiteboard' && <WhiteboardTab />}
        {activeTab === 'chat' && <ChatTab selectedChat={selectedChat} setSelectedChat={setSelectedChat} />}
        {activeTab === 'communities' && <CommunitiesTab onOpenChat={setCommunityChat} />}
      </div>
    </div>
  );
}

function BarChart3(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
    </svg>
  );
}

function DashboardTab({ assignments, onViewAssignments, onViewMaterials, onViewAssignment }: { assignments: any[]; onViewAssignments: () => void; onViewMaterials: () => void; onViewAssignment: (a: any) => void }) {
  const { user } = useAuth();
  const heroStats = [
    { label: 'Average score', value: '78%', icon: <BarChart3 size={20} />, accent: 'bg-white/15' },
    { label: 'Class rank', value: '5 / 38', icon: <CheckCircle2 size={20} />, accent: 'bg-white/15' },
    { label: 'Attendance', value: '96%', icon: <Calendar size={20} />, accent: 'bg-white/15' },
    { label: 'Assignments done', value: '12 / 15', icon: <FileText size={20} />, accent: 'bg-white/15' },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand via-sky-600 to-cyan-500 text-white shadow-[0_30px_80px_rgba(56,189,248,0.25)]">
        <div className="px-6 py-8 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.75fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/80">Student workspace</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Beautiful learning, built for you.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85">Keep your assignments, studies, and progress aligned in one polished student dashboard. Fast access to materials, grades, and tutor support.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={onViewAssignments} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand shadow-sm transition hover:bg-slate-100">Review assignments</button>
                <button onClick={onViewMaterials} className="rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">Browse materials</button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {heroStats.map(stat => (
                <div key={stat.label} className="rounded-[1.75rem] border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.accent}`}>{stat.icon}</div>
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Progress overview</h2>
              <p className="mt-1 text-sm text-slate-500">Your key scores and readiness at a glance.</p>
            </div>
            <button onClick={onViewAssignments} className="text-sm font-semibold text-brand transition hover:text-brand-700">View all assignments</button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {heroStats.slice(0, 4).map(stat => (
              <div key={stat.label} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-brand">{stat.icon}</div>
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-500">{stat.label}</span>
                </div>
                <p className="mt-5 text-3xl font-semibold text-slate-950">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Smart summary</h2>
          <p className="mt-1 text-sm text-slate-500">Actionable highlights from your recent learning.</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-[1.5rem] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-950">Most urgent</p>
              <p className="mt-2 text-slate-600">Submit the Physics lab report before tomorrow to keep your week on track.</p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-950">Study tip</p>
              <p className="mt-2 text-slate-600">Review your Chemistry quiz feedback and schedule a 15-minute revision session.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Upcoming assignments</h2>
              <p className="mt-1 text-sm text-slate-500">Due soon and ready to start.</p>
            </div>
            <button onClick={onViewAssignments} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600">View all</button>
          </div>
          <div className="mt-6 space-y-3">
            {assignments.filter(a => a.status === 'pending').slice(0, 4).map(a => (
              <button key={a.id} onClick={() => onViewAssignment(a)} className="flex w-full items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-slate-100">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-brand text-white"><FileText size={20} /></div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{a.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{a.subject} · {a.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{a.dueDate}</p>
                  <p className="mt-1 text-xs text-slate-500">{a.points} pts</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Recent activity</h2>
          <p className="mt-1 text-sm text-slate-500">What happened in your learning feed.</p>
          <div className="mt-6 space-y-4">
            {[
              { text: 'Submitted Cell Division Essay', time: '2 hrs ago', icon: <CheckCircle2 size={18} className="text-emerald-600" /> },
              { text: 'Scored 13/15 on Chemistry Quiz', time: 'Yesterday', icon: <CheckCircle2 size={18} className="text-brand" /> },
              { text: 'Downloaded Physics Formulas PDF', time: 'Yesterday', icon: <Download size={18} className="text-amber-600" /> },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-3xl bg-white text-slate-700">{item.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{item.text}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CoursesTab({ onContinue }: { onContinue: (subject: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Subjects</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-500">Your current learning focus areas with progress, instructor support, and study actions to stay ahead.</p>
        </div>
        <button onClick={() => onContinue('Mathematics')} className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600">
          Continue latest subject
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {SUBJECTS.map(subject => (
          <div key={subject.id} className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <div className={`${subject.color} px-5 py-5 text-white`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-2xl">{subject.icon}</div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">{subject.students} students</span>
              </div>
              <div className="mt-5">
                <h3 className="text-xl font-bold">{subject.title}</h3>
                <p className="mt-2 text-sm text-white/90">{subject.instructor}</p>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Progress</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{subject.progress}%</p>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Ongoing</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Topics covered</span>
                  <span>12</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Assignments due</span>
                  <span>4</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Mastery</span>
                  <span>{subject.progress >= 80 ? 'Strong' : subject.progress >= 60 ? 'Improving' : 'Developing'}</span>
                </div>
              </div>

              <div className="mt-2 overflow-hidden rounded-full bg-slate-200 h-3">
                <div className={`${subject.color} h-3 rounded-full`} style={{ width: `${subject.progress}%` }} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button onClick={() => onContinue(subject.title)} className="inline-flex items-center justify-center rounded-xl border border-brand/20 bg-brand/10 px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand/20">
                  Continue
                </button>
                <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  View lessons
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssignmentsTab({ assignments, setAssignments, onViewDetails, onStartAssignment }: { assignments: any[]; setAssignments: React.Dispatch<React.SetStateAction<any[]>>; onViewDetails: (a: any) => void; onStartAssignment: (a: any) => void }) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded' | 'in-progress'>('all');
  const filtered = assignments.filter(a => filter === 'all' || a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">Assignments</h2>
        <div className="flex gap-2">
          {(['all', 'pending', 'submitted', 'graded'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition capitalize ${filter === f ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${a.status === 'graded' ? 'bg-slate-700' : a.status === 'submitted' ? 'bg-slate-500' : 'bg-brand'}`}>
                  {a.status === 'graded' ? <CheckCircle2 size={22} className="text-white" /> : a.status === 'submitted' ? <Clock size={22} className="text-white" /> : <FileText size={22} className="text-white" />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-brand truncate">{a.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5 truncate">{a.subject} - {a.type}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> Due: {a.dueDate}</span>
                    <span className="flex items-center gap-1"><FileText size={12} /> {a.points} pts</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {a.questions} questions</span>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${a.status === 'graded' ? 'bg-slate-100 text-slate-700' : a.status === 'submitted' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'}`}>{a.status}</span>
                {a.status === 'graded' && a.score !== undefined && <p className="text-sm font-bold text-emerald-600 mt-1">{a.score}/{a.points}</p>}
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {a.status === 'pending' && (
                <>
                  <button onClick={() => onStartAssignment(a)} className="w-full sm:w-auto px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition flex items-center justify-center gap-1.5"><Play size={14} /> Start Assignment</button>
                  <button onClick={() => onViewDetails(a)} className="w-full sm:w-auto px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-1.5"><Eye size={14} /> View Instructions</button>
                </>
              )}
                {a.status === 'in-progress' && (
                  <>
                    <button onClick={() => onViewDetails(a)} className="w-full sm:w-auto px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-1.5"><Eye size={14} /> Continue</button>
                    <button onClick={() => { setAssignments(prev => prev.map(item => item.id === a.id ? { ...item, status: 'submitted' } : item)); }} className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition">Mark Submitted</button>
                  </>
                )}
              {a.status === 'submitted' && (
                <button onClick={() => onViewDetails(a)} className="w-full sm:w-auto px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-1.5"><Eye size={14} /> View Submission</button>
              )}
              {a.status === 'graded' && (
                <button onClick={() => onViewDetails(a)} className="w-full sm:w-auto px-4 py-2 border border-emerald-200 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-50 transition flex items-center justify-center gap-1.5"><Eye size={14} /> View Feedback</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaterialsTab({ searchQuery, setSearchQuery, filteredMaterials, onDownload, level }: {
  searchQuery: string; setSearchQuery: (q: string) => void; filteredMaterials: StudyMaterial[]; onDownload: (material: StudyMaterial) => void; level: string;
}) {
  const levelLabels: Record<string, string> = { primary: 'Primary School', secondary: 'Secondary School', university: 'University', tertiary: 'Tertiary College', vocational: 'Vocational' };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-brand">Study Materials</h2><p className="text-sm text-slate-500 mt-0.5">{levelLabels[level] || 'Secondary School'} resources</p></div>
      </div>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Search materials by title or subject..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={16} className="text-slate-400" /></button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map(material => (
          <div key={material.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${material.type === 'Video' ? 'bg-rose-600' : 'bg-brand'}`}>
                {material.type === 'Video' ? <Video size={22} className="text-white" /> : <FileText size={22} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-brand text-sm">{material.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{material.subject}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="uppercase font-medium px-1.5 py-0.5 bg-slate-100 rounded">{material.type}</span>
                  <span>{material.size}</span>
                  <span className="flex items-center gap-1"><Download size={10} /> {material.downloads}</span>
                </div>
              </div>
              <button onClick={() => onDownload(material)} className="p-2 hover:bg-slate-100 rounded-lg transition" title="Download"><Download size={18} className="text-brand" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatTab({ selectedChat, setSelectedChat }: {
  selectedChat: number; setSelectedChat: (v: number) => void;
}) {
  const [showContacts, setShowContacts] = useState(true);
  const [conversations, setConversations] = useState<Record<number, ChatMessage[]>>(CHAT_MESSAGES_BY_CONTACT);
  const [input, setInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const activeContact = CHAT_CONTACTS.find(contact => contact.id === selectedChat) || CHAT_CONTACTS[0];
  const messages = conversations[selectedChat] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, selectedChat]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: 'You',
      message: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setConversations(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage],
    }));
    setInput('');

    setTimeout(() => {
      const reply: ChatMessage = {
        id: Date.now() + 1,
        sender: activeContact?.name || 'Teacher',
        message: 'Thanks! I will get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };
      setConversations(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), reply],
      }));
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
      <div className="flex h-full">
        <div className={`${showContacts ? 'w-full md:w-80' : 'hidden md:block md:w-80'} border-r border-slate-200 flex flex-col`}>
          <div className="p-4 border-b border-slate-200"><h3 className="font-bold text-brand">Messages</h3></div>
          <div className="flex-1 overflow-y-auto">
            {CHAT_CONTACTS.map(contact => (
              <button key={contact.id} onClick={() => { setSelectedChat(contact.id); setShowContacts(false); }} className={`w-full text-left p-4 hover:bg-slate-50 transition border-b border-slate-100 ${selectedChat === contact.id ? 'bg-slate-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="relative"><div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center"><span className="text-white text-sm font-semibold">{contact.name[0]}</span></div>{contact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />}</div>
                  <div className="flex-1 min-w-0"><div className="flex items-center justify-between"><p className="font-medium text-brand text-sm truncate">{contact.name}</p><span className="text-[10px] text-slate-400 flex-shrink-0">{contact.time}</span></div><p className="text-xs text-slate-500 truncate">{contact.lastMessage}</p></div>
                  {contact.unread > 0 && <span className="w-5 h-5 bg-brand rounded-full text-[10px] text-white flex items-center justify-center font-bold flex-shrink-0">{contact.unread}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className={`${!showContacts ? 'w-full md:flex-1' : 'hidden md:flex md:flex-1'} flex flex-col`}>
          <div className="p-4 border-b border-slate-200 flex items-center gap-3">
            <button onClick={() => setShowContacts(true)} className="md:hidden p-1 hover:bg-slate-100 rounded"><ChevronRight size={20} className="text-slate-600 rotate-180" /></button>
            <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center"><span className="text-white text-xs font-semibold">{activeContact?.name[0]}</span></div>
            <div><p className="font-semibold text-brand text-sm">{activeContact?.name}</p><p className="text-[10px] text-slate-500">{activeContact?.role}</p></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.isMe ? 'bg-brand text-white rounded-br-md' : 'bg-slate-100 text-brand rounded-bl-md'}`}>
                  <p>{msg.message}</p><p className={`text-[10px] mt-1 ${msg.isMe ? 'text-slate-300' : 'text-slate-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSend(); }} placeholder="Type a message..." className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm" />
              <button onClick={handleSend} className="w-10 h-10 bg-brand hover:bg-brand-600 rounded-full flex items-center justify-center transition"><Send size={16} className="text-white" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MasteryTab() {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const subjectMastery = [
    { subject: 'Mathematics', topics: [{ name: 'Quadratic Equations', mastery: 'mastered', score: 92, attempts: 8, weakPoints: '' },{ name: 'Linear Programming', mastery: 'proficient', score: 78, attempts: 5, weakPoints: '' },{ name: 'Differentiation', mastery: 'developing', score: 55, attempts: 3, weakPoints: 'Chain rule application' },{ name: 'Integration', mastery: 'struggling', score: 32, attempts: 6, weakPoints: 'Substitution method, definite integrals' },{ name: 'Vectors', mastery: 'not_started', score: 0, attempts: 0, weakPoints: '' },{ name: 'Probability', mastery: 'developing', score: 48, attempts: 4, weakPoints: 'Conditional probability' }]},
    { subject: 'Physics', topics: [{ name: "Newton's Laws", mastery: 'mastered', score: 88, attempts: 7, weakPoints: '' },{ name: 'Projectile Motion', mastery: 'proficient', score: 75, attempts: 5, weakPoints: '' },{ name: 'Electromagnetic Induction', mastery: 'struggling', score: 28, attempts: 4, weakPoints: 'Lenz law, Faraday calculations' },{ name: 'Wave Optics', mastery: 'developing', score: 50, attempts: 3, weakPoints: 'Interference patterns' },{ name: 'Thermodynamics', mastery: 'not_started', score: 0, attempts: 0, weakPoints: '' }]},
    { subject: 'Biology', topics: [{ name: 'Cell Division', mastery: 'mastered', score: 95, attempts: 6, weakPoints: '' },{ name: 'Genetics', mastery: 'developing', score: 52, attempts: 4, weakPoints: 'Punnett squares, sex-linked traits' },{ name: 'Ecology', mastery: 'proficient', score: 72, attempts: 3, weakPoints: '' },{ name: 'Human Reproduction', mastery: 'struggling', score: 35, attempts: 5, weakPoints: 'Hormonal regulation, menstrual cycle' },{ name: 'Evolution', mastery: 'not_started', score: 0, attempts: 0, weakPoints: '' }]},
    { subject: 'Chemistry', topics: [{ name: 'Organic Chemistry', mastery: 'proficient', score: 80, attempts: 6, weakPoints: '' },{ name: 'Chemical Equilibrium', mastery: 'developing', score: 58, attempts: 4, weakPoints: 'Le Chatelier calculations' },{ name: 'Electrochemistry', mastery: 'struggling', score: 30, attempts: 5, weakPoints: 'Cell notation, Nernst equation' },{ name: 'Periodic Table Trends', mastery: 'mastered', score: 90, attempts: 3, weakPoints: '' }]},
    { subject: 'English', topics: [{ name: 'Essay Writing', mastery: 'proficient', score: 76, attempts: 8, weakPoints: '' },{ name: 'Comprehension', mastery: 'mastered', score: 85, attempts: 6, weakPoints: '' },{ name: 'Summary Writing', mastery: 'developing', score: 60, attempts: 4, weakPoints: 'Conciseness, key point selection' },{ name: 'Grammar', mastery: 'mastered', score: 92, attempts: 5, weakPoints: '' }]},
    { subject: 'History', topics: [{ name: 'Colonial Africa', mastery: 'proficient', score: 74, attempts: 4, weakPoints: '' },{ name: 'Independence Movements', mastery: 'developing', score: 55, attempts: 3, weakPoints: 'Timeline accuracy' },{ name: 'Post-Colonial Uganda', mastery: 'struggling', score: 38, attempts: 5, weakPoints: 'Political parties, constitution changes' },{ name: 'East African Integration', mastery: 'not_started', score: 0, attempts: 0, weakPoints: '' }]},
  ];
  const currentSubject = subjectMastery.find(s => s.subject === selectedSubject) || subjectMastery[0];
  const topics = currentSubject.topics;
  const masteryCounts = { mastered: topics.filter(t => t.mastery === 'mastered').length, proficient: topics.filter(t => t.mastery === 'proficient').length, developing: topics.filter(t => t.mastery === 'developing').length, struggling: topics.filter(t => t.mastery === 'struggling').length, not_started: topics.filter(t => t.mastery === 'not_started').length };
  const overallProgress = topics.length > 0 ? Math.round(((masteryCounts.mastered * 100 + masteryCounts.proficient * 75 + masteryCounts.developing * 50 + masteryCounts.struggling * 25) / (topics.length * 100)) * 100) : 0;
  const strugglingTopics = topics.filter(t => t.mastery === 'struggling' || t.mastery === 'developing');
  const weakPointsList = strugglingTopics.filter(t => t.weakPoints).flatMap(t => t.weakPoints.split(', ').map(wp => ({ topic: t.name, point: wp })));
  const masteryColor = (level: string) => { switch (level) { case 'mastered': return 'bg-emerald-600 text-white'; case 'proficient': return 'bg-brand text-white'; case 'developing': return 'bg-amber-500 text-white'; case 'struggling': return 'bg-red-500 text-white'; default: return 'bg-slate-200 text-slate-600'; } };
  const masteryBarColor = (level: string) => { switch (level) { case 'mastered': return 'bg-emerald-600'; case 'proficient': return 'bg-brand'; case 'developing': return 'bg-amber-500'; case 'struggling': return 'bg-red-500'; default: return 'bg-slate-200'; } };
  const masteryLabel = (level: string) => { switch (level) { case 'mastered': return 'Mastered'; case 'proficient': return 'Proficient'; case 'developing': return 'Developing'; case 'struggling': return 'Struggling'; default: return 'Not Started'; } };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-brand">My Progress</h2><p className="text-slate-500 text-sm mt-1">Track your mastery across every topic</p></div>
      <div className="flex flex-wrap gap-2">{subjectMastery.map(s => (<button key={s.subject} onClick={() => setSelectedSubject(s.subject)} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${selectedSubject === s.subject ? 'bg-brand text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{s.subject}</button>))}</div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4"><div><h3 className="font-bold text-brand">{selectedSubject} - Overall Mastery</h3><p className="text-sm text-slate-500">{topics.length} topics &middot; {masteryCounts.mastered} mastered</p></div><div className="text-right"><p className="text-3xl font-bold text-brand">{overallProgress}%</p><p className="text-xs text-slate-500">overall progress</p></div></div>
        <div className="w-full bg-slate-100 rounded-full h-3 mb-4"><div className="h-3 rounded-full bg-brand transition-all" style={{ width: `${overallProgress}%` }} /></div>
        <div className="flex gap-4 flex-wrap">{Object.entries(masteryCounts).map(([level, count]) => count > 0 && (<div key={level} className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded-full ${masteryBarColor(level)}`} /><span className="text-xs text-slate-600">{masteryLabel(level)}: {count}</span></div>))}</div>
      </div>
      {weakPointsList.length > 0 && (<div className="bg-red-50 border border-red-200 rounded-xl p-5"><div className="flex items-center gap-2 mb-3"><AlertTriangle size={18} className="text-red-600" /><h3 className="font-bold text-red-900">Areas Needing Attention</h3></div><p className="text-sm text-red-700 mb-3">Focus here first:</p><div className="space-y-2">{weakPointsList.map((wp, i) => (<div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-red-100"><div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0"><Target size={14} className="text-white" /></div><div><p className="text-sm font-medium text-brand">{wp.point}</p><p className="text-xs text-slate-500">Topic: {wp.topic}</p></div></div>))}</div></div>)}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"><h3 className="font-bold text-brand mb-4">Topic Breakdown</h3><div className="space-y-3">{topics.map(topic => (<div key={topic.name} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition"><div className="flex items-center justify-between mb-2"><h4 className="font-semibold text-brand text-sm">{topic.name}</h4><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${masteryColor(topic.mastery)}`}>{masteryLabel(topic.mastery)}</span></div><div className="w-full bg-slate-100 rounded-full h-2 mb-2"><div className={`h-2 rounded-full transition-all ${masteryBarColor(topic.mastery)}`} style={{ width: `${topic.score}%` }} /></div><div className="flex items-center justify-between text-xs text-slate-500"><span>Score: {topic.score}%</span><span>{topic.attempts} practice attempts</span></div>{topic.weakPoints && <div className="mt-2 flex items-start gap-1.5"><AlertTriangle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" /><p className="text-xs text-amber-700">Weak points: {topic.weakPoints}</p></div>}</div>))}</div></div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"><div className="flex items-center gap-2 mb-4"><TrendingUp size={18} className="text-emerald-600" /><h3 className="font-bold text-brand">How Success is Measured</h3></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[{ level: 'Mastered', desc: 'Score 85%+ with consistent performance.', color: 'bg-emerald-600' },{ level: 'Proficient', desc: 'Score 70-84%. Apply concepts independently.', color: 'bg-brand' },{ level: 'Developing', desc: 'Score 40-69%. Need more practice.', color: 'bg-amber-500' },{ level: 'Struggling', desc: 'Below 40%. Use AI Tutor for help.', color: 'bg-red-500' }].map(item => (<div key={item.level} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100"><div className={`w-3 h-3 rounded-full ${item.color} mt-1 flex-shrink-0`} /><div><p className="font-semibold text-brand text-sm">{item.level}</p><p className="text-xs text-slate-500 mt-0.5">{item.desc}</p></div></div>))}</div></div>
    </div>
  );
}

function AITutorTab() {
  const [question, setQuestion] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [conversations, setConversations] = useState<{ id: string; subject: string; question: string; answer: string; created_at: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ subject: string; question: string }[]>([]);
  const [error, setError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const subjects = ['Mathematics', 'Physics', 'Biology', 'Chemistry', 'English', 'History', 'Geography', 'Social Studies', 'Computer Studies', 'Agriculture', 'Business Studies'];
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  useEffect(() => { loadConversations(); loadSuggestions(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversations]);
  const getAuthHeaders = () => ({ 'Authorization': `Bearer ${supabaseAnonKey}`, 'Content-Type': 'application/json', 'apikey': supabaseAnonKey });
  const loadConversations = async () => { try { const res = await fetch(`${supabaseUrl}/functions/v1/ai-tutor/conversations?limit=20`, { headers: getAuthHeaders() }); if (res.ok) { const data = await res.json(); setConversations(data.conversations || []); } } catch { /* empty */ } };
  const loadSuggestions = async () => { try { const res = await fetch(`${supabaseUrl}/functions/v1/ai-tutor/suggestions`, { headers: getAuthHeaders() }); if (res.ok) { const data = await res.json(); setSuggestions(data.suggestions || getDefaultSuggestions()); } } catch { setSuggestions(getDefaultSuggestions()); } };
  const getDefaultSuggestions = () => [{ subject: 'Mathematics', question: 'How do I solve quadratic equations step by step?' },{ subject: 'Physics', question: "Explain Newton's three laws of motion" },{ subject: 'Biology', question: 'Difference between mitosis and meiosis?' },{ subject: 'Chemistry', question: 'How do I balance chemical equations?' },{ subject: 'English', question: 'How do I write a good argumentative essay?' }];
  const askQuestion = async (q?: string, subj?: string) => { const text = q || question.trim(); const subject = subj || selectedSubject; if (!text) return; setIsLoading(true); setError(''); setQuestion(''); const optimisticConvo = { id: `temp-${Date.now()}`, subject, question: text, answer: '', created_at: new Date().toISOString() }; setConversations(prev => [...prev, optimisticConvo]); try { const res = await fetch(`${supabaseUrl}/functions/v1/ai-tutor/ask`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ question: text, subject }) }); const data = await res.json(); if (!res.ok) { setError(data.error || 'Failed to get response'); setConversations(prev => prev.filter(c => c.id !== optimisticConvo.id)); return; } setConversations(prev => prev.map(c => c.id === optimisticConvo.id ? { ...c, answer: data.answer, id: data.id || c.id } : c)); } catch { setError('Network error.'); setConversations(prev => prev.filter(c => c.id !== optimisticConvo.id)); } finally { setIsLoading(false); } };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askQuestion(); } };
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-brand">AI Tutor</h2><p className="text-slate-500 text-sm mt-1">Ask any question and get step-by-step help</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"><div className="flex items-center gap-2 mb-3"><Sparkles size={16} className="text-amber-500" /><h3 className="font-bold text-brand text-sm">Choose a Subject</h3></div><div className="flex flex-wrap gap-2">{subjects.map(s => (<button key={s} onClick={() => setSelectedSubject(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${selectedSubject === s ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{s}</button>))}</div></div>
      {conversations.length === 0 && suggestions.length > 0 && (<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"><h3 className="font-bold text-brand text-sm mb-3 flex items-center gap-2"><Sparkles size={16} className="text-amber-500" />Suggested Questions</h3><div className="space-y-2">{suggestions.map((s, i) => (<button key={i} onClick={() => { setSelectedSubject(s.subject); askQuestion(s.question, s.subject); }} className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"><span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">{s.subject}</span><p className="text-sm text-slate-700 mt-1">{s.question}</p></button>))}</div></div>)}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><div className="p-4 border-b border-slate-200 flex items-center justify-between"><div className="flex items-center gap-2"><Bot size={18} className="text-brand" /><h3 className="font-bold text-brand text-sm">Chat with AI Tutor</h3></div><span className="text-[10px] text-slate-400">20 questions/day</span></div><div className="h-96 overflow-y-auto p-4 space-y-4 bg-white">{conversations.length === 0 && !isLoading && (<div className="text-center py-12"><Bot size={40} className="text-slate-300 mx-auto mb-3" /><p className="text-slate-500 text-sm">Ask me anything!</p></div>)}{conversations.map(c => (<div key={c.id}><div className="flex justify-end"><div className="bg-brand text-white rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%]"><p className="text-sm">{c.question}</p><p className="text-[10px] text-slate-300 mt-1">{c.subject} &middot; {formatTime(c.created_at)}</p></div></div>{c.answer ? (<div className="flex justify-start mt-2"><div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[80%]"><div className="flex items-center gap-1.5 mb-1.5"><Bot size={14} className="text-brand" /><span className="text-[10px] font-medium text-brand">AI Tutor</span></div><div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{c.answer}</div></div></div>) : (<div className="flex justify-start mt-2"><div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3"><div className="flex items-center gap-2"><Loader2 size={14} className="text-brand animate-spin" /><span className="text-xs text-slate-500">Thinking...</span></div></div></div>)}</div>))}<div ref={chatEndRef} /></div><div className="p-4 border-t border-slate-200 bg-white">{error && <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg"><p className="text-xs text-red-600">{error}</p></div>}<div className="flex gap-2"><input type="text" value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={handleKeyDown} placeholder={`Ask about ${selectedSubject}...`} disabled={isLoading} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-sm disabled:opacity-50" /><button onClick={() => askQuestion()} disabled={isLoading || !question.trim()} className="px-4 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">{isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}</button></div></div></div>
    </div>
  );
}

function SpeakToTutorTab() {
  const [selectedTutor, setSelectedTutor] = useState<number | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tutors = [
    { id: 1, name: 'Mr. Okello James', subject: 'Mathematics', available: true, rating: 4.8, sessions: 156 },
    { id: 2, name: 'Ms. Nakamya Grace', subject: 'Physics', available: true, rating: 4.9, sessions: 98 },
    { id: 3, name: 'Dr. Mugisha Peter', subject: 'Biology', available: false, rating: 4.7, sessions: 210 },
    { id: 4, name: 'Mrs. Achieng Ruth', subject: 'Chemistry', available: true, rating: 4.6, sessions: 134 },
    { id: 5, name: 'Mr. Ssewankambo D.', subject: 'English', available: true, rating: 4.8, sessions: 89 },
  ];

  const startCall = (tutorId: number) => {
    setSelectedTutor(tutorId);
    setCallStatus('ringing');
    setTimeout(() => {
      setCallStatus('connected');
      setCallDuration(0);
      timerRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    }, 2000);
  };

  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCallStatus('ended');
    setTimeout(() => { setCallStatus('idle'); setSelectedTutor(null); setCallDuration(0); }, 2000);
  };

  const formatDuration = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const currentTutor = tutors.find(t => t.id === selectedTutor);

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-brand">Speak to a Tutor</h2><p className="text-slate-500 text-sm mt-1">Connect with your teachers for live voice support</p></div>

      {callStatus !== 'idle' && currentTutor && (
        <div className="bg-brand rounded-2xl p-8 text-white text-center">
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold">{currentTutor.name[0]}</span>
          </div>
          <h3 className="text-xl font-bold">{currentTutor.name}</h3>
          <p className="text-slate-400 text-sm mt-1">{currentTutor.subject}</p>
          {callStatus === 'ringing' && <div className="mt-4"><div className="w-4 h-4 bg-slate-500 rounded-full animate-pulse mx-auto" /><p className="text-slate-400 text-sm mt-2">Calling...</p></div>}
          {callStatus === 'connected' && <div className="mt-4"><p className="text-2xl font-mono font-bold text-emerald-400">{formatDuration(callDuration)}</p><p className="text-emerald-400 text-xs mt-1">Connected</p></div>}
          {callStatus === 'ended' && <div className="mt-4"><p className="text-slate-400">Call ended - {formatDuration(callDuration)}</p></div>}
          {(callStatus === 'ringing' || callStatus === 'connected') && (
            <button onClick={endCall} className="mt-6 w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center mx-auto transition"><span className="w-6 h-6 bg-white rounded-full" /></button>
          )}
        </div>
      )}

      {callStatus === 'idle' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutors.map(tutor => (
            <div key={tutor.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center"><span className="font-bold text-slate-700">{tutor.name[0]}</span></div>
                <div className="flex-1"><p className="font-semibold text-brand text-sm">{tutor.name}</p><p className="text-xs text-slate-500">{tutor.subject}</p></div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tutor.available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{tutor.available ? 'Online' : 'Offline'}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                <span>{tutor.rating} rating</span><span>{tutor.sessions} sessions</span>
              </div>
              <button onClick={() => startCall(tutor.id)} disabled={!tutor.available} className={`w-full py-2 rounded-lg text-sm font-medium transition ${tutor.available ? 'bg-brand text-white hover:bg-brand-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                {tutor.available ? 'Call Now' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AskTeacherTab() {
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState<{ id: number; subject: string; question: string; urgency: string; status: string; time: string }[]>([
    { id: 1, subject: 'Mathematics', question: 'How do I know when to use the quadratic formula vs completing the square?', urgency: 'normal', status: 'answered', time: '2 hrs ago' },
    { id: 2, subject: 'Physics', question: 'Can you explain the difference between weight and mass with a practical example?', urgency: 'normal', status: 'pending', time: '30 min ago' },
  ]);

  const handleSubmit = () => {
    if (!question.trim() || !subject) return;
    setRequests(prev => [{ id: Date.now(), subject, question, urgency, status: 'pending', time: 'Just now' }, ...prev]);
    setQuestion('');
    setSubject('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-brand">Ask a Teacher</h2><p className="text-slate-500 text-sm mt-1">Submit questions and get help from your teachers</p></div>

      {submitted && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm font-medium">Question submitted! Your teacher will respond soon.</div>}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-brand mb-4">Submit a Question</h3>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Subject</label><select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm"><option value="">Select subject</option><option>Mathematics</option><option>Physics</option><option>Biology</option><option>Chemistry</option><option>English</option><option>History</option></select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Your Question</label><textarea rows={4} value={question} onChange={e => setQuestion(e.target.value)} placeholder="Describe what you need help with..." className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-brand focus:border-transparent outline-none" /></div>
          <div className="flex gap-3">
            <button onClick={() => setUrgency('normal')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${urgency === 'normal' ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600'}`}>Normal</button>
            <button onClick={() => setUrgency('urgent')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${urgency === 'urgent' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Urgent</button>
          </div>
          <button onClick={handleSubmit} disabled={!question.trim() || !subject} className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed">Submit Question</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-brand mb-4">My Questions</h3>
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="border border-slate-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">{r.subject}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${r.status === 'answered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{r.status}</span>
              </div>
              <p className="text-sm text-brand mt-1">{r.question}</p>
              <p className="text-xs text-slate-400 mt-1">{r.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssistedLearningTab() {
  const [ttsActive, setTtsActive] = useState(false);
  const [sttActive, setSttActive] = useState(false);
  const [sttText, setSttText] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [ttsText, setTtsText] = useState('');
  const [ttsReading, setTtsReading] = useState(false);
  const [sttListening, setSttListening] = useState(false);
  const [signLangActive, setSignLangActive] = useState(false);
  const [signLangInput, setSignLangInput] = useState('');

  const features = [
    { id: 'tts', title: 'Text-to-Speech', desc: 'Have any text read aloud. Paste content or type text and press play.', icon: <Volume2 size={20} />, active: ttsActive, toggle: () => setTtsActive(!ttsActive) },
    { id: 'stt', title: 'Speech-to-Text', desc: 'Dictate your answers and notes instead of typing. Speak naturally.', icon: <Mic size={20} />, active: sttActive, toggle: () => setSttActive(!sttActive) },
    { id: 'signlang', title: 'Sign Language Support', desc: 'View sign language illustrations for common academic terms and phrases.', icon: <Hand size={20} />, active: signLangActive, toggle: () => setSignLangActive(!signLangActive) },
    { id: 'dyslexia', title: 'Dyslexia-Friendly Mode', desc: 'OpenDyslexic font, wider letter spacing, and line height for easier reading.', icon: <BookOpen size={20} />, active: dyslexiaFont, toggle: () => setDyslexiaFont(!dyslexiaFont) },
    { id: 'contrast', title: 'High Contrast Mode', desc: 'Increase contrast between text and background for low vision support.', icon: <Eye size={20} />, active: highContrast, toggle: () => setHighContrast(!highContrast) },
    { id: 'largetext', title: 'Large Text Mode', desc: 'Enlarge all text across the platform for easier readability.', icon: <Type size={20} />, active: largeText, toggle: () => setLargeText(!largeText) },
    { id: 'focus', title: 'Focus Mode', desc: 'Reduce distractions by dimming everything except the active content area.', icon: <Target size={20} />, active: focusMode, toggle: () => setFocusMode(!focusMode) },
  ];

  const handleTtsRead = () => {
    if (!ttsText.trim()) return;
    setTtsReading(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(ttsText);
      utterance.rate = 0.9;
      utterance.onend = () => setTtsReading(false);
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setTtsReading(false), 3000);
    }
  };

  const handleSttStart = () => {
    setSttListening(true);
    setSttText('');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
        setSttText(transcript);
      };
      recognition.onerror = () => setSttListening(false);
      recognition.onend = () => setSttListening(false);
      recognition.start();
    } else {
      setTimeout(() => { setSttText('Speech recognition not available in this browser. Try Chrome.'); setSttListening(false); }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-brand">Assisted Learning</h2><p className="text-slate-500 text-sm mt-1">Accessibility tools to support every learner's needs</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(f => (
          <div key={f.id} className={`bg-white rounded-xl border p-5 transition ${f.active ? 'border-brand shadow-sm' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700">{f.icon}</div>
              <button onClick={f.toggle} className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${f.active ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {f.active ? 'Active' : 'Enable'}
              </button>
            </div>
            <h3 className="font-bold text-brand text-sm">{f.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      {ttsActive && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-bold text-brand mb-3">Text-to-Speech Reader</h3>
          <textarea rows={4} value={ttsText} onChange={e => setTtsText(e.target.value)} placeholder="Paste or type any text here to have it read aloud..." className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-brand focus:border-transparent outline-none mb-3" />
          <div className="flex items-center gap-3">
            <button onClick={handleTtsRead} disabled={ttsReading || !ttsText.trim()} className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition disabled:opacity-50 flex items-center gap-2">
              {ttsReading ? <><Loader2 size={14} className="animate-spin" /> Reading...</> : <><Play size={14} /> Read Aloud</>}
            </button>
            <button onClick={() => { speechSynthesis.cancel(); setTtsReading(false); }} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition">Stop</button>
          </div>
        </div>
      )}

      {sttActive && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-bold text-brand mb-3">Speech-to-Text Dictation</h3>
          <div className="mb-3">
            <button onClick={handleSttStart} disabled={sttListening} className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center gap-2 ${sttListening ? 'bg-red-600 text-white' : 'bg-brand text-white hover:bg-brand-600'}`}>
              <Mic size={14} /> {sttListening ? 'Listening...' : 'Start Dictation'}
            </button>
          </div>
          {sttText && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-brand">{sttText}</p>
            </div>
          )}
          {sttListening && <p className="text-xs text-slate-400 mt-2">Speak now. Your words will appear above.</p>}
        </div>
      )}

      {signLangActive && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-bold text-brand mb-3">Sign Language Support</h3>
          <p className="text-sm text-slate-500 mb-4">View sign language illustrations for common academic terms. Type a word or phrase to see the corresponding sign.</p>
          <div className="flex gap-2 mb-4">
            <input type="text" value={signLangInput} onChange={e => setSignLangInput(e.target.value)} placeholder="Type a word (e.g. hello, thank you, help...)" className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { word: 'Hello', desc: 'Wave hand with palm facing forward', category: 'Greetings' },
              { word: 'Thank You', desc: 'Touch chin with fingertips, move hand forward', category: 'Greetings' },
              { word: 'Help', desc: 'Fist on open palm, lift upward', category: 'Common' },
              { word: 'Please', desc: 'Circular motion on chest with flat hand', category: 'Common' },
              { word: 'Yes', desc: 'Nod fist up and down', category: 'Common' },
              { word: 'No', desc: 'Index and middle finger snap to thumb', category: 'Common' },
              { word: 'Learn', desc: 'Place hand on forehead, then on palm', category: 'Academic' },
              { word: 'Read', desc: 'V-shape hand moves down page', category: 'Academic' },
              { word: 'Write', desc: 'Mime writing on palm', category: 'Academic' },
              { word: 'Question', desc: 'Index finger circles and lands on palm', category: 'Academic' },
              { word: 'Understand', desc: 'Point to forehead, then point forward', category: 'Academic' },
              { word: 'Teacher', desc: 'Both hands flat, move outward from forehead', category: 'Academic' },
            ].filter(s => !signLangInput || s.word.toLowerCase().includes(signLangInput.toLowerCase()) || s.category.toLowerCase().includes(signLangInput.toLowerCase())).map(s => (
              <div key={s.word} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Hand size={18} className="text-slate-600" />
                </div>
                <p className="font-semibold text-brand text-sm text-center">{s.word}</p>
                <p className="text-[10px] text-slate-500 text-center mt-1">{s.desc}</p>
                <span className="text-[9px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded mt-1 block text-center">{s.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {focusMode && (
        <div className="bg-brand text-white rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">Focus Mode Active</h3>
          <p className="text-slate-300 text-sm">All distractions are hidden. Only this content is visible. Take your time.</p>
          <button onClick={() => setFocusMode(false)} className="mt-4 px-4 py-2 bg-white text-brand text-sm font-medium rounded-lg hover:bg-slate-100 transition">Exit Focus Mode</button>
        </div>
      )}
    </div>
  );
}

function LifelongLearningTab() {
  const { user } = useAuth();
  const level = user?.education_level || 'secondary';

  const resourcesByLevel: Record<string, { category: string; items: { title: string; desc: string; type: string; duration: string }[] }[]> = {
    primary: [
      { category: 'Life Skills', items: [
        { title: 'Good Manners & Etiquette', desc: 'Learn respect, kindness, and how to interact with others', type: 'Fun Activities', duration: '1 hr' },
        { title: 'Safety at Home & School', desc: 'Road safety, fire safety, and staying safe online', type: 'Interactive', duration: '1.5 hrs' },
        { title: 'Saving & Money Basics', desc: 'Learn about saving money and making smart choices', type: 'Workshop', duration: '45 min' },
      ]},
      { category: 'Creativity & Hobbies', items: [
        { title: 'Art & Drawing Club', desc: 'Express yourself through drawing, painting, and crafts', type: 'Self-paced', duration: '2 hrs' },
        { title: 'Music & Dance', desc: 'Explore traditional Ugandan music and dance', type: 'Workshop', duration: '1 hr' },
      ]},
      { category: 'Growing Up', items: [
        { title: 'My Body & Health', desc: 'Understanding your body, hygiene, and staying healthy', type: 'Self-paced', duration: '1 hr' },
        { title: 'Environmental Care', desc: 'How to protect our environment and keep Uganda green', type: 'Interactive', duration: '45 min' },
      ]},
    ],
    secondary: [
      { category: 'Professional Skills', items: [
        { title: 'Digital Literacy Fundamentals', desc: 'Computer basics, internet safety, and productivity tools', type: 'Self-paced', duration: '4 hrs' },
        { title: 'Financial Literacy', desc: 'Personal budgeting, savings, and basic economics', type: 'Workshop', duration: '2 hrs' },
        { title: 'Communication Skills', desc: 'Public speaking, writing, and professional communication', type: 'Self-paced', duration: '6 hrs' },
      ]},
      { category: 'Career Development', items: [
        { title: 'Career Planning Guide', desc: 'Identify strengths, set goals, and plan your career path', type: 'Mentorship', duration: '3 sessions' },
        { title: 'Entrepreneurship Basics', desc: 'Starting a small business in Uganda - practical steps', type: 'Workshop', duration: '8 hrs' },
      ]},
      { category: 'Personal Growth', items: [
        { title: 'Critical Thinking', desc: 'Analytical skills for academic and everyday problem-solving', type: 'Self-paced', duration: '3 hrs' },
        { title: 'Health & Wellbeing', desc: 'Mental health awareness, stress management, and healthy habits', type: 'Workshop', duration: '2 hrs' },
      ]},
    ],
    university: [
      { category: 'Career Readiness', items: [
        { title: 'CV Writing & Interview Skills', desc: 'Craft a professional CV and ace your interviews', type: 'Workshop', duration: '3 hrs' },
        { title: 'Professional Networking', desc: 'Build meaningful professional connections on LinkedIn and beyond', type: 'Self-paced', duration: '2 hrs' },
        { title: 'Industry Mentorship Program', desc: 'Get matched with professionals in your field of study', type: 'Mentorship', duration: '6 sessions' },
      ]},
      { category: 'Research & Innovation', items: [
        { title: 'Research Grant Writing', desc: 'How to write winning research proposals and grants', type: 'Workshop', duration: '4 hrs' },
        { title: 'Innovation & Startup Lab', desc: 'Turn your ideas into viable businesses with guidance', type: 'Incubator', duration: '12 weeks' },
      ]},
      { category: 'Leadership', items: [
        { title: 'Student Leadership Program', desc: 'Develop leadership skills for guild and academic roles', type: 'Mentorship', duration: '8 sessions' },
        { title: 'Community Impact Projects', desc: 'Design and implement projects that benefit your community', type: 'Project-based', duration: 'Ongoing' },
      ]},
    ],
    tertiary: [
      { category: 'Technical Skills', items: [
        { title: 'Industry Certification Prep', desc: 'Prepare for professional certifications in your technical field', type: 'Self-paced', duration: '20 hrs' },
        { title: 'Workplace Safety & Compliance', desc: 'OSHA standards and workplace safety best practices', type: 'Workshop', duration: '4 hrs' },
      ]},
      { category: 'Business Skills', items: [
        { title: 'Project Management Basics', desc: 'Plan, execute, and close projects effectively', type: 'Self-paced', duration: '6 hrs' },
        { title: 'Freelancing & Contract Work', desc: 'How to find and manage freelance opportunities in Uganda', type: 'Workshop', duration: '3 hrs' },
      ]},
      { category: 'Career Advancement', items: [
        { title: 'Job Search Strategies', desc: 'Effective job hunting in Uganda\'s competitive market', type: 'Workshop', duration: '2 hrs' },
        { title: 'Professional Portfolio Building', desc: 'Showcase your technical skills and projects', type: 'Self-paced', duration: '4 hrs' },
      ]},
    ],
    vocational: [
      { category: 'Trade Skills', items: [
        { title: 'Apprenticeship Readiness', desc: 'Prepare for and succeed in apprenticeship programs', type: 'Workshop', duration: '3 hrs' },
        { title: 'Tool & Equipment Mastery', desc: 'Advanced techniques for your specific trade', type: 'Practical', duration: '8 hrs' },
      ]},
      { category: 'Business & Finance', items: [
        { title: 'Starting Your Own Workshop', desc: 'How to set up and run your own trade business', type: 'Workshop', duration: '6 hrs' },
        { title: 'Basic Bookkeeping', desc: 'Track income, expenses, and grow your trade business', type: 'Self-paced', duration: '3 hrs' },
      ]},
      { category: 'Safety & Standards', items: [
        { title: 'Workplace Safety Certification', desc: 'Essential safety practices for your trade', type: 'Certification', duration: '4 hrs' },
        { title: 'Quality Standards & Best Practices', desc: 'Meet Uganda Bureau of Standards requirements', type: 'Workshop', duration: '2 hrs' },
      ]},
    ],
  };

  const resources = resourcesByLevel[level] || resourcesByLevel.secondary;
  const levelLabels: Record<string, string> = { primary: 'Primary School', secondary: 'Secondary School', university: 'University', tertiary: 'Tertiary College', vocational: 'Vocational' };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-brand">Lifelong Learning</h2><p className="text-slate-500 text-sm mt-1">Skills and knowledge beyond the classroom - {levelLabels[level] || 'Secondary School'}</p></div>
      {resources.map(group => (
        <div key={group.category}>
          <h3 className="font-bold text-brand mb-3">{group.category}</h3>
          <div className="space-y-3">
            {group.items.map(item => (
              <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-brand text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded">{item.type}</span>
                    <span>{item.duration}</span>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-brand text-white text-xs font-medium rounded-lg hover:bg-brand-600 transition flex-shrink-0 ml-4">Enroll</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WhiteboardTab() {
  const [boards] = useState([
    { id: 1, title: 'Math Problem Solving', lastEdited: '2 hrs ago', shared: true },
    { id: 2, title: 'Physics Diagrams', lastEdited: 'Yesterday', shared: false },
    { id: 3, title: 'Group Study Notes', lastEdited: '3 days ago', shared: true },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-brand">Whiteboard</h2><p className="text-slate-500 text-sm mt-1">Collaborative whiteboard powered by Microsoft Whiteboard</p></div>
        <a href="https://whiteboard.microsoft.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition">Open Microsoft Whiteboard</a>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-brand mb-2">Microsoft Whiteboard Integration</h3>
        <p className="text-sm text-slate-500 mb-4">Use Microsoft Whiteboard for real-time collaboration with your classmates and teachers. Draw, add sticky notes, insert images, and work together on problems.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { title: 'Infinite Canvas', desc: 'Unlimited space to draw and brainstorm' },
            { title: 'Real-time Collaboration', desc: 'Work together with classmates live' },
            { title: 'Smart Ink', desc: 'AI converts handwriting to shapes and text' },
          ].map(f => (
            <div key={f.title} className="p-3 bg-slate-50 rounded-lg">
              <p className="font-medium text-brand text-sm">{f.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-brand mb-4">My Recent Whiteboards</h3>
        <div className="space-y-3">
          {boards.map(b => (
            <div key={b.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center"><PenTool size={18} className="text-slate-600" /></div>
                <div>
                  <p className="font-medium text-brand text-sm">{b.title}</p>
                  <p className="text-xs text-slate-400">Last edited {b.lastEdited}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {b.shared && <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">Shared</span>}
                <a href="https://whiteboard.microsoft.com/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-brand text-white text-xs font-medium rounded-lg hover:bg-brand-600 transition">Open</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommunitiesTab({ onOpenChat }: { onOpenChat: (c: typeof COMMUNITIES[0]) => void }) {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupSubject, setGroupSubject] = useState('');
  const [createdToast, setCreatedToast] = useState('');

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    setCreatedToast(`"${groupName}" created successfully!`);
    setGroupName('');
    setGroupSubject('');
    setShowCreateGroup(false);
    setTimeout(() => setCreatedToast(''), 2500);
  };

  return (
    <div className="space-y-6">
      {createdToast && <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} /> {createdToast}</div>}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand">Communities</h2>
        <button onClick={() => setShowCreateGroup(true)} className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition">Create Group</button>
      </div>

      {showCreateGroup && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-brand mb-4">Create New Group</h3>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Group Name</label><input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="e.g. UACE Chemistry Revision" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Subject</label><select value={groupSubject} onChange={e => setGroupSubject(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm"><option value="">Select subject</option><option>Mathematics</option><option>Physics</option><option>Biology</option><option>Chemistry</option><option>English</option><option>All Subjects</option></select></div>
            <div className="flex gap-2"><button onClick={handleCreateGroup} className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition">Create</button><button onClick={() => setShowCreateGroup(false)} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition">Cancel</button></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COMMUNITIES.map(community => (
          <div key={community.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center flex-shrink-0"><Users size={22} className="text-white" /></div>
                <div>
                  <h3 className="font-semibold text-brand">{community.name}</h3>
                  <p className="text-sm text-slate-500">{community.subject}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400"><span className="flex items-center gap-1"><Users size={12} /> {community.members} members</span><span className="flex items-center gap-1"><Clock size={12} /> {community.lastActive}</span></div>
                </div>
              </div>
              {community.unread > 0 && <span className="w-6 h-6 bg-brand rounded-full text-[11px] text-white flex items-center justify-center font-bold">{community.unread}</span>}
            </div>
            <button onClick={() => onOpenChat(community)} className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium text-brand hover:bg-slate-50 py-2 rounded-lg transition">Open Chat <ChevronRight size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
