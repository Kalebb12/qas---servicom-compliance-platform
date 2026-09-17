import * as React from 'react';
import { useApp } from '../context/AppContext';
import { MainNavItem } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  ShieldAlert,
  Clock
} from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const {
    activeNav,
    setActiveNav,
    role,
    courseEvaluations,
    complaints
  } = useApp();

  const pendingEvalsCount = courseEvaluations.filter((c) => !c.evaluatedByCurrentStudent).length;
  const activeComplaintsCount = complaints.filter((c) => c.status !== 'resolved' && c.status !== 'closed').length;

  const tabs: {
    id: MainNavItem;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />
      },
      {
        id: 'evaluations',
        label: 'Evaluations',
        icon: <BookOpen className="w-5 h-5" />,
        badge: role === 'student' && pendingEvalsCount > 0 ? pendingEvalsCount : undefined
      },
      {
        id: 'lodge',
        label: 'Lodge',
        icon: <ShieldAlert className="w-5 h-5" />
      },
      {
        id: 'track',
        label: 'Track',
        icon: <Clock className="w-5 h-5" />,
        badge: activeComplaintsCount > 0 ? activeComplaintsCount : undefined
      }
    ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#12332F] border-t border-[#1A433E] px-2 py-1 flex items-center justify-around shadow-2xl"
      aria-label="Mobile Bottom Navigation"
    >
      {tabs.map((tab) => {
        const isActive = activeNav === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveNav(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-colors cursor-pointer min-w-[64px] min-h-[44px] relative ${isActive
                ? 'text-[#E7A33E]'
                : 'text-[#EFF3F1]/70 hover:text-[#FBF9F4]'
              }`}
          >
            <div className="relative">
              {tab.icon}
              {tab.badge !== undefined && (
                <span className="absolute -top-1 -right-2 bg-[#E7A33E] text-[#12332F] text-[9px] font-bold px-1 rounded-full min-w-[14px] h-[14px] flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-semibold' : 'font-normal'}`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-[#E7A33E] mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
