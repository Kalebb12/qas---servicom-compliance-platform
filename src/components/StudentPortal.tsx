import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  CourseEvaluation,
  StudentEvaluationCriteria,
  ComplaintCategory,
  ComplaintPriority,
} from "../types";
import {
  GraduationCap,
  BookOpen,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldAlert,
  Star,
  MessageSquare,
  FileText,
  ChevronRight,
  Lock,
  Search,
  Upload,
  Sparkles,
  Info,
  Check,
  Building,
  UserX,
  Mic,
  Square,
  RotateCcw,
} from "lucide-react";

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEventLike = Event & {
  error: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  processLocally?: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechRecognitionWithLocalSupport = SpeechRecognitionConstructor & {
  available?: (options: {
    langs: string[];
    processLocally?: boolean;
  }) => Promise<"unavailable" | "downloadable" | "downloading" | "available">;
  install?: (options: { langs: string[] }) => Promise<boolean>;
};

const getSpeechRecognition = () => {
  const browserWindow = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return (
    browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition
  );
};

export const StudentPortal: React.FC = () => {
  const {
    currentUser,
    courseEvaluations,
    submitCourseEvaluation,
    complaints,
    submitComplaint,
    rateComplaintResolution,
    activeNav,
    setActiveNav,
    directoryPrefillCategory,
    setDirectoryPrefillCategory,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    "evaluations" | "lodge" | "history"
  >("evaluations");

  // Synchronize internal tabs with global activeNav from sidebar/bottom bar
  useEffect(() => {
    if (activeNav === "lodge") {
      setActiveTab("lodge");
    } else if (activeNav === "track") {
      setActiveTab("history");
    } else if (activeNav === "evaluations" || activeNav === "dashboard") {
      setActiveTab("evaluations");
    }
  }, [activeNav]);

  const handleTabSelect = (tab: "evaluations" | "lodge" | "history") => {
    setActiveTab(tab);
    if (tab === "evaluations") setActiveNav("evaluations");
    else if (tab === "lodge") setActiveNav("lodge");
    else if (tab === "history") setActiveNav("track");
  };

  // Evaluation Modal State
  const [selectedCourseForEval, setSelectedCourseForEval] =
    useState<CourseEvaluation | null>(null);
  const [evalRatings, setEvalRatings] = useState<StudentEvaluationCriteria>({
    punctuality: 5,
    subjectMastery: 5,
    communicationClarity: 4,
    gradingTransparency: 4,
    consultationAvailability: 4,
    syllabusCoverageAdherence: 5,
  });
  const [evalComment, setEvalComment] = useState("");
  const [evalSubmittedSuccess, setEvalSubmittedSuccess] = useState(false);

  // Complaint Form State
  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintCategory, setComplaintCategory] =
    useState<ComplaintCategory>("facility_breakdown");
  const [complaintPriority, setComplaintPriority] =
    useState<ComplaintPriority>("standard");
  const [complaintLocation, setComplaintLocation] = useState("");
  const [complaintFaculty, setComplaintFaculty] = useState(currentUser.faculty);
  const [complaintDept, setComplaintDept] = useState(currentUser.department);
  const [complaintDescription, setComplaintDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentPreviewUrl, setAttachmentPreviewUrl] = useState<
    string | null
  >(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [generatedTrackingCode, setGeneratedTrackingCode] = useState<
    string | null
  >(null);

  // If the student arrived here via "File a complaint about this" from the
  // Service Directory, pre-select the matching category and jump to the form.
  useEffect(() => {
    if (directoryPrefillCategory) {
      setComplaintCategory(directoryPrefillCategory);
      setActiveTab("lodge");
      setActiveNav("lodge");
      setDirectoryPrefillCategory(null);
    }
  }, [directoryPrefillCategory, setActiveNav, setDirectoryPrefillCategory]);
  const [isRecordingComplaint, setIsRecordingComplaint] = useState(false);
  const [isTranscribingComplaint, setIsTranscribingComplaint] = useState(false);
  const [audioRecordingError, setAudioRecordingError] = useState("");
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);
  const confirmedTranscriptRef = React.useRef("");
  // Filter complaints belonging to this student or with studentMatric matching
  const myComplaints = complaints.filter(
    c => c.studentMatric === currentUser.identifier || (!c.isAnonymous && c.studentName === currentUser.name)
  );

  // "Top 3 complaints" trend widget: count complaints by category, scoped to
  // this student's department and separately across the whole university.
  const countByCategory = (list: typeof complaints) => {
    const counts: Record<string, number> = {};
    list.forEach(c => { counts[c.category] = (counts[c.category] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  };
  const topComplaintsInDepartment = countByCategory(
    complaints.filter(c => c.department === currentUser.department)
  );
  const topComplaintsUniversityWide = countByCategory(complaints);

  const handleOpenEval = (course: CourseEvaluation) => {
    setSelectedCourseForEval(course);
    setEvalRatings({
      punctuality: 5,
      subjectMastery: 5,
      communicationClarity: 4,
      gradingTransparency: 4,
      consultationAvailability: 4,
      syllabusCoverageAdherence: 5,
    });
    setEvalComment("");
    setEvalSubmittedSuccess(false);
  };

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForEval) return;
    submitCourseEvaluation(selectedCourseForEval.id, evalRatings, evalComment);
    setEvalSubmittedSuccess(true);
    setTimeout(() => {
      setSelectedCourseForEval(null);
      setEvalSubmittedSuccess(false);
    }, 1800);
  };

  const stopComplaintRecording = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsRecordingComplaint(false);
    setIsTranscribingComplaint(false);
  };

  const startComplaintRecording = async () => {
    const SpeechRecognition = getSpeechRecognition() as
      | SpeechRecognitionWithLocalSupport
      | undefined;
    if (!SpeechRecognition) {
      setAudioRecordingError(
        "Audio transcription is not supported in this browser. You can still type the complaint below.",
      );
      return;
    }

    try {
      const language = "en-US";
      let useLocalRecognition = false;

      if (SpeechRecognition.available) {
        let availability = await SpeechRecognition.available({
          langs: [language],
          processLocally: true,
        });

        if (availability === "downloadable" && SpeechRecognition.install) {
          await SpeechRecognition.install({ langs: [language] });
          availability = await SpeechRecognition.available({
            langs: [language],
            processLocally: true,
          });
        }

        useLocalRecognition = availability === "available";
      }

      const recognition = new SpeechRecognition();

      recognitionRef.current = recognition;
      setAudioRecordingError("");

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;
      if (useLocalRecognition) {
        recognition.processLocally = true;
      }
      recognition.onstart = () => {
        setIsRecordingComplaint(true);
        setIsTranscribingComplaint(true);
      };
      recognition.onresult = (event) => {
        let transcript = "";
        for (
          let index = event.resultIndex;
          index < event.results.length;
          index += 1
        ) {
          transcript += `${event.results[index][0].transcript} `;
        }

        const cleanedTranscript = transcript.trim();
        if (!cleanedTranscript) return;

        setComplaintDescription((previousText) =>
          `${previousText} ${cleanedTranscript}`.trim(),
        );
      };
      recognition.onerror = (event) => {
        if (event.error !== "no-speech" && event.error !== "aborted") {
          setAudioRecordingError(
            event.error === "not-allowed" ||
              event.error === "service-not-allowed"
              ? "Microphone access was blocked. Allow microphone access and try again."
              : event.error === "audio-capture"
                ? "No microphone input is available. Connect or enable a microphone, then try again."
                : event.error === "network"
                  ? "The browser speech service is unavailable. Try Chrome or Edge, or type the complaint manually."
                  : `Speech recognition failed (${event.error}). You can type the complaint manually or try again.`,
          );
        }
        stopComplaintRecording();
      };
      recognition.onend = () => {
        recognitionRef.current = null;
        setIsRecordingComplaint(false);
        setIsTranscribingComplaint(false);
      };
      recognition.start();
    } catch {
      setAudioRecordingError(
        "Microphone access was not granted. You can still type the complaint below.",
      );
      stopComplaintRecording();
    }
  };

  const handleLodgeComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    stopComplaintRecording();
    if (
      !complaintTitle.trim() ||
      !complaintDescription.trim() ||
      !complaintLocation.trim()
    )
      return;

    const code = submitComplaint({
      title: complaintTitle,
      category: complaintCategory,
      priority: complaintPriority,
      location: complaintLocation,
      faculty: complaintFaculty,
      department: complaintDept,
      description: complaintDescription,
      isAnonymous,
      evidenceAttachmentName: attachmentName || undefined,
    });

    setGeneratedTrackingCode(code);
    // Clear form
    setComplaintTitle("");
    setComplaintDescription("");
    setComplaintLocation("");
    setAttachmentName("");
    setAttachmentPreviewUrl(null);
    setAttachmentError("");
  };

  useEffect(() => () => stopComplaintRecording(), []);
  useEffect(
    () => () => {
      if (attachmentPreviewUrl) URL.revokeObjectURL(attachmentPreviewUrl);
    },
    [attachmentPreviewUrl],
  );

  const handleAttachmentChange = (file: File | undefined) => {
    setAttachmentError("");
    if (!file) return;

    const allowedExtensions = [
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
      ".pdf",
      ".doc",
      ".docx",
    ];
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const isAllowedType =
      file.type.startsWith("image/") ||
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type) ||
      allowedExtensions.includes(fileExtension);

    if (!isAllowedType) {
      setAttachmentError("Choose an image, PDF, DOC, or DOCX file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setAttachmentError("Evidence files must be 10 MB or smaller.");
      return;
    }

    setAttachmentName(file.name);
    setAttachmentPreviewUrl(
      file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    );
  };

  const criteriaLabels: {
    key: keyof StudentEvaluationCriteria;
    label: string;
    desc: string;
  }[] = [
    {
      key: "punctuality",
      label: "Punctuality & Timetable Adherence",
      desc: "Arrives promptly and utilizes allocated lecture duration effectively",
    },
    {
      key: "subjectMastery",
      label: "Subject Mastery & Domain Depth",
      desc: "Demonstrates deep conceptual understanding and answers questions authoritatively",
    },
    {
      key: "communicationClarity",
      label: "Communication Clarity & Engagement",
      desc: "Explains complex concepts clearly, engages students, welcomes inquiries",
    },
    {
      key: "gradingTransparency",
      label: "Grading Transparency & Continuous Assessment",
      desc: "Releases test/assignment criteria, returns scripts, provides constructive marks",
    },
    {
      key: "consultationAvailability",
      label: "Availability for Consultation / Office Hours",
      desc: "Accessible during scheduled office hours or electronic academic consultations",
    },
    {
      key: "syllabusCoverageAdherence",
      label: "Syllabus Coverage & Learning Materials",
      desc: "Follows official course outline systematically and provides relevant reading packs",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans text-[#1A2421]">
      {/* Student Welcome Banner */}
      <div className="bg-[#12332F] rounded-2xl p-4 sm:p-6 text-[#FBF9F4] shadow-md relative overflow-hidden border border-[#1A433E]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#2F6E5F]/30 text-[#EFF3F1] text-xs font-medium border border-[#2F6E5F]/50">
                <GraduationCap className="w-3 h-3 text-[#E7A33E]" />
                <span>Student Hub</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1A433E] text-[#EFF3F1]/80 border border-[#275B52]">
                {currentUser.identifier} • {currentUser.department}
              </span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#FBF9F4]">
              Welcome, {currentUser.name}
            </h2>
            <p className="text-xs text-[#EFF3F1]/80 mt-0.5 max-w-2xl font-normal hidden sm:block">
              Your voice drives institutional excellence. Complete semester
              lecturer evaluations confidentially, report service breakdowns,
              and track complaint resolution in real time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="bg-[#1A433E] border border-[#275B52] rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-center flex-1 sm:flex-initial">
              <div className="font-sans text-xl sm:text-2xl font-medium text-[#FBF9F4]">
                {
                  courseEvaluations.filter((c) => c.evaluatedByCurrentStudent)
                    .length
                }
                /{courseEvaluations.length}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#EFF3F1]/70 uppercase tracking-wider font-medium">
                Evaluated
              </div>
            </div>

            <div className="bg-[#1A433E] border border-[#275B52] rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-center flex-1 sm:flex-initial">
              <div className="font-sans text-xl sm:text-2xl font-medium text-[#E7A33E]">
                {myComplaints.length}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#EFF3F1]/70 uppercase tracking-wider font-medium">
                Complaints
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Synchronized with global activeNav) */}
        <div className="flex border-b border-[#1A433E] mt-4 sm:mt-5 gap-1.5 sm:gap-2 text-xs sm:text-sm overflow-x-auto pb-0.5">
          <button
            onClick={() => handleTabSelect("evaluations")}
            className={`flex items-center gap-1.5 pb-2.5 px-2.5 font-medium transition-colors border-b-2 cursor-pointer whitespace-nowrap text-xs ${
              activeTab === "evaluations"
                ? "border-[#E7A33E] text-[#E7A33E]"
                : "border-transparent text-[#EFF3F1]/70 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Course Reviews ({courseEvaluations.length})</span>
          </button>

          <button
            onClick={() => handleTabSelect("lodge")}
            className={`flex items-center gap-1.5 pb-2.5 px-2.5 font-medium transition-colors border-b-2 cursor-pointer whitespace-nowrap text-xs ${
              activeTab === "lodge"
                ? "border-[#E7A33E] text-[#E7A33E]"
                : "border-transparent text-[#EFF3F1]/70 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Make a Complaint</span>
          </button>

          <button
            onClick={() => handleTabSelect("history")}
            className={`flex items-center gap-1.5 pb-2.5 px-2.5 font-medium transition-colors border-b-2 cursor-pointer whitespace-nowrap text-xs ${
              activeTab === "history"
                ? "border-[#E7A33E] text-[#E7A33E]"
                : "border-transparent text-[#EFF3F1]/70 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Track Complaints ({myComplaints.length})</span>
          </button>
        </div>
            </div>

      {/* Top Complaints Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#CBDAD6] p-4">
          <h4 className="text-xs font-bold text-[#12332F] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#2F6E5F]" />
            Top Complaints — {currentUser.department}
          </h4>
          {topComplaintsInDepartment.length === 0 ? (
            <p className="text-xs text-slate-400">No complaints logged for this department yet.</p>
          ) : (
            <div className="space-y-2.5">
              {topComplaintsInDepartment.map(([category, count], idx) => (
                <div key={category} className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    idx === 0 ? 'bg-[#E7A33E] text-[#12332F]' : idx === 1 ? 'bg-slate-300 text-slate-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-medium text-slate-700 capitalize truncate">{category.replace(/_/g, ' ')}</span>
                      <span className="text-slate-500 font-mono shrink-0 ml-2">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2F6E5F]" style={{ width: `${(count / topComplaintsInDepartment[0][1]) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#CBDAD6] p-4">
          <h4 className="text-xs font-bold text-[#12332F] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#E7A33E]" />
            Top Complaints — UNILAG-Wide
          </h4>
          {topComplaintsUniversityWide.length === 0 ? (
            <p className="text-xs text-slate-400">No complaints logged yet.</p>
          ) : (
            <div className="space-y-2.5">
              {topComplaintsUniversityWide.map(([category, count], idx) => (
                <div key={category} className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    idx === 0 ? 'bg-[#E7A33E] text-[#12332F]' : idx === 1 ? 'bg-slate-300 text-slate-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-medium text-slate-700 capitalize truncate">{category.replace(/_/g, ' ')}</span>
                      <span className="text-slate-500 font-mono shrink-0 ml-2">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E7A33E]" style={{ width: `${(count / topComplaintsUniversityWide[0][1]) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab 1: Course & Lecturer Evaluations */}
      {activeTab === "evaluations" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Registered Courses for Quality Review
              </h3>
              <p className="text-xs text-slate-500">
                Harmattan Semester 2024/2025 • Department of Computer Science
                (300 Level)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Anonymous & Secure</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseEvaluations.map((course) => {
              const isDone = course.evaluatedByCurrentStudent;
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 font-mono">
                          {course.courseCode}
                        </span>
                        <span className="ml-2 text-xs text-slate-500">
                          {course.creditUnits} Units
                        </span>
                        <h4 className="font-bold text-slate-900 text-base mt-1">
                          {course.courseTitle}
                        </h4>
                      </div>
                      {isDone ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Evaluated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Review
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Instructor:</span>
                        <span className="font-medium text-slate-800">
                          {course.lecturerName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">
                          Syllabus Milestone:
                        </span>
                        <span className="font-medium text-slate-800">
                          Week {course.syllabusProgressWeeks} of{" "}
                          {course.totalSyllabusWeeks} (
                          {Math.round(
                            (course.syllabusProgressWeeks /
                              course.totalSyllabusWeeks) *
                              100,
                          )}
                          %)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Class Aggregate:</span>
                        <span className="font-semibold text-slate-900 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {course.overallScore} / 5.0 ({course.totalResponses}{" "}
                          students)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Harmattan Exam Clearance Metric
                    </span>
                    <button
                      onClick={() => handleOpenEval(course)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isDone
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                      }`}
                    >
                      <span>
                        {isDone ? "Update Evaluation" : "Evaluate Lecturer"}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Make a Complaint */}
      {activeTab === "lodge" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl mx-auto">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Make a Complaint / Report a Service Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Formal reporting under the Institutional Quality & Service
                  Compact Charter
                </p>
              </div>
              <div className="bg-amber-50 text-amber-800 text-xs px-2.5 py-1 rounded-lg border border-amber-200 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Standard SLA: 24h - 72h Resolution</span>
              </div>
            </div>
          </div>

          {generatedTrackingCode ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900 text-lg">
                  Complaint Submitted Successfully
                </h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Your case docket has been registered with the SERVICOM Nodal
                  Desk.
                </p>
              </div>

              <div className="inline-block bg-white border border-emerald-300 rounded-lg px-4 py-2">
                <span className="text-xs text-slate-500 block">
                  Permanent Tracking Reference
                </span>
                <span className="text-lg font-mono font-bold text-slate-900 tracking-wider">
                  {generatedTrackingCode}
                </span>
              </div>

              <div className="text-xs text-slate-600 max-w-md mx-auto">
                You can monitor officer assignments, investigation notes, and
                resolution status on your dashboard using this code.
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setGeneratedTrackingCode(null);
                    setActiveTab("history");
                  }}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  View in My Complaints List
                </button>
                <button
                  onClick={() => setGeneratedTrackingCode(null)}
                  className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLodgeComplaint} className="space-y-5">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Complaint Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    {
                      id: "lecture_delivery",
                      label: "Lecture Delivery & Absenteeism",
                    },
                    {
                      id: "missing_grades",
                      label: "Missing Grades & CA Marks",
                    },
                    {
                      id: "facility_breakdown",
                      label: "Facility, Hall & Seating",
                    },
                    {
                      id: "harassment_victimization",
                      label: "Victimization / Harassment",
                    },

                    {
                      id: "library_labs",
                      label: "Laboratory / Equipment Fault",
                    },
                    {
                      id: "administrative_delay",
                      label: "Registry / Transcript Delay",
                    },
                    {
                      id: "security_welfare",
                      label: "Security / Health & Welfare",
                    },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() =>
                        setComplaintCategory(cat.id as ComplaintCategory)
                      }
                      className={`p-2.5 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                        complaintCategory === cat.id
                          ? "border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    2. Specific Issue / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Projector audio failed repeatedly during PHY 305"
                    value={complaintTitle}
                    onChange={(e) => setComplaintTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Priority Level
                  </label>
                  <select
                    value={complaintPriority}
                    onChange={(e) =>
                      setComplaintPriority(e.target.value as ComplaintPriority)
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="standard">Standard (72h SLA)</option>
                    <option value="high">High (48h SLA)</option>
                    <option value="urgent">Urgent / Safety (24h SLA)</option>
                  </select>
                </div>
              </div>

              {/* Location, Faculty & Dept */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location / Venue *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NLH-1, Engineering Block B"
                    value={complaintLocation}
                    onChange={(e) => setComplaintLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Faculty
                  </label>
                  <select
                    value={complaintFaculty}
                    onChange={(e) => setComplaintFaculty(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Physical & Computing Sciences">
                      Physical & Computing Sciences
                    </option>
                    <option value="Engineering & Technology">
                      Engineering & Technology
                    </option>
                    <option value="Management & Social Sciences">
                      Management & Social Sciences
                    </option>
                    <option value="Basic Medical Sciences">
                      Basic Medical Sciences
                    </option>
                    <option value="Environmental Sciences">
                      Environmental Sciences
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={complaintDept}
                    onChange={(e) => setComplaintDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Incident Details & Evidence Narrative *
                  </label>
                  <span className="text-[10px] font-medium text-slate-500 normal-case tracking-normal">
                    Type or speak your complaint
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide precise details, or use Record Complaint to explain the issue verbally..."
                  value={complaintDescription}
                  onChange={(e) => setComplaintDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white leading-relaxed"
                />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {!isRecordingComplaint ? (
                    <button
                      type="button"
                      onClick={startComplaintRecording}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      Record Complaint
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopComplaintRecording}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Square className="w-3 h-3 fill-current" />
                      Stop & Review
                    </button>
                  )}

                  {complaintDescription && !isRecordingComplaint && (
                    <button
                      type="button"
                      onClick={() => {
                        setComplaintDescription("");
                        confirmedTranscriptRef.current = "";
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Clear Transcript
                    </button>
                  )}

                  {isRecordingComplaint && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-red-600 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      {isTranscribingComplaint
                        ? "Listening and transcribing..."
                        : "Recording stopped"}
                    </span>
                  )}
                </div>
                {audioRecordingError && (
                  <p className="mt-2 text-xs text-red-600" role="alert">
                    {audioRecordingError}
                  </p>
                )}
                {complaintDescription &&
                  !isRecordingComplaint &&
                  !audioRecordingError && (
                    <p className="mt-2 text-[11px] text-slate-500">
                      Review and edit the transcript above before submitting
                      your complaint.
                    </p>
                  )}
              </div>

              {/* Supporting evidence */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Attach Evidence{" "}
                  <span className="font-normal normal-case text-slate-500">
                    (optional)
                  </span>
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl bg-slate-50 p-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label
                      htmlFor="complaint-evidence"
                      className="inline-flex items-center gap-2 px-3 py-2 text-xs bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-semibold cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Choose file
                    </label>
                    <input
                      id="complaint-evidence"
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) =>
                        handleAttachmentChange(e.target.files?.[0])
                      }
                      className="sr-only"
                    />
                    <span className="text-[11px] text-slate-500">
                      Screenshot, document, image, or PDF · max 10 MB
                    </span>
                  </div>

                  {attachmentName && (
                    <div className="mt-3 flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-2">
                      {attachmentPreviewUrl ? (
                        <img
                          src={attachmentPreviewUrl}
                          alt="Selected evidence preview"
                          className="w-12 h-12 rounded object-cover border border-slate-200"
                        />
                      ) : (
                        <FileText className="w-8 h-8 p-1.5 rounded bg-slate-100 text-slate-500" />
                      )}
                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">
                        {attachmentName}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachmentName("");
                          setAttachmentPreviewUrl(null);
                        }}
                        className="text-xs text-slate-500 hover:text-rose-600 cursor-pointer"
                        aria-label="Remove selected evidence"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <p className="mt-2 text-[11px] text-slate-500 flex items-start gap-1.5">
                    <Lock className="w-3 h-3 mt-0.5 shrink-0 text-emerald-600" />
                    Choose only evidence needed for this complaint. The file is
                    previewed in this browser and only its filename is saved
                    with the local demo docket.
                  </p>
                  {attachmentError && (
                    <p className="mt-2 text-[11px] text-rose-600" role="alert">
                      {attachmentError}
                    </p>
                  )}
                </div>
              </div>

              {/* Anonymous Whistleblower Protection */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="anonymous-toggle"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor="anonymous-toggle"
                  className="text-xs text-slate-700 cursor-pointer select-none"
                >
                  <span className="font-bold block text-slate-900">
                    File as Confidential / Whistleblower Complaint
                  </span>
                  Your name ({currentUser.name}) and matric (
                  {currentUser.identifier}) will be stripped from the case
                  dossier forwarded to department heads and lecturers. Only the
                  SERVICOM Ombudsman desk maintains encrypted audit logs.
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Protected under University SERVICOM Charter §14</span>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit to SERVICOM Desk</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Track My Complaints */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                My Registered Complaint Dockets
              </h3>
              <p className="text-xs text-slate-500">
                Track investigation milestones, assigned officers, and SLA
                resolution deadlines
              </p>
            </div>
            <button
              onClick={() => setActiveTab("lodge")}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              + Lodge New Issue
            </button>
          </div>

          {myComplaints.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                No active complaints on file
              </p>
              <p className="text-xs text-slate-400 mt-1">
                You haven't filed any issues yet this semester, or submitted
                issues were filed anonymously.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myComplaints.map((item) => {
                const isOverdue = item.isSlaBreached;
                const isResolved =
                  item.status === "resolved" || item.status === "closed";

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            {item.trackingCode}
                          </span>
                          <span
                            className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                              item.priority === "urgent"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : item.priority === "high"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {item.priority} Priority
                          </span>
                          {item.isAnonymous && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              <UserX className="w-3 h-3" />
                              Anonymous
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900 text-base mt-2">
                          {item.title}
                        </h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Location: {item.location} • Filed on{" "}
                          {item.submittedAt}
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${
                            isResolved
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : isOverdue
                                ? "bg-rose-100 text-rose-800 border border-rose-300"
                                : "bg-indigo-100 text-indigo-800 border border-indigo-200"
                          }`}
                        >
                          Status: {item.status.replace("_", " ").toUpperCase()}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {isResolved
                            ? "Case Resolution Complete"
                            : isOverdue
                              ? "SLA Target Breached (Escalated to DVC)"
                              : `SLA Clock: ${item.slaHoursRemaining}h remaining`}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                      "{item.description}"
                    </p>

                    {/* Progress Step Indicator */}
                    <div className="pt-2">
                      <div className="text-xs font-semibold text-slate-700 mb-2">
                        Docket Workflow Progress:
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                        {[
                          { label: "Submitted", done: true },
                          {
                            label: "SERVICOM Triage",
                            done: item.status !== "submitted",
                          },
                          {
                            label: "Investigation / Action",
                            done: [
                              "investigating",
                              "action_taken",
                              "resolved",
                              "closed",
                            ].includes(item.status),
                          },
                          { label: "Resolution Offered", done: isResolved },
                        ].map((step, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg border ${
                              step.done
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold"
                                : "bg-slate-50 border-slate-200 text-slate-400"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              {step.done && (
                                <Check className="w-3 h-3 text-emerald-600" />
                              )}
                              <span>{step.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resolution & Rating */}
                    {item.resolutionSummary && (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Official Institutional Resolution:</span>
                        </div>
                        <p className="text-xs text-emerald-950 leading-relaxed">
                          {item.resolutionSummary}
                        </p>

                        {/* Rate resolution */}
                        <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs text-emerald-900 font-medium">
                            How satisfied are you with this redress?
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() =>
                                  rateComplaintResolution(item.id, star)
                                }
                                className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                title={`${star} Stars`}
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    (item.studentSatisfactionRating || 0) >=
                                    star
                                      ? "fill-amber-400 text-amber-500"
                                      : "text-slate-300"
                                  }`}
                                />
                              </button>
                            ))}
                            {item.studentSatisfactionRating && (
                              <span className="text-xs text-emerald-800 font-bold ml-1">
                                ({item.studentSatisfactionRating}/5 Registered)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Interactive Evaluation Modal */}
      {selectedCourseForEval && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-linear-to-r from-blue-900 to-indigo-900 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase bg-blue-500/30 px-2 py-0.5 rounded font-bold">
                  {selectedCourseForEval.courseCode} Evaluation
                </span>
                <h3 className="font-bold text-lg mt-1">
                  {selectedCourseForEval.courseTitle}
                </h3>
                <p className="text-xs text-blue-200">
                  Lecturer: {selectedCourseForEval.lecturerName} (
                  {selectedCourseForEval.lecturerTitle})
                </p>
              </div>
              <button
                onClick={() => setSelectedCourseForEval(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {evalSubmittedSuccess ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Evaluation Submitted Confidentially
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your feedback has been integrated into the Department Quality
                  Assurance score and lecturer teaching improvement index.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitEvaluation}
                className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      Confidential Student Evaluation of Teaching (SET):{" "}
                    </span>
                    Scores are strictly aggregated with the entire class before
                    being presented to the lecturer and Quality Assurance
                    Committee.
                  </div>
                </div>

                {/* 6 Criteria Sliders / Radio buttons */}
                <div className="space-y-4">
                  {criteriaLabels.map((crit) => {
                    const currentVal = evalRatings[crit.key];
                    return (
                      <div
                        key={crit.key}
                        className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800">
                            {crit.label}
                          </label>
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                            {currentVal} / 5
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {crit.desc}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              type="button"
                              key={val}
                              onClick={() =>
                                setEvalRatings((prev) => ({
                                  ...prev,
                                  [crit.key]: val,
                                }))
                              }
                              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                currentVal === val
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                              }`}
                            >
                              {val}{" "}
                              {val === 5
                                ? "★ Excellent"
                                : val === 1
                                  ? "Poor"
                                  : ""}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Qualitative Comment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Constructive Comments / Suggestions for the Instructor
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Highlight what worked well, and constructive recommendations for teaching improvement..."
                    value={evalComment}
                    onChange={(e) => setEvalComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedCourseForEval(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Official Evaluation</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
