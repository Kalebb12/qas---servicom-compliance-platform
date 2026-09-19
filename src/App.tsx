import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { BottomTabBar } from "./components/BottomTabBar";
import { NotificationsModal } from "./components/NotificationsModal";
import { StudentPortal } from "./components/StudentPortal";
import { LecturerPortal } from "./components/LecturerPortal";
import { QAOfficerPortal } from "./components/QAOfficerPortal";
import { ServicomPortal } from "./components/ServicomPortal";
import { LeadershipDashboard } from "./components/LeadershipDashboard";
import { TrackComplaintModal } from "./components/TrackComplaintModal";
import { ServiceDirectoryModal } from "./components/ServiceDirectoryModal";
import { SettingsModal } from "./components/SettingsModal";
import { CheckCircle2 } from "lucide-react";
import { ComplaintCategory } from "./types";

const MainContent: React.FC = () => {
  const {
    role,
    notificationMessage,
    setRole,
    setActiveNav,
    setDirectoryPrefillCategory,
  } = useApp();
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackInitialCode, setTrackInitialCode] = useState<string | undefined>(
    undefined,
  );
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);

  const handleOpenTrackModal = (code?: string) => {
    setTrackInitialCode(code);
    setIsTrackModalOpen(true);
  };

  const handleFileComplaintFromDirectory = (category: ComplaintCategory) => {
    // The directory is available regardless of role; routing a complaint
    // through it should land the person on the student lodge form.
    if (role !== "student") setRole("student");
    setDirectoryPrefillCategory(category);
    setActiveNav("lodge");
  };

  return (
    <div className="min-h-screen bg-[#EFF3F1] flex font-sans text-[#1A2421]">
      {/* Toast Notification */}
      {notificationMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 bg-[#12332F] text-[#FBF9F4] px-4 py-3 rounded-xl shadow-2xl border border-[#275B52] flex items-center gap-3 text-xs font-medium animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-md">
          <CheckCircle2 className="w-4 h-4 text-[#E7A33E] shrink-0" />
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Left Sidebar (Sticky on desktop, slide-out drawer on mobile) */}
      <Sidebar
        onOpenTrackModal={handleOpenTrackModal}
        onOpenDirectory={() => setIsDirectoryModalOpen(true)}
      />

      {/* Main Content Area (Header + Portal + Footer + Bottom Tab Bar) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Condensed Single-Row Top Bar */}
        <TopBar
          onOpenTrackModal={handleOpenTrackModal}
          onOpenDirectory={() => setIsDirectoryModalOpen(true)}
        />

        {/* Primary Role Views (Responsive padding for mobile bottom bar) */}
        <main className="flex-1 pb-20 md:pb-12">
          {role === "student" && <StudentPortal />}
          {role === "lecturer" && <LecturerPortal />}
          {role === "qa_officer" && <QAOfficerPortal />}
          {role === "servicom_officer" && <ServicomPortal />}
          {role === "leadership" && <LeadershipDashboard />}
        </main>

        {/* Institutional Footer */}
        <footer className="qas-footer bg-[#12332F] text-[#EFF3F1]/80 text-xs py-6 sm:py-8 border-t border-[#1A433E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 36 36" className="w-5 h-5 shrink-0" fill="none">
                <circle
                  cx="18"
                  cy="18"
                  r="14.5"
                  stroke="#E7A33E"
                  strokeWidth="2.75"
                  fill="none"
                />
                <path
                  d="M11 18.5L16 23.5L25.5 13"
                  stroke="#E7A33E"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <span className="font-serif text-sm font-semibold text-[#FBF9F4]">
                  QAS • Institutional Quality Assurance & SERVICOM Directorate
                </span>
                <p className="text-[11px] text-[#EFF3F1]/60">
                  Academic Quality Standards, Student Feedback & Public Service
                  Delivery Compliance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#EFF3F1]/70">
              <span>Harmattan 2024/2025</span>
              <span>•</span>
              <span className="text-[#2F6E5F] font-medium">
                Senate Quality Framework
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Tab Bar (fixed at bottom for quick 4-tap navigation) */}
      <BottomTabBar />

      {/* Global Notifications Modal */}
      <NotificationsModal />

      <SettingsModal />

      {/* Global Track Complaint Modal */}
      <TrackComplaintModal
        isOpen={isTrackModalOpen}
        onClose={() => {
          setIsTrackModalOpen(false);
          setTrackInitialCode(undefined);
        }}
        initialCode={trackInitialCode}
      />

      {/* Global "Where Do I Go?" Service Directory Modal */}
      <ServiceDirectoryModal
        isOpen={isDirectoryModalOpen}
        onClose={() => setIsDirectoryModalOpen(false)}
        onFileComplaint={handleFileComplaintFromDirectory}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
