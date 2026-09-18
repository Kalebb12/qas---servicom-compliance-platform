export type UserRole = 'student' | 'lecturer' | 'qa_officer' | 'servicom_officer' | 'leadership';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  faculty: string;
  identifier: string; // Matric number or Staff ID
  email: string;
  avatar: string;
}

export type ComplaintCategory =
  | 'lecture_delivery'
  | 'missing_grades'
  | 'facility_breakdown'
  | 'harassment_victimization'
  | 'administrative_delay'
  | 'library_labs'
  | 'security_welfare';

export type ComplaintPriority = 'standard' | 'high' | 'urgent';

export type ComplaintStatus =
  | 'submitted'
  | 'triaged'
  | 'investigating'
  | 'action_taken'
  | 'resolved'
  | 'escalated'
  | 'closed';

export interface ComplaintNote {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  note: string;
  isInternalOnly?: boolean;
}

export interface Complaint {
  id: string;
  trackingCode: string; // e.g. SRV-2025-0142
  title: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  description: string;
  location: string;
  faculty: string;
  department: string;
  isAnonymous: boolean;
  studentName?: string;
  studentMatric?: string;
  studentEmail?: string;
  submittedAt: string;
  slaHoursTarget: number;
  slaHoursRemaining: number;
  isSlaBreached: boolean;
  assignedOfficer?: string;
  assignedUnit?: string;
  investigationNotes: ComplaintNote[];
  resolutionSummary?: string;
  studentSatisfactionRating?: number; // 1-5
  evidenceAttachmentName?: string;
}

export interface StudentEvaluationCriteria {
  punctuality: number; // 1-5
  subjectMastery: number;
  communicationClarity: number;
  gradingTransparency: number;
  consultationAvailability: number;
  syllabusCoverageAdherence: number;
}

export interface StudentFeedbackComment {
  id: string;
  date: string;
  comment: string;
  sentiment: 'positive' | 'constructive' | 'critical';
  rating: number;
}

export interface LecturerActionPlan {
  submittedDate: string;
  targetDate: string;
  improvementGoals: string[];
  status: 'pending_hod_review' | 'approved' | 'implemented';
  hodFeedback?: string;
}

export interface CourseEvaluation {
  id: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  lecturerId: string;
  lecturerName: string;
  lecturerTitle: string;
  department: string;
  faculty: string;
  semester: string;
  academicYear: string;
  totalEnrolled: number;
  totalResponses: number;
  overallScore: number; // e.g. 4.4 out of 5
  criteria: StudentEvaluationCriteria;
  comments: StudentFeedbackComment[];
  syllabusProgressWeeks: number; // e.g. 9 of 14 weeks
  totalSyllabusWeeks: number;
  actionPlan?: LecturerActionPlan;
  evaluatedByCurrentStudent?: boolean;
}

export interface QAChecklist {
  lecturerPunctuality: 'punctual' | 'late_10m' | 'absent' | 'not_scheduled';
  hallCleanliness: 'compliant' | 'minor_litter' | 'unsanitary';
  seatingAdequacy: 'sufficient' | 'overcrowded' | 'broken_furniture';
  audiovisualStatus: 'functional' | 'intermittent' | 'faulty' | 'absent';
  ventilationAndLighting: 'adequate' | 'fair' | 'poor_ac_lighting';
  syllabusAvailableToStudents: boolean;
  continuousAssessmentAnnounced: boolean;
  studentHeadcount: number;
  hallCapacity: number;
}

export interface QAAuditInspection {
  id: string;
  auditCode: string; // e.g. QAD-2025-412
  auditDate: string;
  timeSlot: string;
  hallName: string;
  building: string;
  faculty: string;
  courseCode: string;
  courseTitle: string;
  scheduledLecturer: string;
  actualLecturer: string;
  checklist: QAChecklist;
  overallScorePercentage: number;
  status: 'passed' | 'conditional_pass' | 'non_compliant';
  inspectorName: string;
  inspectorRemarks: string;
  rectificationDeadline?: string;
}

export interface ServicomCharterMetric {
  id: string;
  serviceCode: string;
  serviceTitle: string;
  responsibleUnit: string;
  charterSlaDays: number;
  averageActualDays: number;
  targetCompliancePercent: number;
  currentCompliancePercent: number;
  totalComplaintsThisSession: number;
  status: 'compliant' | 'warning' | 'breached';
  quarterTrend: '+2.4%' | '-1.8%' | '+0.5%' | '-4.2%';
}

export interface FacultySummaryStat {
  facultyName: string;
  dean: string;
  totalLecturers: number;
  averageTeachingRating: number;
  qaAuditPassRate: number;
  openComplaints: number;
  slaBreachRate: number;
}

export type MainNavItem = 'dashboard' | 'evaluations' | 'lodge' | 'track' | 'notifications' | 'directory';

export type DirectoryCategoryId =
  | 'registration'
  | 'transcript'
  | 'hostel'
  | 'fees'
  | 'examination'
  | 'id_card'
  | 'academic_issues'
  | 'health_services'
  | 'library'
  | 'ict';

export interface ServiceDirectoryEntry {
  id: DirectoryCategoryId;
  label: string; // e.g. "Transcript Requests"
  shortDescription: string; // one-liner shown on the selector grid
  responsibleUnit: string; // e.g. "Registry — Academic Records Division"
  building: string;
  contactEmail: string;
  contactPhone: string;
  officeHours: string;
  expectedProcessingTime: string; // e.g. "5–10 working days"
  requiredDocuments: string[];
  relatedComplaintCategory: ComplaintCategory; // used to route "File a complaint about this"
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'sla_alert' | 'evaluation' | 'complaint' | 'circular';
  isRead: boolean;
  priority: 'urgent' | 'info' | 'success';
  actionLabel?: string;
  actionNav?: MainNavItem;
}