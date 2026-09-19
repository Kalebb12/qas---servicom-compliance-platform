import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  UserProfile,
  Complaint,
  CourseEvaluation,
  QAAuditInspection,
  ServicomCharterMetric,
  FacultySummaryStat,
  StudentEvaluationCriteria,
  ComplaintPriority,
  ComplaintCategory,
  MainNavItem,
  AppNotification,
} from "../types";
import {
  USER_PROFILES,
  INITIAL_COMPLAINTS,
  INITIAL_COURSE_EVALUATIONS,
  INITIAL_QA_AUDITS,
  SERVICOM_CHARTER_METRICS,
  FACULTY_SUMMARY_STATS,
} from "../data/mockData";

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "SLA Escalation Alert",
    message:
      "Grievance SRV-2025-0142 (LT-B Projector Breakdown) has exceeded the 72h SLA target.",
    timestamp: "15 mins ago",
    category: "sla_alert",
    isRead: false,
    priority: "urgent",
    actionLabel: "Review Docket",
    actionNav: "track",
  },
  {
    id: "notif-2",
    title: "Semester Evaluation Window",
    message:
      "Harmattan mid-term student evaluation window is currently active. 2 courses pending your evaluation.",
    timestamp: "2 hours ago",
    category: "evaluation",
    isRead: false,
    priority: "info",
    actionLabel: "Complete Evaluations",
    actionNav: "evaluations",
  },
  {
    id: "notif-3",
    title: "Grievance Resolution Updated",
    message:
      "Grievance SRV-2025-0139 regarding missing CA marks in CSC 301 has been resolved by Dr. Adeleke.",
    timestamp: "Yesterday",
    category: "complaint",
    isRead: true,
    priority: "success",
    actionLabel: "View Resolution",
    actionNav: "track",
  },
  {
    id: "notif-4",
    title: "Senate Quality Assurance Circular",
    message:
      "Senate Committee on Academic Quality scheduled inspection visits for all 300L & 400L lectures this week.",
    timestamp: "2 days ago",
    category: "circular",
    isRead: true,
    priority: "info",
  },
];

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  sessionInfo: { session: string; semester: string; week: number };
  complaints: Complaint[];
  courseEvaluations: CourseEvaluation[];
  qaAudits: QAAuditInspection[];
  charterMetrics: ServicomCharterMetric[];
  facultyStats: FacultySummaryStat[];

  // Navigation & Drawer
  activeNav: MainNavItem;
  setActiveNav: (item: MainNavItem) => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;

  // Appearance and accessibility preferences
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  fontScale: "default" | "large" | "xlarge";
  setFontScale: (scale: "default" | "large" | "xlarge") => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // Service Directory -> Lodge Complaint bridge
  directoryPrefillCategory: ComplaintCategory | null;
  setDirectoryPrefillCategory: (category: ComplaintCategory | null) => void;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Complaint Actions
  submitComplaint: (data: {
    title: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    description: string;
    location: string;
    faculty: string;
    department: string;
    isAnonymous: boolean;
    evidenceAttachmentName?: string;
  }) => string; // returns tracking code

  updateComplaintStatus: (
    id: string,
    newStatus: Complaint["status"],
    resolutionSummary?: string,
  ) => void;
  addComplaintInvestigationNote: (
    complaintId: string,
    note: string,
    isInternal: boolean,
  ) => void;
  rateComplaintResolution: (complaintId: string, rating: number) => void;

  // Student Evaluation Actions
  submitCourseEvaluation: (
    courseId: string,
    ratings: StudentEvaluationCriteria,
    comment?: string,
  ) => void;

  // Lecturer Action Plan
  submitActionPlan: (courseId: string, goals: string[]) => void;

  // QA Audit Actions
  recordNewAudit: (
    audit: Omit<QAAuditInspection, "id" | "auditCode">,
  ) => string;

  // Utilities
  resetAllData: () => void;
  notificationMessage: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRoleState] = useState<UserRole>("student");
  const [activeNav, setActiveNav] = useState<MainNavItem>("dashboard");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("qas_theme") as "light" | "dark") || "light",
  );
  const [fontScale, setFontScale] = useState<"default" | "large" | "xlarge">(
    () =>
      (localStorage.getItem("qas_font_scale") as
        | "default"
        | "large"
        | "xlarge") || "default",
  );
  const [highContrast, setHighContrast] = useState(
    () => localStorage.getItem("qas_high_contrast") === "true",
  );
  const [reducedMotion, setReducedMotion] = useState(
    () => localStorage.getItem("qas_reduced_motion") === "true",
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [directoryPrefillCategory, setDirectoryPrefillCategory] =
    useState<ComplaintCategory | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.fontScale = fontScale;
    document.documentElement.dataset.highContrast = String(highContrast);
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
    localStorage.setItem("qas_theme", theme);
    localStorage.setItem("qas_font_scale", fontScale);
    localStorage.setItem("qas_high_contrast", String(highContrast));
    localStorage.setItem("qas_reduced_motion", String(reducedMotion));
  }, [theme, fontScale, highContrast, reducedMotion]);

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead,
  ).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Initialize from LocalStorage or defaults
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem("qas_complaints");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_COMPLAINTS;
  });

  const [courseEvaluations, setCourseEvaluations] = useState<
    CourseEvaluation[]
  >(() => {
    const saved = localStorage.getItem("qas_evaluations");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_COURSE_EVALUATIONS;
  });

  const [qaAudits, setQaAudits] = useState<QAAuditInspection[]>(() => {
    const saved = localStorage.getItem("qas_audits");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_QA_AUDITS;
  });

  const [charterMetrics] = useState<ServicomCharterMetric[]>(
    SERVICOM_CHARTER_METRICS,
  );
  const [facultyStats] = useState<FacultySummaryStat[]>(FACULTY_SUMMARY_STATS);

  const sessionInfo = {
    session: "2024/2025 Academic Session",
    semester: "Harmattan / First Semester",
    week: 10,
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("qas_complaints", JSON.stringify(complaints));
  }, [complaints]);

  // Live SLA countdown: every real minute, tick each open complaint's
  // remaining hours down by 1 minute's worth, and flip isSlaBreached once it
  // crosses zero. This counts down from whatever value is already stored,
  // not from the (possibly old) submittedAt date — so it stays meaningful
  // for both freshly-submitted complaints and seeded demo data.
  useEffect(() => {
    const intervalId = setInterval(() => {
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.status === "resolved" || c.status === "closed") return c;
          const nextRemaining = c.slaHoursRemaining - 1 / 60;
          return {
            ...c,
            slaHoursRemaining: nextRemaining,
            isSlaBreached: nextRemaining < 0,
          };
        }),
      );
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    localStorage.setItem("qas_evaluations", JSON.stringify(courseEvaluations));
  }, [courseEvaluations]);

  useEffect(() => {
    localStorage.setItem("qas_audits", JSON.stringify(qaAudits));
  }, [qaAudits]);

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 4000);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setActiveNav("dashboard");
    setIsMobileDrawerOpen(false);
    showNotification(
      `Switched view to ${USER_PROFILES[newRole].name} (${USER_PROFILES[newRole].roleTitle})`,
    );
  };

  const currentUser = USER_PROFILES[role];

  // Submit Complaint
  const submitComplaint = (data: {
    title: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    description: string;
    location: string;
    faculty: string;
    department: string;
    isAnonymous: boolean;
    evidenceAttachmentName?: string;
  }) => {
    const activeHighPriorityCount = complaints.filter(
      (complaint) =>
        complaint.priority === "high" &&
        complaint.status !== "resolved" &&
        complaint.status !== "closed" &&
        (complaint.studentMatric === currentUser.identifier ||
          (!complaint.isAnonymous &&
            complaint.studentName === currentUser.name)),
    ).length;

    if (data.priority === "high" && activeHighPriorityCount >= 2) {
      showNotification(
        "High-priority limit reached. Resolve an active high-priority complaint before submitting another.",
      );
      return "";
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `SRV-2025-${randomNum}`;

    // SLA target calculation
    let slaHours = 72;
    if (data.priority === "urgent") slaHours = 24;
    else if (data.priority === "high") slaHours = 48;
    else slaHours = 96;

    const newComplaint: Complaint = {
      id: `cmp_${Date.now()}`,
      trackingCode,
      title: data.title,
      category: data.category,
      priority: data.priority,
      status: "submitted",
      description: data.description,
      location: data.location,
      faculty: data.faculty,
      department: data.department,
      isAnonymous: data.isAnonymous,
      studentName: data.isAnonymous ? undefined : currentUser.name,
      studentMatric: data.isAnonymous ? undefined : currentUser.identifier,
      studentEmail: data.isAnonymous ? undefined : currentUser.email,
      submittedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      slaHoursTarget: slaHours,
      slaHoursRemaining: slaHours,
      isSlaBreached: false,
      assignedOfficer: "Mrs. Grace Danladi (SERVICOM Triage Desk)",
      assignedUnit: "Institutional Redress Committee",
      investigationNotes: [
        {
          id: `note_${Date.now()}`,
          author: "System (SERVICOM Portal)",
          role: "Automated Gateway",
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          note: `Complaint received and logged. SLA clock started (${slaHours} Hours resolution standard target). Notification dispatched to SERVICOM nodal desk.`,
          isInternalOnly: false,
        },
      ],
      evidenceAttachmentName: data.evidenceAttachmentName,
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    showNotification(
      `Complaint lodged successfully. Your tracking code is ${trackingCode}`,
    );
    return trackingCode;
  };

  const updateComplaintStatus = (
    id: string,
    newStatus: Complaint["status"],
    resolutionSummary?: string,
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: newStatus,
            resolutionSummary: resolutionSummary ?? c.resolutionSummary,
            investigationNotes: [
              ...c.investigationNotes,
              {
                id: `note_${Date.now()}`,
                author: currentUser.name,
                role: currentUser.roleTitle,
                timestamp: new Date()
                  .toISOString()
                  .replace("T", " ")
                  .slice(0, 16),
                note: `Status updated to "${newStatus.replace("_", " ").toUpperCase()}". ${resolutionSummary ? `Resolution Notes: ${resolutionSummary}` : ""}`,
                isInternalOnly: false,
              },
            ],
          };
        }
        return c;
      }),
    );
    showNotification(`Complaint ${id} status updated to ${newStatus}`);
  };

  const addComplaintInvestigationNote = (
    complaintId: string,
    note: string,
    isInternal: boolean,
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            investigationNotes: [
              ...c.investigationNotes,
              {
                id: `note_${Date.now()}`,
                author: currentUser.name,
                role: currentUser.roleTitle,
                timestamp: new Date()
                  .toISOString()
                  .replace("T", " ")
                  .slice(0, 16),
                note,
                isInternalOnly: isInternal,
              },
            ],
          };
        }
        return c;
      }),
    );
    showNotification("Investigation note added to docket.");
  };

  const rateComplaintResolution = (complaintId: string, rating: number) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            studentSatisfactionRating: rating,
          };
        }
        return c;
      }),
    );
    showNotification(
      `Thank you! Your feedback rating (${rating}/5) has been registered.`,
    );
  };

  const submitCourseEvaluation = (
    courseId: string,
    ratings: StudentEvaluationCriteria,
    comment?: string,
  ) => {
    setCourseEvaluations((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          const totalResp = course.totalResponses + 1;
          const calcAvg = (current: number, added: number) =>
            Number(
              ((current * course.totalResponses + added) / totalResp).toFixed(
                2,
              ),
            );

          const updatedCriteria: StudentEvaluationCriteria = {
            punctuality: calcAvg(
              course.criteria.punctuality,
              ratings.punctuality,
            ),
            subjectMastery: calcAvg(
              course.criteria.subjectMastery,
              ratings.subjectMastery,
            ),
            communicationClarity: calcAvg(
              course.criteria.communicationClarity,
              ratings.communicationClarity,
            ),
            gradingTransparency: calcAvg(
              course.criteria.gradingTransparency,
              ratings.gradingTransparency,
            ),
            consultationAvailability: calcAvg(
              course.criteria.consultationAvailability,
              ratings.consultationAvailability,
            ),
            syllabusCoverageAdherence: calcAvg(
              course.criteria.syllabusCoverageAdherence,
              ratings.syllabusCoverageAdherence,
            ),
          };

          const overall = Number(
            (
              (updatedCriteria.punctuality +
                updatedCriteria.subjectMastery +
                updatedCriteria.communicationClarity +
                updatedCriteria.gradingTransparency +
                updatedCriteria.consultationAvailability +
                updatedCriteria.syllabusCoverageAdherence) /
              6
            ).toFixed(2),
          );

          const updatedComments = [...course.comments];
          if (comment && comment.trim().length > 0) {
            const avgGiven =
              (ratings.punctuality +
                ratings.subjectMastery +
                ratings.communicationClarity +
                ratings.gradingTransparency +
                ratings.consultationAvailability +
                ratings.syllabusCoverageAdherence) /
              6;
            updatedComments.unshift({
              id: `comm_${Date.now()}`,
              date: new Date().toISOString().slice(0, 10),
              rating: Math.round(avgGiven),
              sentiment:
                avgGiven >= 4.0
                  ? "positive"
                  : avgGiven >= 3.0
                    ? "constructive"
                    : "critical",
              comment: comment.trim(),
            });
          }

          return {
            ...course,
            totalResponses: totalResp,
            overallScore: overall,
            criteria: updatedCriteria,
            comments: updatedComments,
            evaluatedByCurrentStudent: true,
          };
        }
        return course;
      }),
    );
    showNotification(
      `Course & Lecturer evaluation submitted successfully! Scores aggregated.`,
    );
  };

  const submitActionPlan = (courseId: string, goals: string[]) => {
    setCourseEvaluations((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          return {
            ...course,
            actionPlan: {
              submittedDate: new Date().toISOString().slice(0, 10),
              targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .slice(0, 10),
              improvementGoals: goals,
              status: "pending_hod_review",
            },
          };
        }
        return course;
      }),
    );
    showNotification(
      "Continuous Improvement Action Plan submitted to Head of Department.",
    );
  };

  const recordNewAudit = (
    auditData: Omit<QAAuditInspection, "id" | "auditCode">,
  ) => {
    const code = `QAD-2025-${Math.floor(100 + Math.random() * 900)}`;
    const newAudit: QAAuditInspection = {
      ...auditData,
      id: `aud_${Date.now()}`,
      auditCode: code,
    };
    setQaAudits((prev) => [newAudit, ...prev]);
    showNotification(
      `Quality Audit ${code} filed successfully into institutional repository.`,
    );
    return code;
  };

  const resetAllData = () => {
    localStorage.removeItem("qas_complaints");
    localStorage.removeItem("qas_evaluations");
    localStorage.removeItem("qas_audits");
    setComplaints(INITIAL_COMPLAINTS);
    setCourseEvaluations(INITIAL_COURSE_EVALUATIONS);
    setQaAudits(INITIAL_QA_AUDITS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveNav("dashboard");
    showNotification(
      "System demo data reset to default institutional records.",
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        sessionInfo,
        complaints,
        courseEvaluations,
        qaAudits,
        charterMetrics,
        facultyStats,
        activeNav,
        setActiveNav,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        theme,
        setTheme,
        fontScale,
        setFontScale,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
        isSettingsOpen,
        setIsSettingsOpen,
        directoryPrefillCategory,
        setDirectoryPrefillCategory,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isNotificationsOpen,
        setIsNotificationsOpen,
        submitComplaint,
        updateComplaintStatus,
        addComplaintInvestigationNote,
        rateComplaintResolution,
        submitCourseEvaluation,
        submitActionPlan,
        recordNewAudit,
        resetAllData,
        notificationMessage,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
