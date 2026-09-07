import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
} from "../types";
import {
  LifeBuoy,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Send,
  ShieldAlert,
  MessageSquare,
  ArrowUpRight,
  ChevronRight,
  UserCheck,
  UserX,
  FileText,
  Building,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  Scale,
} from "lucide-react";

export const ServicomPortal: React.FC = () => {
  const {
    currentUser,
    complaints,
    updateComplaintStatus,
    addComplaintInvestigationNote,
    charterMetrics,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"dockets" | "charter">("dockets");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected complaint dossier for modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null,
  );
  const [newStatus, setNewStatus] = useState<ComplaintStatus>("investigating");
  const [newResolutionSummary, setNewResolutionSummary] = useState("");
  const [newInvestigationNote, setNewInvestigationNote] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);

  const openComplaintDossier = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setNewResolutionSummary(complaint.resolutionSummary || "");
    setNewInvestigationNote("");
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    updateComplaintStatus(
      selectedComplaint.id,
      newStatus,
      newResolutionSummary,
    );
    setSelectedComplaint((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            resolutionSummary: newResolutionSummary,
          }
        : null,
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !newInvestigationNote.trim()) return;
    addComplaintInvestigationNote(
      selectedComplaint.id,
      newInvestigationNote.trim(),
      isInternalNote,
    );

    // Add locally to immediate display
    const newNoteObj = {
      id: `note_${Date.now()}`,
      author: currentUser.name,
      role: currentUser.roleTitle,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      note: newInvestigationNote.trim(),
      isInternalOnly: isInternalNote,
    };

    setSelectedComplaint((prev) =>
      prev
        ? {
            ...prev,
            investigationNotes: [...prev.investigationNotes, newNoteObj],
          }
        : null,
    );

    setNewInvestigationNote("");
  };

  const handleEscalateToDVC = () => {
    if (!selectedComplaint) return;
    updateComplaintStatus(
      selectedComplaint.id,
      "escalated",
      "Escalated formally to Office of the Deputy Vice-Chancellor (Academic) & Deanery for urgent Senate intervention.",
    );
    setSelectedComplaint((prev) =>
      prev ? { ...prev, status: "escalated" } : null,
    );
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || c.priority === filterPriority;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.studentName &&
        c.studentName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const totalCount = complaints.length;
  const activeCount = complaints.filter(
    (c) => c.status !== "resolved" && c.status !== "closed",
  ).length;
  const breachedCount = complaints.filter(
    (c) => c.isSlaBreached && c.status !== "resolved" && c.status !== "closed",
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "resolved" || c.status === "closed",
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans text-[#1A2421]">
      {/* Header Banner */}
      <div className="bg-[#12332F] rounded-2xl p-6 sm:p-7 text-[#FBF9F4] shadow-md border border-[#1A433E] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2F6E5F]/30 text-[#EFF3F1] text-xs font-medium mb-1 border border-[#2F6E5F]/50">
              <LifeBuoy className="w-3.5 h-3.5 text-[#E7A33E]" />
              <span>Institutional SERVICOM Nodal Directorate</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#FBF9F4]">
              Complaint Resolution & Service Compact Control Tower
            </h2>
            <p className="text-xs sm:text-sm text-[#EFF3F1]/80 mt-0.5">
              Officer: {currentUser.name} • Service Compact Compliance, Student
              Rights, Timely Resolution
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#1A433E] border border-[#275B52] rounded-xl px-4 py-3 text-center">
              <div className="font-sans text-2xl font-medium text-[#E7A33E]">
                {activeCount}
              </div>
              <div className="text-[11px] text-[#EFF3F1]/70 uppercase tracking-wider font-medium">
                Active Dockets
              </div>
            </div>

            <div className="bg-[#1A433E] border border-[#275B52] rounded-xl px-4 py-3 text-center">
              <div className="font-sans text-2xl font-medium text-[#B93826]">
                {breachedCount}
              </div>
              <div className="text-[11px] text-[#EFF3F1]/70 uppercase tracking-wider font-medium">
                SLA Breaches
              </div>
            </div>

            <div className="bg-[#1A433E] border border-[#275B52] rounded-xl px-4 py-3 text-center">
              <div className="font-sans text-2xl font-medium text-[#2F6E5F]">
                {resolvedCount}
              </div>
              <div className="text-[11px] text-[#EFF3F1]/70 uppercase tracking-wider font-medium">
                Resolved Cases
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1A433E] mt-6 gap-2 text-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab("dockets")}
            className={`flex items-center gap-2 pb-3 px-3 font-medium transition-colors border-b-2 cursor-pointer whitespace-nowrap text-xs sm:text-sm ${
              activeTab === "dockets"
                ? "border-[#E7A33E] text-[#E7A33E]"
                : "border-transparent text-[#EFF3F1]/70 hover:text-white"
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Complaints & Triage ({complaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("charter")}
            className={`flex items-center gap-2 pb-3 px-3 font-medium transition-colors border-b-2 cursor-pointer whitespace-nowrap text-xs sm:text-sm ${
              activeTab === "charter"
                ? "border-[#E7A33E] text-[#E7A33E]"
                : "border-transparent text-[#EFF3F1]/70 hover:text-white"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Institutional Service Charter Metrics</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Dockets & Triage */}
      {activeTab === "dockets" && (
        <div className="space-y-4">
          {/* Filter and Search controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by tracking code (SRV-...), keyword, student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500 bg-slate-50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="all">All ({complaints.length})</option>
                  <option value="submitted">New / Submitted</option>
                  <option value="triaged">Triaged</option>
                  <option value="investigating">Under Investigation</option>
                  <option value="action_taken">Action Taken</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated to DVC</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Priority:</span>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent (24h)</option>
                  <option value="high">High (48h)</option>
                  <option value="standard">Standard (72h)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dockets List */}
          <div className="space-y-3">
            {filteredComplaints.map((item) => {
              const isOverdue =
                item.isSlaBreached && item.status !== "resolved";
              const isUrgent = item.priority === "urgent";

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isOverdue
                      ? "border-rose-300 ring-1 ring-rose-300"
                      : isUrgent
                        ? "border-amber-300"
                        : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
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
                        {item.priority}
                      </span>
                      <span className="text-xs text-slate-500 capitalize bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {item.category.replace("_", " ")}
                      </span>
                      {item.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          <UserX className="w-3 h-3" />
                          Confidential Whistleblower
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-600 font-medium">
                          Complainant: {item.studentName} ({item.studentMatric})
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">
                      {item.title}
                    </h4>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                      <span>
                        Venue: <strong>{item.location}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Faculty: <strong>{item.faculty}</strong>
                      </span>
                      <span>•</span>
                      <span>Filed: {item.submittedAt}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 italic">
                      "{item.description}"
                    </p>
                  </div>

                  <div className="flex md:flex-col items-end justify-between gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span
                        className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                          item.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : item.status === "escalated"
                              ? "bg-purple-100 text-purple-800 border border-purple-300"
                              : isOverdue
                                ? "bg-rose-100 text-rose-800 border border-rose-300"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>

                      <div className="text-[11px] text-slate-500 mt-1">
                        {item.status === "resolved" ? (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Resolved (
                            {item.studentSatisfactionRating
                              ? `${item.studentSatisfactionRating}★ Rated`
                              : "Closed"}
                            )
                          </span>
                        ) : isOverdue ? (
                          <span className="text-rose-600 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            SLA BREACHED
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            SLA: {item.slaHoursRemaining}h left
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => openComplaintDossier(item)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Manage Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Institutional Service Charter Compliance */}
      {activeTab === "charter" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Institutional SERVICOM Service Delivery Compact Charter
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Service Delivery Standards, Maximum Allowable Turnaround &
              Senate-Mandated Compliance Targets
            </p>
          </div>

          <div className="space-y-4">
            {charterMetrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {metric.serviceTitle}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Custodian: {metric.responsibleUnit}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded uppercase ${
                        metric.status === "compliant"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : metric.status === "warning"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {metric.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      Trend: {metric.quarterTrend}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">
                      Charter SLA Limit:
                    </span>
                    <strong className="text-slate-800 font-mono">
                      {metric.charterSlaDays} Days
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">
                      Current University Average:
                    </span>
                    <strong className="text-slate-800 font-mono">
                      {metric.averageActualDays} Days
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">
                      Target Compliance:
                    </span>
                    <strong className="text-slate-800 font-mono">
                      {metric.targetCompliancePercent}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">
                      Actual Compliance Rate:
                    </span>
                    <strong
                      className={`font-mono text-sm ${
                        metric.currentCompliancePercent >=
                        metric.targetCompliancePercent
                          ? "text-emerald-700 font-bold"
                          : "text-rose-600 font-bold"
                      }`}
                    >
                      {metric.currentCompliancePercent}%
                    </strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      metric.currentCompliancePercent >=
                      metric.targetCompliancePercent
                        ? "bg-emerald-600"
                        : metric.status === "warning"
                          ? "bg-amber-500"
                          : "bg-rose-600"
                    }`}
                    style={{
                      width: `${Math.min(100, metric.currentCompliancePercent)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Case Management Modal / Drawer */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-amber-500/30 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/40">
                    {selectedComplaint.trackingCode}
                  </span>
                  <span className="text-xs uppercase bg-white/20 px-2 py-0.5 rounded font-bold">
                    {selectedComplaint.priority} Priority
                  </span>
                </div>
                <h3 className="text-base font-bold mt-1 text-white">
                  {selectedComplaint.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Incident Dossier Data */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <span className="text-slate-500">Venue / Location:</span>{" "}
                    <strong>{selectedComplaint.location}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">
                      Department / Faculty:
                    </span>{" "}
                    <strong>
                      {selectedComplaint.department} (
                      {selectedComplaint.faculty})
                    </strong>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between gap-2 pt-1 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500">Complainant:</span>{" "}
                    {selectedComplaint.isAnonymous ? (
                      <span className="text-amber-700 font-bold">
                        Protected Anonymous / Whistleblower
                      </span>
                    ) : (
                      <strong>
                        {selectedComplaint.studentName} (
                        {selectedComplaint.studentMatric})
                      </strong>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500">Date Filed:</span>{" "}
                    <strong>{selectedComplaint.submittedAt}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-slate-500 block mb-1">
                    Student Narrative Statement:
                  </span>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 leading-relaxed italic">
                    "{selectedComplaint.description}"
                  </div>
                </div>

                {selectedComplaint.evidenceAttachmentName && (
                  <div className="flex items-center gap-2 pt-1 text-indigo-700">
                    <FileText className="w-3.5 h-3.5" />
                    <span>
                      Evidence Attached:{" "}
                      <strong>
                        {selectedComplaint.evidenceAttachmentName}
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Status Update & Resolution Form */}
              <form
                onSubmit={handleUpdateStatus}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Update Docket Status & Resolution
                  </h4>
                  <button
                    type="button"
                    onClick={handleEscalateToDVC}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Escalate to DVC Academic</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) =>
                        setNewStatus(e.target.value as ComplaintStatus)
                      }
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
                    >
                      <option value="submitted">
                        Submitted (Awaiting Triage)
                      </option>
                      <option value="triaged">Triaged & Assigned</option>
                      <option value="investigating">Under Investigation</option>
                      <option value="action_taken">
                        Corrective Action Taken
                      </option>
                      <option value="resolved">Resolved & Closed</option>
                      <option value="escalated">Escalated to Senate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Assigned Custodian Unit
                    </label>
                    <input
                      type="text"
                      defaultValue={
                        selectedComplaint.assignedUnit ||
                        "Physical Works Directorate"
                      }
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Formal Resolution Statement (Visible to Student Complainant)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe specific rectification: e.g. 'Works Dept deployed 70 new chairs and fixed audio amplifier on Feb 19th'..."
                    value={newResolutionSummary}
                    onChange={(e) => setNewResolutionSummary(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                  >
                    Save Status & Resolution
                  </button>
                </div>
              </form>

              {/* Case Investigation Log & Add Note */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Official Case Dossier Activity Log (
                  {selectedComplaint.investigationNotes.length})
                </h4>

                <div className="space-y-2">
                  {selectedComplaint.investigationNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        note.isInternalOnly
                          ? "bg-amber-50/70 border-amber-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="font-semibold text-slate-800">
                          {note.author} ({note.role})
                        </span>
                        <span>{note.timestamp}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">
                        {note.note}
                      </p>
                      {note.isInternalOnly && (
                        <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                          Internal SERVICOM Note Only
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new note */}
                <form
                  onSubmit={handleAddNote}
                  className="space-y-2 pt-2 border-t border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Add Entry to Docket:
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isInternalNote}
                        onChange={(e) => setIsInternalNote(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <span>
                        Internal Confidential Note (Hide from Student)
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Type investigation update, officer phone inquiry findings, meeting notes..."
                      value={newInvestigationNote}
                      onChange={(e) => setNewInvestigationNote(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Post Note
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
