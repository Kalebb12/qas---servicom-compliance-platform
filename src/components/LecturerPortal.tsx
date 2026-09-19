import * as React from "react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import {
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Star,
  FileCheck,
  Send,
  Calendar,
  ClipboardList,
  Sparkles,
  Users,
  Target,
  Plus,
  Trash2,
  ThumbsUp,
  Clock,
} from "lucide-react";

export const LecturerPortal: React.FC = () => {
  const {
    currentUser,
    courseEvaluations,
    submitActionPlan,
    qaAudits,
    activeNav,
  } = useApp();

  useEffect(() => {
    const targetId =
      activeNav === "lodge"
        ? "lecturer-action-plan"
        : activeNav === "track"
          ? "lecturer-qa-audits"
          : activeNav === "evaluations"
            ? "lecturer-course-reviews"
            : "lecturer-overview";
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeNav]);

  // Filter courses taught by Dr. Miriam Adeleke (or all courses if switching view)
  const myCourses = courseEvaluations.filter(
    (c) =>
      c.lecturerId === currentUser.id || c.lecturerName.includes("Adeleke"),
  );
  const activeCourses =
    myCourses.length > 0 ? myCourses : courseEvaluations.slice(0, 2);

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    activeCourses[0]?.id || "",
  );
  const selectedCourse =
    activeCourses.find((c) => c.id === selectedCourseId) || activeCourses[0];

  // Action plan builder state
  const [newGoal, setNewGoal] = useState("");
  const [actionGoals, setActionGoals] = useState<string[]>(
    selectedCourse?.actionPlan?.improvementGoals || [
      "Incorporate weekly virtual office hours for difficult programming topics",
      "Distribute grading rubrics alongside continuous assessment assignments",
    ],
  );

  // Audits involving this lecturer
  const myAudits = qaAudits.filter(
    (a) =>
      a.scheduledLecturer.includes("Adeleke") ||
      a.actualLecturer.includes("Adeleke"),
  );

  // Calculate overall metrics
  const totalStudentsEvaluated = activeCourses.reduce(
    (acc, c) => acc + c.totalResponses,
    0,
  );
  const averageOverallScore =
    activeCourses.length > 0
      ? Number(
          (
            activeCourses.reduce((acc, c) => acc + c.overallScore, 0) /
            activeCourses.length
          ).toFixed(2),
        )
      : 4.6;

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    setActionGoals((prev) => [...prev, newGoal.trim()]);
    setNewGoal("");
  };

  const handleRemoveGoal = (index: number) => {
    setActionGoals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveActionPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    submitActionPlan(selectedCourse.id, actionGoals);
  };

  return (
    <div
      id="lecturer-overview"
      className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans text-[#1A2421]"
    >
      {/* Lecturer Header Profile Banner */}
      <div className="bg-[#12332F] rounded-2xl p-6 sm:p-7 text-[#FBF9F4] shadow-md border border-[#1A433E] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-[#E7A33E] shadow-md shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2F6E5F]/30 text-[#EFF3F1] text-xs font-medium mb-1 border border-[#2F6E5F]/50">
                <Award className="w-3.5 h-3.5 text-[#E7A33E]" />
                <span>Faculty Performance & Quality Development Scorecard</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#FBF9F4]">
                {currentUser.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#EFF3F1]/80 mt-0.5">
                {currentUser.roleTitle} • {currentUser.department}
              </p>
              <div className="text-[11px] text-[#EFF3F1]/70 font-mono mt-1">
                Staff Ref: {currentUser.identifier} | Senate QA Clearance: In
                Good Standing
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#1A433E] border border-[#275B52] rounded-xl px-4 py-3 text-center">
              <div className="font-sans text-2xl font-medium text-[#E7A33E] flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-[#E7A33E] text-[#E7A33E]" />
                {averageOverallScore}
              </div>
              <div className="text-[11px] text-[#EFF3F1]/70 uppercase tracking-wider font-medium">
                Teaching Effectiveness (Top 5%)
              </div>
            </div>

            <div className="bg-[#1A433E] border border-[#275B52] rounded-xl px-4 py-3 text-center">
              <div className="font-sans text-2xl font-medium text-[#FBF9F4]">
                {totalStudentsEvaluated}
              </div>
              <div className="text-[11px] text-[#EFF3F1]/70 uppercase tracking-wider font-medium">
                Student Responses
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#CBDAD6] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#526460] mb-2">
            <span>Pedagogical Rating</span>
            <Award className="w-4 h-4 text-[#2F6E5F]" />
          </div>
          <div className="text-2xl font-medium text-[#1A2421]">
            {averageOverallScore}{" "}
            <span className="text-xs text-[#526460] font-normal">/ 5.0</span>
          </div>
          <div className="text-xs text-[#2F6E5F] font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +0.3 above Department Average (4.32)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#CBDAD6] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#526460] mb-2">
            <span>Timetable Attendance Rate</span>
            <Clock className="w-4 h-4 text-[#2F6E5F]" />
          </div>
          <div className="text-2xl font-medium text-[#1A2421]">97.8%</div>
          <div className="text-xs text-[#2F6E5F] font-medium mt-1">
            Verified by QAD Biometric & Spot Audits
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#CBDAD6] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#526460] mb-2">
            <span>Syllabus Pacing Milestone</span>
            <Target className="w-4 h-4 text-[#2F6E5F]" />
          </div>
          <div className="text-2xl font-medium text-[#1A2421]">
            Week 10 / 14
          </div>
          <div className="text-xs text-[#526460] mt-1">
            71.4% Curriculum Covered (On Track)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#CBDAD6] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#526460] mb-2">
            <span>QA Audit Score (Lecture Hall)</span>
            <FileCheck className="w-4 h-4 text-[#2F6E5F]" />
          </div>
          <div className="text-2xl font-medium text-[#2F6E5F]">96%</div>
          <div className="text-xs text-[#526460] mt-1">
            Audited by Engr. Bello Ibrahim (Passed)
          </div>
        </div>
      </div>

      {/* Main Course Selector & Deep Dive */}
      <div
        id="lecturer-course-reviews"
        className="bg-white rounded-2xl border border-[#CBDAD6] p-6 shadow-xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBDAD6] pb-4">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1A2421]">
              Assigned Courses & Student Evaluation Dimensions
            </h3>
            <p className="text-xs text-[#526460]">
              Detailed breakdown of student perceptions, grading transparency,
              and classroom pacing
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeCourses.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCourseId(c.id);
                  setActionGoals(c.actionPlan?.improvementGoals || []);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCourse?.id === c.id
                    ? "bg-[#12332F] text-[#FBF9F4] shadow-xs"
                    : "bg-[#EFF3F1] text-[#1A2421] hover:bg-[#E2EBE8]"
                }`}
              >
                {c.courseCode} ({c.overallScore} ★)
              </button>
            ))}
          </div>
        </div>

        {selectedCourse && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Dimensions & Comments */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Title Banner */}
              <div className="bg-[#EFF3F1] p-4 rounded-xl border border-[#CBDAD6] flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#12332F] bg-white px-2 py-0.5 rounded border border-[#CBDAD6]">
                    {selectedCourse.courseCode} • {selectedCourse.creditUnits}{" "}
                    Units
                  </span>
                  <h4 className="font-serif text-base font-semibold text-[#1A2421] mt-1">
                    {selectedCourse.courseTitle}
                  </h4>
                  <p className="text-xs text-[#526460] mt-0.5">
                    {selectedCourse.totalResponses} out of{" "}
                    {selectedCourse.totalEnrolled} enrolled students evaluated (
                    {Math.round(
                      (selectedCourse.totalResponses /
                        selectedCourse.totalEnrolled) *
                        100,
                    )}
                    % turnout)
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-medium text-[#1A2421] flex items-center gap-1 justify-end">
                    <Star className="w-5 h-5 fill-[#E7A33E] text-[#E7A33E]" />
                    {selectedCourse.overallScore}
                  </div>
                  <span className="text-[11px] text-[#2F6E5F] font-semibold">
                    Exemplary Tier
                  </span>
                </div>
              </div>

              {/* 6 Pedagogical Dimensions Bar chart */}
              <div className="space-y-3">
                <h5 className="font-serif text-sm font-semibold text-[#1A2421]">
                  Pedagogical Criteria Breakdown
                </h5>

                {[
                  {
                    name: "Punctuality & Timetable Adherence",
                    val: selectedCourse.criteria.punctuality,
                    benchmark: 4.2,
                  },
                  {
                    name: "Subject Mastery & Command of Content",
                    val: selectedCourse.criteria.subjectMastery,
                    benchmark: 4.4,
                  },
                  {
                    name: "Communication Clarity & Engagement",
                    val: selectedCourse.criteria.communicationClarity,
                    benchmark: 4.0,
                  },
                  {
                    name: "Grading Transparency & CA Feedback",
                    val: selectedCourse.criteria.gradingTransparency,
                    benchmark: 3.8,
                  },
                  {
                    name: "Consultation & Office Hours Availability",
                    val: selectedCourse.criteria.consultationAvailability,
                    benchmark: 3.9,
                  },
                  {
                    name: "Syllabus Adherence & Learning Resources",
                    val: selectedCourse.criteria.syllabusCoverageAdherence,
                    benchmark: 4.1,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-[#1A2421]">
                        {item.name}
                      </span>
                      <span className="font-semibold text-[#1A2421]">
                        {item.val} / 5.0
                      </span>
                    </div>
                    <div className="w-full bg-[#EFF3F1] rounded-full h-2.5 overflow-hidden flex border border-[#CBDAD6]/50">
                      <div
                        className="bg-[#2F6E5F] h-full rounded-full transition-all duration-500"
                        style={{ width: `${(item.val / 5) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#526460]">
                      <span>Dept Average: {item.benchmark}</span>
                      <span>Institutional Benchmark: 4.00</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Anonymized Qualitative Feedback */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-serif text-sm font-semibold text-[#1A2421] flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#2F6E5F]" />
                    <span>
                      Student Qualitative Voice & Constructive Insights
                    </span>
                  </h5>
                  <span className="text-[11px] text-[#526460]">
                    Anonymized & Moderated for Growth
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedCourse.comments.map((comm) => (
                    <div
                      key={comm.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        comm.sentiment === "positive"
                          ? "bg-[#2F6E5F]/5 border-[#2F6E5F]/30"
                          : comm.sentiment === "constructive"
                            ? "bg-[#E7A33E]/10 border-[#E7A33E]/30"
                            : "bg-[#EFF3F1] border-[#CBDAD6]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(comm.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-[#E7A33E] text-[#E7A33E]"
                            />
                          ))}
                          <span
                            className={`ml-1 text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                              comm.sentiment === "positive"
                                ? "bg-[#2F6E5F]/15 text-[#2F6E5F]"
                                : "bg-[#E7A33E]/20 text-[#8F5A0E]"
                            }`}
                          >
                            {comm.sentiment === "constructive"
                              ? "Area to strengthen"
                              : "Commended"}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#526460]">
                          {comm.date}
                        </span>
                      </div>
                      <p className="text-[#1A2421] leading-relaxed italic">
                        "{comm.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Continuous Improvement Action Plan */}
            <div className="space-y-6">
              <div
                id="lecturer-action-plan"
                className="bg-[#EFF3F1] rounded-xl border border-[#CBDAD6] p-5 space-y-4"
              >
                <div className="border-b border-[#CBDAD6] pb-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#12332F] uppercase tracking-wider">
                    <Target className="w-4 h-4 text-[#2F6E5F]" />
                    <span>Areas to Strengthen & Action Plan</span>
                  </div>
                  <p className="text-xs text-[#526460] mt-1">
                    Semester growth targets for continuous pedagogical
                    development and departmental collaboration.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#1A2421] block">
                    Actionable Growth Objectives:
                  </label>

                  {actionGoals.map((goal, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#CBDAD6] text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#2F6E5F] shrink-0 mt-0.5" />
                      <span className="flex-1 text-[#1A2421]">{goal}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(idx)}
                        className="text-[#526460] hover:text-[#B93826] p-0.5 cursor-pointer"
                        title="Remove goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add goal (e.g. distribute assignment rubrics 1 week prior)..."
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddGoal();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-[#CBDAD6] rounded-lg bg-white text-[#1A2421]"
                    />
                    <button
                      type="button"
                      onClick={handleAddGoal}
                      className="px-3 py-1.5 bg-[#12332F] hover:bg-[#1A433E] text-[#FBF9F4] text-xs font-medium rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#CBDAD6] flex items-center justify-between">
                  <span className="text-[11px] text-[#526460]">
                    Status:{" "}
                    <strong className="text-[#2F6E5F] font-semibold">
                      {selectedCourse.actionPlan?.status
                        ? selectedCourse.actionPlan.status
                            .replace("_", " ")
                            .toUpperCase()
                        : "PENDING"}
                    </strong>
                  </span>
                  <button
                    onClick={handleSaveActionPlan}
                    className="px-4 py-2 bg-[#2F6E5F] hover:bg-[#26594D] text-[#FBF9F4] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit to HOD</span>
                  </button>
                </div>

                {selectedCourse.actionPlan?.hodFeedback && (
                  <div className="bg-[#2F6E5F]/10 border border-[#2F6E5F]/30 rounded-lg p-3 text-xs text-[#12332F]">
                    <strong>HOD Formal Endorsement:</strong>{" "}
                    {selectedCourse.actionPlan.hodFeedback}
                  </div>
                )}
              </div>

              {/* Recent QA Peer Classroom Visit */}
              <div
                id="lecturer-qa-audits"
                className="bg-white rounded-xl border border-[#CBDAD6] p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-serif text-sm font-semibold text-[#1A2421] flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#2F6E5F]" />
                    <span>Peer QA Observation Visit</span>
                  </h5>
                  <span className="text-xs font-medium text-[#2F6E5F] bg-[#2F6E5F]/15 px-2 py-0.5 rounded">
                    Score: 96%
                  </span>
                </div>

                <div className="text-xs text-[#526460] space-y-1">
                  <div>
                    <strong className="text-[#1A2421]">Auditor:</strong> Engr.
                    Bello Ibrahim (Senior QA Auditor)
                  </div>
                  <div>
                    <strong className="text-[#1A2421]">Venue:</strong> Lecture
                    Theatre A (LT-A)
                  </div>
                  <div>
                    <strong className="text-[#1A2421]">Date:</strong> 2025-02-18
                    (Harmattan Week 9)
                  </div>
                  <div className="bg-[#EFF3F1] p-2.5 rounded-lg border border-[#CBDAD6] italic mt-2 text-[#1A2421]">
                    "Exemplary lecture delivery. Lecturer arrived promptly and
                    paced content effectively. Strong student engagement and
                    clear worked examples observed."
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
