import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  ClipboardCheck, 
  LifeBuoy, 
  Landmark, 
  Search, 
  RotateCcw, 
  AlertTriangle,
  Clock,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  onOpenTrackModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTrackModal }) => {
  const { 
    role, 
    setRole, 
    currentUser, 
    sessionInfo, 
    complaints, 
    resetAllData 
  } = useApp();

  const [searchCode, setSearchCode] = useState('');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Count active urgent / breached complaints
  const breachedCount = complaints.filter(c => c.isSlaBreached && c.status !== 'resolved' && c.status !== 'closed').length;
  const urgentCount = complaints.filter(c => c.priority === 'urgent' && c.status !== 'resolved' && c.status !== 'closed').length;

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
      title: 'Complaint Resolution Officer',
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

  return (
    <header className="bg-[#12332F] border-b border-[#1A433E] sticky top-0 z-40 shadow-sm text-[#FBF9F4]">
      {/* Institutional Top Bar */}
      <div className="bg-[#0D2623] text-[#EFF3F1]/80 text-xs py-1.5 px-4 sm:px-6 border-b border-[#163C37]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E7A33E] animate-pulse" />
            <span className="font-medium tracking-wide text-[#FBF9F4] uppercase text-[11px]">
              Apex University Quality Assurance System
            </span>
            <span className="text-[#1A433E] hidden sm:inline">•</span>
            <span className="text-[#EFF3F1]/70 hidden sm:inline">{sessionInfo.session}</span>
            <span className="text-[#1A433E] hidden md:inline">|</span>
            <span className="text-[#E7A33E] font-medium hidden md:inline">{sessionInfo.semester} (Week {sessionInfo.week})</span>
          </div>

          <div className="flex items-center gap-3 text-[#EFF3F1]/80">
            {breachedCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[#FBF9F4] font-medium bg-[#DC2626]/80 px-2 py-0.5 rounded border border-[#DC2626] text-[11px]">
                <AlertTriangle className="w-3 h-3 text-[#FBF9F4]" />
                <span>{breachedCount} Follow-up Escalation Active</span>
              </span>
            )}
            <button 
              onClick={resetAllData}
              title="Reset sample institutional data"
              className="inline-flex items-center gap-1 hover:text-[#E7A33E] transition-colors cursor-pointer text-[#EFF3F1]/70"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Identity: QAS in Piazzolla 600 with circular checkmark in amber */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center shrink-0">
            <svg 
              viewBox="0 0 36 36" 
              className="w-9 h-9 shrink-0" 
              fill="none"
              aria-label="QAS Logo mark"
            >
              <circle cx="18" cy="18" r="14.5" stroke="#E7A33E" strokeWidth="2.75" fill="none" />
              <path d="M11 18.5L16 23.5L25.5 13" stroke="#E7A33E" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="font-serif text-2xl font-semibold text-[#FBF9F4] tracking-tight leading-none">
                QAS
              </h1>
              <span className="text-[11px] font-sans font-medium text-[#EFF3F1]/80">
                Quality Assurance System
              </span>
            </div>
            <p className="text-[11px] text-[#EFF3F1]/60 font-sans mt-0.5">
              Integrated Feedback, Teaching Evaluation & Complaint Resolution
            </p>
          </div>
        </div>

        {/* Middle & Right Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Track Complaint Button / Search */}
          <button
            onClick={onOpenTrackModal}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#FBF9F4] bg-[#1A433E] hover:bg-[#20504A] border border-[#275B52] rounded-lg transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#E7A33E]" />
            <span>Track Complaint / SLA</span>
            <kbd className="hidden sm:inline bg-[#12332F] px-1.5 py-0.5 rounded text-[10px] text-[#E7A33E] border border-[#275B52] font-mono">
              SRV-#
            </kbd>
          </button>

          {/* Role / Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 bg-[#1A433E] hover:bg-[#20504A] border border-[#275B52] rounded-lg transition-all text-left cursor-pointer"
              id="role-switcher-button"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-8 h-8 rounded-full object-cover border border-[#E7A33E]/50 shadow-xs shrink-0"
              />
              <div className="hidden sm:block leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-[#FBF9F4]">{currentUser.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2F6E5F] text-[#FBF9F4] font-medium uppercase tracking-wide">
                    {role.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-[#EFF3F1]/70 truncate max-w-[180px]">
                  {currentUser.roleTitle}
                </div>
              </div>
              <UserCheck className="w-4 h-4 text-[#E7A33E] ml-1" />
            </button>

            {/* Persona Switcher Dropdown */}
            {roleMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#EFF3F1] text-[#1A2421] rounded-xl shadow-2xl border border-[#CBDAD6] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                id="role-switcher-dropdown"
              >
                <div className="px-3.5 py-2.5 border-b border-[#CBDAD6] mb-1">
                  <div className="font-serif text-sm font-semibold text-[#12332F]">
                    Switch Stakeholder Perspective
                  </div>
                  <div className="text-[11px] text-[#1A2421]/70">
                    Experience institutional quality flows from various roles
                  </div>
                </div>

                <div className="space-y-1 px-1.5">
                  {roleOptions.map((opt) => {
                    const isSelected = role === opt.role;
                    return (
                      <button
                        key={opt.role}
                        onClick={() => {
                          setRole(opt.role);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-[#12332F] text-[#FBF9F4]' 
                            : 'hover:bg-white text-[#1A2421]'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-[#E7A33E] text-[#12332F]' : opt.color}`}>
                          {opt.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-medium ${isSelected ? 'text-[#FBF9F4]' : 'text-[#12332F]'}`}>
                              {opt.label}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] bg-[#E7A33E] text-[#12332F] font-semibold px-1.5 py-0.2 rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className={`text-xs truncate ${isSelected ? 'text-[#EFF3F1]' : 'text-[#1A2421]'}`}>
                            {opt.name}
                          </div>
                          <div className={`text-[11px] truncate ${isSelected ? 'text-[#EFF3F1]/70' : 'text-[#1A2421]/60'}`}>
                            {opt.title}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-[#CBDAD6] px-3.5 text-[11px] text-[#1A2421]/60 flex items-center justify-between">
                  <span>QAS Institutional Governance</span>
                  <span className="font-medium text-[#2F6E5F]">Harmattan 2024/25</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Navigation Bar (Tabs for the active role) */}
      <div className="bg-[#0E2A27] border-t border-[#1A433E] px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#EFF3F1]/80">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#FBF9F4]">Current Scope:</span>
            <span className="bg-[#163E39] border border-[#275B52] px-2 py-0.5 rounded font-medium text-[#FBF9F4]">
              {currentUser.department} ({currentUser.faculty})
            </span>
            <span className="text-[#1A433E] hidden sm:inline">•</span>
            <span className="font-mono text-[#EFF3F1]/70 hidden sm:inline">ID: {currentUser.identifier}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#EFF3F1]/80">
              <Clock className="w-3.5 h-3.5 text-[#E7A33E]" />
              <span>SLA Target: 24h–72h Timely Resolution</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
