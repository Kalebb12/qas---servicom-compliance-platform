import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  Search, 
  AlertTriangle, 
  Bell, 
  RotateCcw, 
  X, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface TopBarProps {
  onOpenTrackModal: (code?: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenTrackModal }) => {
  const { 
    sessionInfo, 
    complaints, 
    setIsMobileDrawerOpen,
    unreadNotificationsCount,
    setIsNotificationsOpen,
    resetAllData,
    currentUser,
    role
  } = useApp();

  const [alertExpanded, setAlertExpanded] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Count active urgent / SLA breached complaints
  const breachedComplaints = complaints.filter(
    c => c.isSlaBreached && c.status !== 'resolved' && c.status !== 'closed'
  );
  const breachedCount = breachedComplaints.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onOpenTrackModal(searchInput.trim());
      setSearchInput('');
      setIsSearchExpanded(false);
    } else {
      onOpenTrackModal();
    }
  };

  return (
    <header className="bg-[#12332F] border-b border-[#1A433E] sticky top-0 z-30 text-[#FBF9F4] h-12 flex items-center px-3 sm:px-5">
      <div className="w-full flex items-center justify-between gap-2">
        {/* Left Side: Mobile Hamburger + Institution Name & Week */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Hamburger Menu on Mobile */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="md:hidden p-1.5 -ml-1 text-[#EFF3F1]/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Institution Identity & Academic Week (Condensed single line) */}
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-[#E7A33E] animate-pulse shrink-0 hidden xs:inline-block" />
            <span className="font-medium text-xs text-[#FBF9F4] truncate">
              <span className="hidden sm:inline">Apex University Quality Assurance System</span>
              <span className="sm:hidden">Apex QAS</span>
            </span>
            <span className="text-[#1A433E] hidden md:inline">•</span>
            <span className="text-xs text-[#EFF3F1]/70 hidden md:inline truncate">
              {sessionInfo.session}
            </span>
            <span className="text-[11px] font-medium bg-[#1A433E] text-[#E7A33E] px-2 py-0.5 rounded border border-[#275B52] shrink-0">
              Wk {sessionInfo.week}
            </span>
          </div>
        </div>

        {/* Right Side: Compact Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Compact Expandable Search / Grievance Tracker Icon */}
          <div className="relative">
            {isSearchExpanded ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter SRV-#..."
                  autoFocus
                  className="w-32 sm:w-44 text-xs px-2.5 py-1 bg-[#0E2A27] border border-[#E7A33E] rounded-lg text-[#FBF9F4] placeholder-[#EFF3F1]/50 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="p-1 rounded-lg bg-[#E7A33E] text-[#12332F] text-xs font-semibold px-2 cursor-pointer"
                >
                  Go
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchExpanded(false)}
                  className="p-1 text-[#EFF3F1]/60 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="p-1.5 rounded-lg text-[#EFF3F1]/70 hover:text-[#E7A33E] hover:bg-[#1A433E] transition-colors cursor-pointer"
                title="Search or track grievance code"
                aria-label="Search grievance"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Compact Escalation/Alert Icon-Badge (Expands on Tap) */}
          {breachedCount > 0 && (
            <div className="relative">
              <button
                onClick={() => setAlertExpanded(!alertExpanded)}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#B93826]/20 hover:bg-[#B93826]/30 border border-[#B93826]/40 text-[#FBF9F4] text-xs font-medium transition-colors cursor-pointer"
                title="Active SLA follow-up escalation"
                aria-label="Active escalation alerts"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#B93826] shrink-0" />
                <span className="hidden sm:inline text-[11px] font-semibold">
                  {breachedCount} Escalation
                </span>
                <span className="sm:hidden font-mono text-[11px] font-bold text-[#B93826]">
                  {breachedCount}
                </span>
              </button>

              {/* Alert Expanded Popover */}
              {alertExpanded && (
                <div 
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#EFF3F1] text-[#1A2421] rounded-xl shadow-2xl border border-[#CBDAD6] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  role="region"
                  aria-label="Escalation alert details"
                >
                  <div className="flex items-start justify-between pb-2 border-b border-[#CBDAD6] mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-[#B93826]/15 text-[#B93826]">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                      <span className="font-serif text-xs font-semibold text-[#12332F]">
                        SLA Escalation In Effect
                      </span>
                    </div>
                    <button 
                      onClick={() => setAlertExpanded(false)}
                      className="text-[#526460] hover:text-[#1A2421]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {breachedComplaints.slice(0, 2).map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white p-2.5 rounded-lg border border-[#CBDAD6] text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-[#12332F] bg-[#EFF3F1] px-1.5 py-0.5 rounded border border-[#CBDAD6]">
                            {item.trackingCode}
                          </span>
                          <span className="text-[10px] font-semibold text-[#B93826]">
                            SLA Target Exceeded
                          </span>
                        </div>
                        <div className="font-medium text-[#1A2421] line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#526460]">
                          Location: {item.location} • Status: {item.status.replace('_', ' ')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#CBDAD6] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setAlertExpanded(false);
                        onOpenTrackModal(breachedComplaints[0]?.trackingCode);
                      }}
                      className="text-xs font-semibold text-[#12332F] hover:text-[#2F6E5F] cursor-pointer flex items-center gap-1"
                    >
                      <span>Track in Redress Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => setAlertExpanded(false)}
                      className="text-[11px] text-[#526460] hover:underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications Icon Button */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="p-1.5 rounded-lg text-[#EFF3F1]/70 hover:text-[#E7A33E] hover:bg-[#1A433E] transition-colors relative cursor-pointer"
            title="Institutional Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E7A33E] ring-2 ring-[#12332F]" />
            )}
          </button>

          {/* Subtle Reset Button */}
          <button
            onClick={resetAllData}
            className="hidden sm:inline-flex p-1.5 rounded-lg text-[#EFF3F1]/60 hover:text-[#E7A33E] hover:bg-[#1A433E] transition-colors cursor-pointer"
            title="Reset demo records"
            aria-label="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* User Role Indicator (Clickable to open drawer on mobile) */}
          <div 
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center gap-1.5 pl-1.5 border-l border-[#1A433E] cursor-pointer group"
            title={`${currentUser.name} (${role.replace('_', ' ')})`}
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-6 h-6 rounded-full object-cover border border-[#E7A33E]/60 shadow-xs"
            />
            <span className="hidden lg:inline text-xs font-medium text-[#FBF9F4] max-w-[100px] truncate">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
