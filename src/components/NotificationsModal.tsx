import * as React from "react";
import { useApp } from "../context/AppContext";
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  CheckCheck,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveNav,
  } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="qas-notifications bg-[#EFF3F1] border border-[#CBDAD6] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] font-sans text-[#1A2421]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="qas-notifications-header bg-[#12332F] text-[#FBF9F4] p-4 sm:p-5 flex items-center justify-between border-b border-[#1A433E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E7A33E] text-[#12332F] flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold tracking-tight text-[#FBF9F4]">
                Institutional Notifications
              </h3>
              <p className="text-xs text-[#EFF3F1]/70">
                Quality alerts, SLA escalations & academic calendar notices
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="text-[#EFF3F1]/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close notifications modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions bar */}
        <div className="bg-white px-4 py-2.5 border-b border-[#CBDAD6] flex items-center justify-between text-xs text-[#526460]">
          <span>
            {notifications.filter((n) => !n.isRead).length} unread updates
          </span>
          <button
            onClick={markAllNotificationsAsRead}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#12332F] hover:text-[#2F6E5F] cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-[#2F6E5F]" />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-[#526460]">
              <Bell className="w-8 h-8 mx-auto text-[#CBDAD6] mb-2" />
              <p className="text-sm font-medium">
                No notifications at this time
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.isRead
                    ? "bg-white border-[#CBDAD6]/70 text-[#526460]"
                    : "bg-white border-[#12332F]/40 shadow-xs ring-1 ring-[#12332F]/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.priority === "urgent" ? (
                      <span className="p-1 rounded-md bg-[#B93826]/10 text-[#B93826]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                    ) : item.priority === "success" ? (
                      <span className="p-1 rounded-md bg-[#2F6E5F]/15 text-[#2F6E5F]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-md bg-[#12332F]/10 text-[#12332F]">
                        <Clock className="w-3.5 h-3.5" />
                      </span>
                    )}

                    <span className="font-serif font-semibold text-sm text-[#1A2421]">
                      {item.title}
                    </span>

                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#E7A33E] shrink-0" />
                    )}
                  </div>

                  <span className="text-[11px] text-[#526460] whitespace-nowrap">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-[#1A2421] mt-1.5 leading-relaxed">
                  {item.message}
                </p>

                {item.actionLabel && (
                  <div className="mt-2.5 pt-2 border-t border-[#CBDAD6]/60 flex items-center justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationAsRead(item.id);
                        if (item.actionNav) {
                          setActiveNav(item.actionNav);
                        }
                        setIsNotificationsOpen(false);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#12332F] hover:text-[#2F6E5F] bg-[#EFF3F1] px-2.5 py-1 rounded-lg border border-[#CBDAD6] cursor-pointer"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-white p-3 border-t border-[#CBDAD6] flex justify-end">
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-[#1A2421] bg-[#EFF3F1] hover:bg-[#E2EBE8] border border-[#CBDAD6] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
