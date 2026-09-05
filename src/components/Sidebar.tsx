import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, MainNavItem } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  ShieldAlert, 
  Clock, 
  Bell, 
  Search, 
  X, 
  UserCheck, 
  GraduationCap, 
  ClipboardCheck, 
  LifeBuoy, 
  Landmark, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  onOpenTrackModal: (initialCode?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenTrackModal }) => {
  const { 
    role, 
    setRole, 
    currentUser, 
    activeNav, 
    setActiveNav,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    unreadNotificationsCount,
    setIsNotificationsOpen,
    courseEvaluations,
    complaints,
    resetAllData
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [quickTrackInput, setQuickTrackInput] = useState('');

  // Pending evaluations for student
  const pendingEvalsCount = courseEvaluations.filter(c => !c.studentSubmitted).length;
  // Active complaints count
  const activeComplaintsCount = complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length;

  const roleOptions: { role: UserRole; label: string; name: string; title: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'student',
      label: 'Student Portal',
      name: 'Chinedu Okafor',
      title: 'Undergraduate (CSC 300L)',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'bg-[#2F6E5F]/15 text-[#2F6E5F] border-[#2F6E5F]/30'
    },
    {
      role: 'lecturer',
      label: 'Lecturer Portal',
      name: 'Dr. Miriam Adeleke',
      title: 'Senior Lecturer, Ph.D',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'bg-[#2F6E5F]/15 text-[#2F6E5F] border-[#2F6E5F]/30'
    },
    {
      role: 'qa_officer',
      label: 'QA Inspector',
      name: 'Engr. Bello Ibrahim',
      title: 'Chief Academic Quality Auditor',
      icon: <ClipboardCheck className="w-4 h-4" />,
      color: 'bg-[#12332F]/10 text-[#12332F] border-[#12332F]/20'
    },
    {
      role: 'servicom_officer',
      label: 'SERVICOM Nodal Desk',
      name: 'Mrs. Grace Danladi',
      title: 'Grievance Redress Officer',
      icon: <LifeBuoy className="w-4 h-4" />,
      color: 'bg-[#E7A33E]/20 text-[#1A2421] border-[#E7A33E]/40'
    },
    {
      role: 'leadership',
      label: 'University Leadership',
      name: 'Prof. Olumide Balogun',
      title: 'DVC (Academic & QA Oversight)',
      icon: <Landmark className="w-4 h-4" />,
      color: 'bg-[#12332F] text-[#FBF9F4] border-[#12332F]'
    }
  ];

  const navItems: {
    id: MainNavItem;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeType?: 'amber' | 'teal' | 'neutral';
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />
    },
    {
      id: 'evaluations',
      label: 'Course & Lecturer Evaluation',
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
      badge: role === 'student' && pendingEvalsCount > 0 ? `${pendingEvalsCount} pending` : undefined,
      badgeType: 'amber'
    },
    {
      id: 'lodge',
      label: 'Lodge SERVICOM Grievance',
      icon: <ShieldAlert className="w-4 h-4 shrink-0" />
    },
    {
      id: 'track',
      label: 'Track My Complaints',
      icon: <Clock className="w-4 h-4 shrink-0" />,
      badge: activeComplaintsCount > 0 ? `${activeComplaintsCount}` : undefined,
      badgeType: 'teal'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4 shrink-0" />,
      badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined,
      badgeType: 'amber'
    }
  ];

  const handleNavClick = (id: MainNavItem) => {
    if (id === 'notifications') {
      setIsNotificationsOpen(true);
    } else {
      setActiveNav(id);
    }
    setIsMobileDrawerOpen(false);
  };

  const handleQuickTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTrackInput.trim()) {
      onOpenTrackModal();
    } else {
      onOpenTrackModal(quickTrackInput.trim());
      setQuickTrackInput('');
    }
    setIsMobileDrawerOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#12332F] text-[#FBF9F4] select-none">
      {/* 1. Header: Logo mark + Wordmark */}
      <div className="p-4 sm:p-5 border-b border-[#1A433E] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center shrink-0">
            <svg 
              viewBox="0 0 36 36" 
              className="w-8 h-8 shrink-0" 
              fill="none"
              aria-label="QAS Logo mark"
            >
              <circle cx="18" cy="18" r="14.5" stroke="#E7A33E" strokeWidth="2.75" fill="none" />
              <path d="M11 18.5L16 23.5L25.5 13" stroke="#E7A33E" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl font-semibold text-[#FBF9F4] tracking-tight leading-none">
                QAS
              </span>
              <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-[#E7A33E]">
                Compliance
              </span>
            </div>
            <p className="text-[11px] text-[#EFF3F1]/70 font-sans mt-0.5 leading-tight">
              Quality Assurance & SERVICOM
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {isMobileDrawerOpen && (
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#EFF3F1]/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. Quick Search & Grievance Tracker */}
      <div className="px-3 pt-3 pb-1">
        <form onSubmit={handleQuickTrackSubmit} className="relative">
          <input
            type="text"
            value={quickTrackInput}
            onChange={(e) => setQuickTrackInput(e.target.value)}
            placeholder="Track Grievance (SRV-#)..."
            className="w-full text-xs pl-8 pr-3 py-2 bg-[#0E2A27] border border-[#1A433E] rounded-lg text-[#FBF9F4] placeholder-[#EFF3F1]/40 focus:outline-hidden focus:ring-1 focus:ring-[#E7A33E] focus:border-[#E7A33E] transition-all"
          />
          <Search className="w-3.5 h-3.5 text-[#E7A33E] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </form>
      </div>

      {/* 3. Primary Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="text-[10px] uppercase font-semibold text-[#EFF3F1]/50 tracking-wider px-2 mb-1.5">
          Navigation
        </div>

        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer group ${
                isActive 
                  ? 'bg-[#E7A33E] text-[#12332F] font-semibold shadow-xs' 
                  : 'text-[#EFF3F1]/80 hover:bg-[#1A433E] hover:text-[#FBF9F4]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={isActive ? 'text-[#12332F]' : 'text-[#E7A33E] group-hover:text-[#E7A33E]'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ml-1.5 ${
                  isActive 
                    ? 'bg-[#12332F] text-[#E7A33E]' 
                    : item.badgeType === 'amber'
                    ? 'bg-[#E7A33E]/20 text-[#E7A33E] border border-[#E7A33E]/40'
                    : 'bg-[#2F6E5F]/30 text-[#EFF3F1] border border-[#2F6E5F]/50'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* 4. Academic Scope Folded into Sidebar */}
        <div className="pt-4 mt-4 border-t border-[#1A433E]">
          <div className="p-2.5 rounded-lg bg-[#0E2A27] border border-[#1A433E] text-[11px] text-[#EFF3F1]/70">
            <div className="text-[10px] uppercase font-semibold text-[#E7A33E] tracking-wider mb-1 flex items-center justify-between">
              <span>Academic Scope</span>
              <span className="text-[10px] font-mono text-[#EFF3F1]/60">Harmattan '24/25</span>
            </div>
            <div className="font-medium text-[#FBF9F4] truncate">
              {currentUser.department}
            </div>
            <div className="text-[10px] text-[#EFF3F1]/60 truncate">
              {currentUser.faculty}
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-[#1A433E] font-mono text-[10px] text-[#EFF3F1]/80 flex items-center justify-between">
              <span className="text-[#EFF3F1]/50">Scope ID:</span>
              <span className="text-[#E7A33E]">{currentUser.identifier}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. User Profile Pinned at Bottom */}
      <div className="p-3 border-t border-[#1A433E] bg-[#0D2623] relative">
        <button
          onClick={() => setRoleMenuOpen(!roleMenuOpen)}
          className="w-full flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#163C37] transition-all text-left cursor-pointer group"
          id="sidebar-user-profile-button"
        >
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-8 h-8 rounded-full object-cover border border-[#E7A33E]/60 shadow-xs shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#FBF9F4] truncate">
                {currentUser.name}
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-[#2F6E5F] text-[#FBF9F4] font-medium uppercase shrink-0">
                {role.replace('_', ' ')}
              </span>
            </div>
            <div className="text-[10px] text-[#EFF3F1]/60 truncate">
              {currentUser.roleTitle}
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#EFF3F1]/40 group-hover:text-[#E7A33E] transition-colors shrink-0" />
        </button>

        {/* Stakeholder Role Switcher Dropdown (Upward) */}
        {roleMenuOpen && (
          <div 
            className="absolute bottom-full left-3 right-3 mb-2 bg-[#EFF3F1] text-[#1A2421] rounded-xl shadow-2xl border border-[#CBDAD6] py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
            id="sidebar-role-switcher-dropdown"
          >
            <div className="px-3 py-2 border-b border-[#CBDAD6] mb-1 flex items-center justify-between">
              <div>
                <div className="font-serif text-xs font-semibold text-[#12332F]">
                  Switch Perspective
                </div>
                <div className="text-[10px] text-[#526460]">
                  Institutional governance roles
                </div>
              </div>
              <button 
                onClick={() => setRoleMenuOpen(false)}
                className="text-[#526460] hover:text-[#1A2421] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-0.5 px-1 max-h-60 overflow-y-auto">
              {roleOptions.map((opt) => {
                const isSelected = role === opt.role;
                return (
                  <button
                    key={opt.role}
                    onClick={() => {
                      setRole(opt.role);
                      setRoleMenuOpen(false);
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-[#12332F] text-[#FBF9F4]' 
                        : 'hover:bg-white text-[#1A2421]'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md shrink-0 ${isSelected ? 'bg-[#E7A33E] text-[#12332F]' : opt.color}`}>
                      {opt.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium truncate ${isSelected ? 'text-[#FBF9F4]' : 'text-[#12332F]'}`}>
                          {opt.label}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] bg-[#E7A33E] text-[#12332F] font-semibold px-1 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className={`text-[11px] truncate ${isSelected ? 'text-[#EFF3F1]' : 'text-[#526460]'}`}>
                        {opt.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-1 pt-1.5 border-t border-[#CBDAD6] px-3 text-[10px] text-[#526460] flex items-center justify-between">
              <button 
                onClick={() => {
                  resetAllData();
                  setRoleMenuOpen(false);
                }}
                className="inline-flex items-center gap-1 hover:text-[#B93826] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset Demo Records</span>
              </button>
              <span className="font-mono text-[9px]">v2.5.0</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-[#1A433E] z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
