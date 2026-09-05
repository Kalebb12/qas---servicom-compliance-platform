import { 
  UserProfile, 
  Complaint, 
  CourseEvaluation, 
  QAAuditInspection, 
  ServicomCharterMetric, 
  FacultySummaryStat 
} from '../types';

export const USER_PROFILES: Record<string, UserProfile> = {
  student: {
    id: 'usr_student_1',
    name: 'Chinedu Okafor',
    role: 'student',
    roleTitle: 'Undergraduate Student (300 Level)',
    department: 'Computer Science',
    faculty: 'Physical & Computing Sciences',
    identifier: 'U2022/CSC/1042',
    email: 'c.okafor@apex.edu.ng',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  lecturer: {
    id: 'usr_lecturer_1',
    name: 'Dr. Miriam Adeleke',
    role: 'lecturer',
    roleTitle: 'Senior Lecturer, Department of Computer Science',
    department: 'Computer Science',
    faculty: 'Physical & Computing Sciences',
    identifier: 'STAFF/ACAD/0488',
    email: 'm.adeleke@apex.edu.ng',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  qa_officer: {
    id: 'usr_qa_1',
    name: 'Engr. Bello Ibrahim',
    role: 'qa_officer',
    roleTitle: 'Chief Quality Assurance Auditor',
    department: 'Directorate of Academic Planning & QA',
    faculty: 'Vice Chancellor\'s Office',
    identifier: 'STAFF/NTS/0129',
    email: 'b.ibrahim.qa@apex.edu.ng',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  servicom_officer: {
    id: 'usr_servicom_1',
    name: 'Mrs. Grace Danladi',
    role: 'servicom_officer',
    roleTitle: 'SERVICOM Nodal Officer & Redress Secretary',
    department: 'Institutional SERVICOM Unit',
    faculty: 'Registry & Public Accountability',
    identifier: 'STAFF/SRV/0041',
    email: 'servicom.nodal@apex.edu.ng',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  leadership: {
    id: 'usr_leadership_1',
    name: 'Prof. Olumide Balogun',
    role: 'leadership',
    roleTitle: 'Deputy Vice-Chancellor (Academic & QA Oversight)',
    department: 'University Governing Directorate',
    faculty: 'Office of the Vice-Chancellor',
    identifier: 'STAFF/EXEC/0004',
    email: 'dvc.academics@apex.edu.ng',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
};

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp_001',
    trackingCode: 'SRV-2025-0142',
    title: 'Faulty Public Address System & Insufficient Seating in New Lecture Hall 1',
    category: 'facility_breakdown',
    priority: 'high',
    status: 'investigating',
    description: 'During 300L Engineering Mathematics and Computer Architecture joint classes, more than 80 students stand outside the windows. The public address mic has heavy feedback noise and fails 15 minutes into lectures, making it impossible to hear explanations in the rear gallery.',
    location: 'New Lecture Hall 1 (NLH-1), East Campus',
    faculty: 'Physical & Computing Sciences',
    department: 'Computer Science',
    isAnonymous: false,
    studentName: 'Chinedu Okafor',
    studentMatric: 'U2022/CSC/1042',
    studentEmail: 'c.okafor@apex.edu.ng',
    submittedAt: '2025-02-18 09:15',
    slaHoursTarget: 72,
    slaHoursRemaining: 18,
    isSlaBreached: false,
    assignedOfficer: 'Mrs. Grace Danladi',
    assignedUnit: 'Physical Planning & Works Directorate',
    investigationNotes: [
      {
        id: 'n_1',
        author: 'Mrs. Grace Danladi',
        role: 'SERVICOM Nodal Officer',
        timestamp: '2025-02-18 11:30',
        note: 'Complaint triaged. Verified with Class Rep that 240 students attend NLH-1 which has only 180 seats. Dispatched urgent requisition to Works Dept for 70 temporary acoustic chairs and PA system amplifier maintenance.',
        isInternalOnly: false
      },
      {
        id: 'n_2',
        author: 'Engr. D. K. Sanni',
        role: 'Works Maintenance Tech',
        timestamp: '2025-02-19 14:10',
        note: 'Audio technician replaced wireless receiver. Sound tested successfully. Additional 60 wooden single-bench desks scheduled for transport from storage tomorrow morning.',
        isInternalOnly: true
      }
    ]
  },
  {
    id: 'cmp_002',
    trackingCode: 'SRV-2025-0129',
    title: 'Missing Continuous Assessment (CA) Scores for CSC 305 (Database Systems)',
    category: 'missing_grades',
    priority: 'urgent',
    status: 'action_taken',
    description: 'Results were uploaded on student portal yesterday without CA test scores (30 marks) for stream B students (over 65 students recorded as 0/30 or absent), despite physical submission and signed attendance sheet during the test on Jan 14th.',
    location: 'Departmental Exam Office, Faculty Building Rm 204',
    faculty: 'Physical & Computing Sciences',
    department: 'Computer Science',
    isAnonymous: false,
    studentName: 'Amina Yusuf',
    studentMatric: 'U2022/CSC/1089',
    studentEmail: 'a.yusuf@apex.edu.ng',
    submittedAt: '2025-02-16 14:40',
    slaHoursTarget: 48,
    slaHoursRemaining: -6,
    isSlaBreached: true,
    assignedOfficer: 'Mrs. Grace Danladi',
    assignedUnit: 'Departmental Examination Board',
    investigationNotes: [
      {
        id: 'n_3',
        author: 'Mrs. Grace Danladi',
        role: 'SERVICOM Nodal Officer',
        timestamp: '2025-02-16 16:00',
        note: 'Contacted Head of Department and Course Examiner Dr. B. Okonkwo. Marked as Urgent due to upcoming Senate approval window.',
        isInternalOnly: false
      },
      {
        id: 'n_4',
        author: 'Dr. B. Okonkwo',
        role: 'Course Examiner',
        timestamp: '2025-02-18 10:25',
        note: 'Stream B CA score sheet was retained in the departmental moderation folder and omitted during CSV batch import. Corrected scoresheet verified and re-uploaded for Senate ratification.',
        isInternalOnly: false
      }
    ],
    resolutionSummary: 'Examination Officer verified missing score sheet with original sign-in log. Portal database has been updated with genuine student CA scores. Revised slips available for printing.'
  },
  {
    id: 'cmp_003',
    trackingCode: 'SRV-2025-0098',
    title: 'Repeated Lecturer Absenteeism & Last-minute Cancellations (MEE 302)',
    category: 'lecture_delivery',
    priority: 'standard',
    status: 'resolved',
    description: 'Applied Thermodynamics lecture scheduled Tuesdays 8:00 AM - 10:00 AM has held only 3 times this semester. Class gathered repeatedly without prior cancellation notices from the departmental secretariat.',
    location: 'Engineering Complex Room 108',
    faculty: 'Engineering & Technology',
    department: 'Mechanical Engineering',
    isAnonymous: true,
    submittedAt: '2025-02-10 11:20',
    slaHoursTarget: 120,
    slaHoursRemaining: 0,
    isSlaBreached: false,
    assignedOfficer: 'Mrs. Grace Danladi',
    assignedUnit: 'Deanery, Faculty of Engineering',
    investigationNotes: [
      {
        id: 'n_5',
        author: 'Prof. T. Adewale',
        role: 'Dean of Engineering',
        timestamp: '2025-02-12 11:00',
        note: 'Investigated with HOD. Lecturer was on authorized medical leave with insufficient teaching handover. Co-lecturer has been assigned, makeup weekend tutorial sessions scheduled with students consent.',
        isInternalOnly: false
      }
    ],
    resolutionSummary: 'Co-examiner assigned; revised makeup timetable adopted with student representative agreement; attendance logs now verified weekly by Faculty QA officer.',
    studentSatisfactionRating: 5
  },
  {
    id: 'cmp_004',
    trackingCode: 'SRV-2025-0155',
    title: 'Non-functioning Fume Hoods & Broken Reagent Refrigerators in Biochemistry Lab 3',
    category: 'library_labs',
    priority: 'high',
    status: 'triaged',
    description: 'Organic solvent vapors accumulating heavily during enzyme kinetics practicals. Two students reported dizziness during last Thursday laboratory session.',
    location: 'Biochemistry Research Lab 3, Science Wing',
    faculty: 'Basic Medical Sciences',
    department: 'Biochemistry',
    isAnonymous: true,
    submittedAt: '2025-02-19 08:30',
    slaHoursTarget: 48,
    slaHoursRemaining: 34,
    isSlaBreached: false,
    assignedOfficer: 'Mrs. Grace Danladi',
    assignedUnit: 'Environmental Health & Laboratory Safety Board',
    investigationNotes: [
      {
        id: 'n_6',
        author: 'Mrs. Grace Danladi',
        role: 'SERVICOM Officer',
        timestamp: '2025-02-19 09:10',
        note: 'Safety hazard flagged. Notified Chief Technologist and QA Lab Audit Committee for instant on-site inspection.',
        isInternalOnly: false
      }
    ]
  },
  {
    id: 'cmp_005',
    trackingCode: 'SRV-2025-0160',
    title: 'Allegation of Retaliatory Grading Threat after Course Evaluation Question',
    category: 'harassment_victimization',
    priority: 'urgent',
    status: 'submitted',
    description: 'During a lecture on Monday, an instructor warned the class that anyone who submits unfavorable comments on the SERVICOM QA portal will face severe mark deductions in the continuous assessment.',
    location: 'Faculty of Social Sciences Auditorium',
    faculty: 'Management & Social Sciences',
    department: 'Economics',
    isAnonymous: true,
    submittedAt: '2025-02-19 12:45',
    slaHoursTarget: 24,
    slaHoursRemaining: 21,
    isSlaBreached: false,
    assignedOfficer: 'Mrs. Grace Danladi',
    assignedUnit: 'Anti-Corruption & Transparency Monitoring Unit (ACTU)',
    investigationNotes: []
  }
];

export const INITIAL_COURSE_EVALUATIONS: CourseEvaluation[] = [
  {
    id: 'eval_001',
    courseCode: 'CSC 301',
    courseTitle: 'Operating Systems & System Programming',
    creditUnits: 3,
    lecturerId: 'usr_lecturer_1',
    lecturerName: 'Dr. Miriam Adeleke',
    lecturerTitle: 'Senior Lecturer, Ph.D (Manchester)',
    department: 'Computer Science',
    faculty: 'Physical & Computing Sciences',
    semester: 'Harmattan / First Semester',
    academicYear: '2024/2025',
    totalEnrolled: 142,
    totalResponses: 118,
    overallScore: 4.6,
    criteria: {
      punctuality: 4.8,
      subjectMastery: 4.9,
      communicationClarity: 4.5,
      gradingTransparency: 4.4,
      consultationAvailability: 4.3,
      syllabusCoverageAdherence: 4.7
    },
    syllabusProgressWeeks: 10,
    totalSyllabusWeeks: 14,
    evaluatedByCurrentStudent: true,
    actionPlan: {
      submittedDate: '2025-02-04',
      targetDate: '2025-03-15',
      status: 'approved',
      improvementGoals: [
        'Organize two dedicated weekly hybrid office hours for students struggling with C POSIX concurrency pointers',
        'Upload weekly lecture slide recordings to institutional LMS 24 hours prior to lectures',
        'Standardize rubric grading scheme for Kernel project assignments to improve transparency'
      ],
      hodFeedback: 'Commendable initiative. Virtual office hours approved for inclusion in departmental weekly schedule.'
    },
    comments: [
      {
        id: 'c_1',
        date: '2025-02-14',
        rating: 5,
        sentiment: 'positive',
        comment: 'Dr. Adeleke makes complex deadlock algorithms and memory paging crystal clear with real Unix demonstrations. One of the best courses this session!'
      },
      {
        id: 'c_2',
        date: '2025-02-12',
        rating: 4,
        sentiment: 'constructive',
        comment: 'Punctuality and mastery are top tier. However, the Lab 2 assignment deadline coincided with our mid-semester exams week, causing extreme stress.'
      },
      {
        id: 'c_3',
        date: '2025-02-10',
        rating: 5,
        sentiment: 'positive',
        comment: 'Very fair with quizzes. She provided sample answers immediately after each class quiz so we knew exactly where we went wrong.'
      }
    ]
  },
  {
    id: 'eval_002',
    courseCode: 'CSC 303',
    courseTitle: 'Design & Analysis of Algorithms',
    creditUnits: 3,
    lecturerId: 'usr_lecturer_2',
    lecturerName: 'Prof. Kayode Durosinmi',
    lecturerTitle: 'Professor of Algorithms & Automata',
    department: 'Computer Science',
    faculty: 'Physical & Computing Sciences',
    semester: 'Harmattan / First Semester',
    academicYear: '2024/2025',
    totalEnrolled: 142,
    totalResponses: 94,
    overallScore: 3.8,
    criteria: {
      punctuality: 4.1,
      subjectMastery: 4.8,
      communicationClarity: 3.2,
      gradingTransparency: 3.1,
      consultationAvailability: 3.4,
      syllabusCoverageAdherence: 4.2
    },
    syllabusProgressWeeks: 8,
    totalSyllabusWeeks: 14,
    evaluatedByCurrentStudent: false,
    actionPlan: {
      submittedDate: '2025-02-15',
      targetDate: '2025-03-20',
      status: 'pending_hod_review',
      improvementGoals: [
        'Incorporate visual dynamic programming trace charts during lectures',
        'Release model solutions with explicit mark allocations within 7 days of quiz completion'
      ]
    },
    comments: [
      {
        id: 'c_4',
        date: '2025-02-11',
        rating: 3,
        sentiment: 'critical',
        comment: 'Prof has unmatched mastery of algorithmic proofs, but goes too fast across mathematical induction steps without pausing for questions.'
      },
      {
        id: 'c_5',
        date: '2025-02-08',
        rating: 4,
        sentiment: 'constructive',
        comment: 'Quizzes are very difficult. We need step-by-step feedback on assignments rather than just a total grade.'
      }
    ]
  },
  {
    id: 'eval_003',
    courseCode: 'MTH 301',
    courseTitle: 'Advanced Linear Algebra & Numerical Analysis',
    creditUnits: 3,
    lecturerId: 'usr_lecturer_3',
    lecturerName: 'Dr. Veronica Ekwensi',
    lecturerTitle: 'Associate Professor of Mathematics',
    department: 'Mathematics & Statistics',
    faculty: 'Physical & Computing Sciences',
    semester: 'Harmattan / First Semester',
    academicYear: '2024/2025',
    totalEnrolled: 185,
    totalResponses: 130,
    overallScore: 4.3,
    criteria: {
      punctuality: 4.6,
      subjectMastery: 4.7,
      communicationClarity: 4.3,
      gradingTransparency: 4.1,
      consultationAvailability: 4.0,
      syllabusCoverageAdherence: 4.1
    },
    syllabusProgressWeeks: 9,
    totalSyllabusWeeks: 14,
    evaluatedByCurrentStudent: true,
    comments: [
      {
        id: 'c_6',
        date: '2025-02-15',
        rating: 5,
        sentiment: 'positive',
        comment: 'Eigenvalue decompositions and singular value decomposition were explained with great physical intuition.'
      }
    ]
  },
  {
    id: 'eval_004',
    courseCode: 'CSC 307',
    courseTitle: 'Artificial Intelligence & Machine Learning Fundamentals',
    creditUnits: 2,
    lecturerId: 'usr_lecturer_1',
    lecturerName: 'Dr. Miriam Adeleke',
    lecturerTitle: 'Senior Lecturer, Ph.D (Manchester)',
    department: 'Computer Science',
    faculty: 'Physical & Computing Sciences',
    semester: 'Harmattan / First Semester',
    academicYear: '2024/2025',
    totalEnrolled: 110,
    totalResponses: 86,
    overallScore: 4.7,
    criteria: {
      punctuality: 4.9,
      subjectMastery: 4.8,
      communicationClarity: 4.6,
      gradingTransparency: 4.6,
      consultationAvailability: 4.4,
      syllabusCoverageAdherence: 4.9
    },
    syllabusProgressWeeks: 10,
    totalSyllabusWeeks: 14,
    evaluatedByCurrentStudent: false,
    comments: [
      {
        id: 'c_7',
        date: '2025-02-17',
        rating: 5,
        sentiment: 'positive',
        comment: 'Hands-on Python notebooks in lab sessions made backpropagation intuitive. Best lecturer in computing!'
      }
    ]
  }
];

export const INITIAL_QA_AUDITS: QAAuditInspection[] = [
  {
    id: 'aud_001',
    auditCode: 'QAD-2025-0391',
    auditDate: '2025-02-18',
    timeSlot: '10:00 AM - 12:00 PM',
    hallName: 'Lecture Theatre A (LT-A)',
    building: 'Faculty of Physical Sciences',
    faculty: 'Physical & Computing Sciences',
    courseCode: 'CSC 301',
    courseTitle: 'Operating Systems',
    scheduledLecturer: 'Dr. Miriam Adeleke',
    actualLecturer: 'Dr. Miriam Adeleke',
    checklist: {
      lecturerPunctuality: 'punctual',
      hallCleanliness: 'compliant',
      seatingAdequacy: 'sufficient',
      audiovisualStatus: 'functional',
      ventilationAndLighting: 'adequate',
      syllabusAvailableToStudents: true,
      continuousAssessmentAnnounced: true,
      studentHeadcount: 124,
      hallCapacity: 150
    },
    overallScorePercentage: 96,
    status: 'passed',
    inspectorName: 'Engr. Bello Ibrahim',
    inspectorRemarks: 'Exemplary lecture delivery. Lecturer was present 5 minutes ahead of scheduled time. Course outline printed and distributed to students. Active two-way interaction noted.'
  },
  {
    id: 'aud_002',
    auditCode: 'QAD-2025-0392',
    auditDate: '2025-02-18',
    timeSlot: '08:00 AM - 10:00 AM',
    hallName: 'Engineering Workshop 2',
    building: 'Block E, Faculty of Engineering',
    faculty: 'Engineering & Technology',
    courseCode: 'MEE 203',
    courseTitle: 'Engineering Drawing & CAD',
    scheduledLecturer: 'Engr. K. Alonge',
    actualLecturer: 'Graduate Assistant (On behalf)',
    checklist: {
      lecturerPunctuality: 'late_10m',
      hallCleanliness: 'minor_litter',
      seatingAdequacy: 'broken_furniture',
      audiovisualStatus: 'faulty',
      ventilationAndLighting: 'fair',
      syllabusAvailableToStudents: true,
      continuousAssessmentAnnounced: false,
      studentHeadcount: 145,
      hallCapacity: 110
    },
    overallScorePercentage: 62,
    status: 'conditional_pass',
    inspectorName: 'Engr. Bello Ibrahim',
    inspectorRemarks: '14 drafting boards missing T-square clips; projector HDMI port broken causing delay in CAD demo. Principal lecturer absent without documented prior clearance.',
    rectificationDeadline: '2025-02-25'
  },
  {
    id: 'aud_003',
    auditCode: 'QAD-2025-0393',
    auditDate: '2025-02-17',
    timeSlot: '12:00 PM - 02:00 PM',
    hallName: 'Management Lecture Theatre 3',
    building: 'Senate South Complex',
    faculty: 'Management & Social Sciences',
    courseCode: 'ACC 301',
    courseTitle: 'Cost & Management Accounting',
    scheduledLecturer: 'Dr. O. F. Oladipo',
    actualLecturer: 'Dr. O. F. Oladipo',
    checklist: {
      lecturerPunctuality: 'punctual',
      hallCleanliness: 'compliant',
      seatingAdequacy: 'sufficient',
      audiovisualStatus: 'functional',
      ventilationAndLighting: 'adequate',
      syllabusAvailableToStudents: true,
      continuousAssessmentAnnounced: true,
      studentHeadcount: 98,
      hallCapacity: 120
    },
    overallScorePercentage: 92,
    status: 'passed',
    inspectorName: 'Dr. Sarah Nnamdi',
    inspectorRemarks: 'Well structured session. Continuous assessment date set for next week and communicated clearly.'
  },
  {
    id: 'aud_004',
    auditCode: 'QAD-2025-0388',
    auditDate: '2025-02-14',
    timeSlot: '02:00 PM - 04:00 PM',
    hallName: 'Old Biology Lab 1',
    building: 'Life Sciences Quadrangle',
    faculty: 'Basic Medical Sciences',
    courseCode: 'BIO 201',
    courseTitle: 'General Cytology & Genetics',
    scheduledLecturer: 'Dr. P. E. Agbo',
    actualLecturer: 'None (Unannounced Absence)',
    checklist: {
      lecturerPunctuality: 'absent',
      hallCleanliness: 'unsanitary',
      seatingAdequacy: 'sufficient',
      audiovisualStatus: 'absent',
      ventilationAndLighting: 'poor_ac_lighting',
      syllabusAvailableToStudents: false,
      continuousAssessmentAnnounced: false,
      studentHeadcount: 85,
      hallCapacity: 100
    },
    overallScorePercentage: 35,
    status: 'non_compliant',
    inspectorName: 'Engr. Bello Ibrahim',
    inspectorRemarks: 'Critical compliance failure. Students waited 45 minutes before dispersing. Laboratory eyewash station obstructed. Escalated immediately to Dean and SERVICOM desk.',
    rectificationDeadline: '2025-02-21'
  }
];

export const SERVICOM_CHARTER_METRICS: ServicomCharterMetric[] = [
  {
    id: 'scm_1',
    serviceTitle: 'Semester Examination Results Publication',
    responsibleUnit: 'Senate & Departmental Exam Boards',
    charterSlaDays: 28,
    averageActualDays: 24.5,
    targetCompliancePercent: 95,
    currentCompliancePercent: 92.4,
    status: 'compliant',
    quarterTrend: '+2.4%'
  },
  {
    id: 'scm_2',
    serviceTitle: 'Official Academic Transcript Issuance',
    responsibleUnit: 'Academic Affairs Registry',
    charterSlaDays: 5,
    averageActualDays: 4.1,
    targetCompliancePercent: 98,
    currentCompliancePercent: 96.8,
    status: 'compliant',
    quarterTrend: '+0.5%'
  },
  {
    id: 'scm_3',
    serviceTitle: 'Student Grievance & Complaint Redressal',
    responsibleUnit: 'Institutional SERVICOM Directorate',
    charterSlaDays: 3,
    averageActualDays: 2.8,
    targetCompliancePercent: 90,
    currentCompliancePercent: 88.5,
    status: 'warning',
    quarterTrend: '-1.8%'
  },
  {
    id: 'scm_4',
    serviceTitle: 'Hostel Maintenance & Electrical Breakdown Redress',
    responsibleUnit: 'Student Affairs & Physical Works',
    charterSlaDays: 2,
    averageActualDays: 3.4,
    targetCompliancePercent: 90,
    currentCompliancePercent: 74.2,
    status: 'breached',
    quarterTrend: '-4.2%'
  },
  {
    id: 'scm_5',
    serviceTitle: 'Continuous Assessment (CA) Mark Display Before Exams',
    responsibleUnit: 'Academic Faculties (Deans Oversight)',
    charterSlaDays: 14,
    averageActualDays: 13.1,
    targetCompliancePercent: 100,
    currentCompliancePercent: 94.0,
    status: 'compliant',
    quarterTrend: '+2.4%'
  }
];

export const FACULTY_SUMMARY_STATS: FacultySummaryStat[] = [
  {
    facultyName: 'Physical & Computing Sciences',
    dean: 'Prof. H. A. Mustapha',
    totalLecturers: 68,
    averageTeachingRating: 4.42,
    qaAuditPassRate: 94.5,
    openComplaints: 4,
    slaBreachRate: 2.1
  },
  {
    facultyName: 'Engineering & Technology',
    dean: 'Prof. T. Adewale',
    totalLecturers: 92,
    averageTeachingRating: 4.15,
    qaAuditPassRate: 88.0,
    openComplaints: 9,
    slaBreachRate: 5.8
  },
  {
    facultyName: 'Management & Social Sciences',
    dean: 'Prof. C. N. Eze',
    totalLecturers: 54,
    averageTeachingRating: 4.28,
    qaAuditPassRate: 91.2,
    openComplaints: 3,
    slaBreachRate: 1.5
  },
  {
    facultyName: 'Environmental Sciences',
    dean: 'Prof. S. B. Olukoya',
    totalLecturers: 42,
    averageTeachingRating: 4.35,
    qaAuditPassRate: 93.0,
    openComplaints: 2,
    slaBreachRate: 1.1
  },
  {
    facultyName: 'Basic Medical Sciences',
    dean: 'Prof. F. K. Braimoh',
    totalLecturers: 61,
    averageTeachingRating: 3.98,
    qaAuditPassRate: 82.4,
    openComplaints: 8,
    slaBreachRate: 7.2
  }
];
