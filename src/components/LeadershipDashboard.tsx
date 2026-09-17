import * as React from "react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Landmark,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building2,
  Users,
  Award,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Printer,
  Calendar,
  ArrowUpRight,
  Clock,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export const LeadershipDashboard: React.FC = () => {
  const {
    currentUser,
    sessionInfo,
    complaints,
    qaAudits,
    facultyStats,
    charterMetrics,
  } = useApp();

  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedAlertFilter, setSelectedAlertFilter] = useState<
    "all" | "audits" | "complaints"
  >("all");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Compute Macro KPIs
  const totalComplaints = complaints.length;
  const breachedComplaints = complaints.filter(
    (c) => c.isSlaBreached && c.status !== "resolved",
  );
  const resolvedComplaints = complaints.filter(
    (c) => c.status === "resolved" || c.status === "closed",
  );
  const resolutionRate =
    totalComplaints > 0
      ? Math.round((resolvedComplaints.length / totalComplaints) * 100)
      : 0;

  const passedAudits = qaAudits.filter((a) => a.status === "passed").length;
  const auditComplianceRate =
    qaAudits.length > 0
      ? Math.round((passedAudits / qaAudits.length) * 100)
      : 0;

  // Chart Data: Faculty Quality Assurance League Performance
  const facultyChartData = facultyStats.map((f) => ({
    name: f.facultyName.replace("Faculty of ", "").split("&")[0].trim(),
    fullName: f.facultyName,
    satisfaction: Number((f.averageTeachingRating * 20).toFixed(1)), // normalized to 100 scale for clean comparison
    auditPass: f.qaAuditPassRate,
    rawRating: f.averageTeachingRating,
  }));

  // Chart Data: Complaint Categories Distribution
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    const formatted = c.category
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    categoryCounts[formatted] = (categoryCounts[formatted] || 0) + 1;
  });

  const categoryPieData = Object.entries(categoryCounts).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  // Brand Palette for Pie Chart: deep teal, confirm teal, amber accent, and harmonious muted teals
  const PIE_COLORS = [
    "#12332F",
    "#2F6E5F",
    "#E7A33E",
    "#427A6E",
    "#C28328",
    "#1A4A44",
  ];

  // Critical alerts data: Plain, non-punitive language that explains WHAT HAPPENED and WHAT TO DO NEXT
  const criticalAlerts = [
    {
      id: "alt-1",
      type: "audit",
      entity: "Faculty of Law",
      location: "Lecture Hall 3",
      severity: "high",
      whatHappened:
        "Facility QA audit is 4 days overdue for scheduled semester verification.",
      nextStep:
        "Dispatch Auditor Engr. Bello Ibrahim for immediate on-site compliance sign-off.",
      dueTime: "Overdue by 4 days",
      actionLabel: "Assign Auditor",
    },
    {
      id: "alt-2",
      type: "evaluation",
      entity: "Dept of Biological Sciences",
      location: "Undergraduate Program",
      severity: "medium",
      whatHappened:
        "Course evaluation responses currently stand at 34% (below the 40% quorum requirement).",
      nextStep:
        "Issue an automated reminder through student SMS & portal before Friday deadline.",
      dueTime: "Action required",
      actionLabel: "Send Reminder",
    },
    {
      id: "alt-3",
      type: "complaint",
      entity: "Docket SRV-2025-0142",
      location: "Physical Sciences Hall B",
      severity: "high",
      whatHappened:
        "Public address acoustics complaint turnaround passed the 48h Service Charter threshold.",
      nextStep:
        "Convene joint Deanery & Physical Facilities review to finalize equipment replacement.",
      dueTime: "SLA elapsed by 18h",
      actionLabel: "Expedite Works",
    },
    {
      id: "alt-4",
      type: "audit",
      entity: "Faculty of Arts & Humanities",
      location: "Philosophy & Languages",
      severity: "medium",
      whatHappened:
        "Continuous assessment grading rubrics have not been uploaded for 3 general courses.",
      nextStep:
        "Engage Departmental Quality Officer to facilitate prompt rubric submission before exams.",
      dueTime: "Senate 14-day rule",
      actionLabel: "Notify Dept Officer",
    },
  ];

  const filteredAlerts =
    selectedAlertFilter === "all"
      ? criticalAlerts
      : selectedAlertFilter === "audits"
        ? criticalAlerts.filter(
          (a) => a.type === "audit" || a.type === "evaluation",
        )
        : criticalAlerts.filter((a) => a.type === "complaint");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans text-[#1A2421]">
      {/* Leadership Header Banner */}
      <div className="bg-[#12332F] rounded-2xl p-6 sm:p-7 text-[#FBF9F4] shadow-md border border-[#1A433E]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F6E5F]/30 text-[#EFF3F1] text-xs font-medium mb-2 border border-[#2F6E5F]/50">
              <Landmark className="w-3.5 h-3.5 text-[#E7A33E]" />
              <span>
                Office of the Vice-Chancellor & Senate Committee on Quality
                Assurance
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#FBF9F4]">
              Institutional QA & SERVICOM Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-[#EFF3F1]/80 mt-1 font-normal">
              Presiding: {currentUser.name} ({currentUser.roleTitle}) •
              Harmattan Semester {sessionInfo.session}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2.5 bg-[#E7A33E] hover:bg-[#d89532] text-[#12332F] rounded-xl text-xs font-medium flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#12332F]" />
              <span>Generate Senate QA Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Across Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Teaching Satisfaction */}
        <div className="bg-white p-5 rounded-2xl border border-[#CBDAD6] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#1A2421]/70">
            <span className="font-medium">Overall Teaching Satisfaction</span>
            <Award className="w-4 h-4 text-[#2F6E5F]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-sans text-3xl font-medium text-[#12332F]">
              4.23
            </span>
            <span className="text-xs text-[#1A2421]/50 font-normal">
              / 5.00
            </span>
          </div>
          <div className="text-xs text-[#2F6E5F] font-medium flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+0.14 vs Previous Session</span>
          </div>
          <div className="text-[11px] text-[#1A2421]/60 pt-0.5 border-t border-[#CBDAD6]/50">
            Aggregated across 5 faculties (91.2% student participation)
          </div>
        </div>

        {/* Card 2: QA Audit Compliance Rate */}
        <div className="bg-white p-5 rounded-2xl border border-[#CBDAD6] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#1A2421]/70">
            <span className="font-medium">QA Audit Compliance Rate</span>
            <ShieldCheck className="w-4 h-4 text-[#2F6E5F]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-sans text-3xl font-medium text-[#12332F]">
              {auditComplianceRate}%
            </span>
            <span className="text-xs text-[#2F6E5F] font-medium">On-Track</span>
          </div>
          <div className="text-xs text-[#2F6E5F] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {passedAudits} of {qaAudits.length} Audited Facilities Verified
            </span>
          </div>
          <div className="text-[11px] text-[#1A2421]/60 pt-0.5 border-t border-[#CBDAD6]/50">
            Institutional Benchmark: ≥ 85% compliance
          </div>
        </div>

        {/* Card 3: SERVICOM Complaint Resolution */}
        <div className="bg-white p-5 rounded-2xl border border-[#CBDAD6] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#1A2421]/70">
            <span className="font-medium">SERVICOM Complaint Resolution</span>
            <span className="w-2 h-2 rounded-full bg-[#E7A33E]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-sans text-3xl font-medium text-[#12332F]">
              {resolutionRate}%
            </span>
            <span className="text-xs text-[#1A2421]/60 font-normal">
              redressed
            </span>
          </div>
          <div className="text-xs text-[#2F6E5F] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {resolvedComplaints.length} of {totalComplaints} Active Cases
              Resolved
            </span>
          </div>
          <div className="text-[11px] text-[#1A2421]/60 pt-0.5 border-t border-[#CBDAD6]/50">
            Target SLA: 90% resolution within 72 hours
          </div>
        </div>

        {/* Card 4: Critical Priority Follow-ups */}
        <div className="bg-white p-5 rounded-2xl border border-[#CBDAD6] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#1A2421]/70">
            <span className="font-medium">Timely Follow-ups Required</span>
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`font-sans text-3xl font-medium ${breachedComplaints.length > 0 ? "text-[#DC2626]" : "text-[#12332F]"}`}
            >
              {breachedComplaints.length + 2}
            </span>
            <span className="text-xs text-[#1A2421]/60 font-normal">
              Active items
            </span>
          </div>
          <div className="text-xs text-[#DC2626] font-medium flex items-center gap-1">
            <span>Action pathways designated</span>
          </div>
          <div className="text-[11px] text-[#1A2421]/60 pt-0.5 border-t border-[#CBDAD6]/50">
            {breachedComplaints.length} SLA follow-up • 2 scheduled audits
          </div>
        </div>
      </div>

      {/* Side-by-Side: Trend Chart + Critical Alerts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Col (7 cols): Trend Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#CBDAD6] shadow-xs flex flex-col justify-between">
          <div className="space-y-1 mb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-[#12332F]">
                Faculty Quality Assurance League Performance
              </h3>
              <span className="text-[11px] font-sans font-medium text-[#2F6E5F] bg-[#2F6E5F]/10 px-2.5 py-0.5 rounded-full border border-[#2F6E5F]/20">
                Harmattan 2024/25
              </span>
            </div>
            <p className="text-xs text-[#1A2421]/70 font-normal">
              Audit Compliance Pass Rate (%) vs Normalized Student Teaching
              Satisfaction (out of 100)
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={facultyChartData}
                margin={{ top: 12, right: 12, left: -20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2ECE9"
                />
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                    fill: "#1A2421",
                    fontFamily: "IBM Plex Sans",
                  }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{
                    fontSize: 11,
                    fill: "#1A2421",
                    fontFamily: "IBM Plex Sans",
                  }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    name === "Teaching Satisfaction"
                      ? `${(value / 20).toFixed(2)} / 5.0`
                      : `${value}%`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "#12332F",
                    borderColor: "#1A433E",
                    borderRadius: "10px",
                    color: "#FBF9F4",
                    fontSize: "12px",
                    fontFamily: "IBM Plex Sans",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                    paddingTop: "10px",
                    fontFamily: "IBM Plex Sans",
                  }}
                />
                <Bar
                  dataKey="auditPass"
                  name="Audit Pass Rate %"
                  fill="#2F6E5F"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="satisfaction"
                  name="Teaching Satisfaction"
                  fill="#E7A33E"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-[#CBDAD6]/60 flex flex-wrap items-center justify-between text-xs text-[#1A2421]/70">
            <span className="font-normal">
              Benchmark: 85% audit pass rate & 4.00 teaching satisfaction
            </span>
            <span className="font-medium text-[#2F6E5F]">
              All faculties meeting or within scheduled remediation threshold
            </span>
          </div>
        </div>

        {/* Right Col (5 cols): Critical Alerts Panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#CBDAD6] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#CBDAD6]/60 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-semibold text-[#12332F]">
                    Institutional Priority Follow-ups
                  </h3>
                  <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20">
                    {criticalAlerts.length} Active
                  </span>
                </div>
                <p className="text-xs text-[#1A2421]/70 mt-0.5">
                  Specific findings paired with designated next administrative
                  steps
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 mb-3.5">
              {[
                { id: "all", label: "All Items" },
                { id: "audits", label: "Academic & Audits" },
                { id: "complaints", label: "Service Charters" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedAlertFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${selectedAlertFilter === f.id
                      ? "bg-[#12332F] text-[#FBF9F4]"
                      : "bg-[#EFF3F1] text-[#1A2421] hover:bg-[#CBDAD6]/60"
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-xl border border-[#CBDAD6] bg-[#EFF3F1]/50 hover:bg-[#EFF3F1] transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0" />
                      <span className="font-medium text-xs text-[#12332F] truncate">
                        {alert.entity}
                      </span>
                      <span className="text-[11px] text-[#1A2421]/50 truncate">
                        ({alert.location})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-medium text-[#DC2626] bg-[#DC2626]/10 px-1.5 py-0.5 rounded border border-[#DC2626]/20 shrink-0">
                      {alert.dueTime}
                    </span>
                  </div>

                  <div className="text-xs text-[#1A2421] space-y-1">
                    <div>
                      <span className="font-medium text-[#12332F]">
                        Finding:{" "}
                      </span>
                      <span className="text-[#1A2421]/80">
                        {alert.whatHappened}
                      </span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-[#CBDAD6]/60">
                      <span className="font-medium text-[#2F6E5F]">
                        Next Step:{" "}
                      </span>
                      <span className="text-[#1A2421]/90">
                        {alert.nextStep}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={() => {
                        setActionNotice(
                          `Action initiated: "${alert.actionLabel}" for ${alert.entity}. Notification dispatched to department lead.`,
                        );
                        setTimeout(() => setActionNotice(null), 5000);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#12332F] hover:text-[#2F6E5F] cursor-pointer"
                    >
                      <span>{alert.actionLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {actionNotice && (
              <div className="mt-3 p-2.5 rounded-lg bg-[#2F6E5F]/15 border border-[#2F6E5F]/30 text-xs text-[#12332F] flex items-center justify-between">
                <span>{actionNotice}</span>
                <button
                  onClick={() => setActionNotice(null)}
                  className="text-xs font-semibold text-[#12332F] hover:underline ml-2 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-[#CBDAD6]/60 text-[11px] text-[#1A2421]/60 flex items-center justify-between">
            <span>Automatic notification sent to Senate Deanery</span>
            <span className="text-[#2F6E5F] font-medium">
              SLA Escalation Protocol
            </span>
          </div>
        </div>
      </div>

      {/* Faculty Governance League Table */}
      <div className="bg-white rounded-2xl border border-[#CBDAD6] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#12332F]">
              Senate Faculty Compliance & Governance League
            </h3>
            <p className="text-xs text-[#1A2421]/70 font-normal">
              Benchmarked across academic faculties under the University Quality
              Assurance Policy
            </p>
          </div>
          <div className="text-xs text-[#1A2421]/70">
            Updated:{" "}
            <span className="font-medium text-[#12332F]">
              Continuous Live Sync
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#CBDAD6] text-[#1A2421]/70 uppercase tracking-wider font-medium">
                <th className="py-3 px-3">Faculty & Dean</th>
                <th className="py-3 px-3">Academic Staff</th>
                <th className="py-3 px-3">Student Rating</th>
                <th className="py-3 px-3">QA Pass Rate</th>
                <th className="py-3 px-3">Open Complaints</th>
                <th className="py-3 px-3">Resolution Timeline</th>
                <th className="py-3 px-3">Status & Action Pathway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBDAD6]/50">
              {facultyStats.map((f, i) => (
                <tr key={i} className="hover:bg-[#EFF3F1]/60 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-xs text-[#12332F]">
                      {f.facultyName}
                    </div>
                    <div className="text-[11px] text-[#1A2421]/60">
                      Dean: {f.dean}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-normal text-[#1A2421]">
                    {f.totalLecturers} Lecturers
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[#12332F]">
                    {f.averageTeachingRating.toFixed(2)} / 5.0
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-medium text-[#12332F]">
                      {f.qaAuditPassRate}%
                    </span>
                    <div className="w-24 bg-[#EFF3F1] rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${f.qaAuditPassRate >= 90 ? "bg-[#2F6E5F]" : "bg-[#E7A33E]"}`}
                        style={{ width: `${f.qaAuditPassRate}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[#1A2421]">
                    {f.openComplaints}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-medium text-[#1A2421]">
                    {f.slaBreachRate}% overdue
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium inline-flex items-center gap-1 ${f.qaAuditPassRate >= 90
                          ? "bg-[#2F6E5F]/15 text-[#2F6E5F] border border-[#2F6E5F]/30"
                          : "bg-[#E7A33E]/15 text-[#1A2421] border border-[#E7A33E]/30"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${f.qaAuditPassRate >= 90 ? "bg-[#2F6E5F]" : "bg-[#E7A33E]"}`}
                      />
                      {f.qaAuditPassRate >= 90
                        ? "High Compliance"
                        : "Area to Strengthen"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Breakdown and Charter SLAs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaint Categories Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-[#CBDAD6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-semibold text-[#12332F]">
                SERVICOM Complaint Categories Breakdown
              </h3>
              <p className="text-xs text-[#1A2421]/70">
                Distribution of student complaints by institutional operational
                domain
              </p>
            </div>
            <span className="text-[11px] bg-[#EFF3F1] text-[#12332F] font-medium px-2.5 py-0.5 rounded-full border border-[#CBDAD6]">
              Total: {totalComplaints} Dockets
            </span>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#12332F",
                    borderColor: "#1A433E",
                    borderRadius: "8px",
                    color: "#FBF9F4",
                    fontSize: "12px",
                    fontFamily: "IBM Plex Sans",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                    fontFamily: "IBM Plex Sans",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Charter SLA Health */}
        <div className="bg-white p-6 rounded-2xl border border-[#CBDAD6] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#CBDAD6]/60">
              <div>
                <h3 className="font-serif text-base font-semibold text-[#12332F]">
                  Service Charter Standards & Turnaround
                </h3>
                <p className="text-xs text-[#1A2421]/70">
                  Statutory maximum turnaround vs actual median days to
                  resolution
                </p>
              </div>
              <span className="text-[11px] font-medium text-[#2F6E5F]">
                Apex SERVICOM Standard
              </span>
            </div>

            <div className="space-y-3.5 pt-2">
              {charterMetrics.map((m) => {
                const isOnTrack = m.averageActualDays <= m.charterSlaDays;
                return (
                  <div key={m.serviceCode} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#12332F]">
                        {m.serviceTitle}
                      </span>
                      <span className="text-[11px] text-[#1A2421]/70">
                        Avg:{" "}
                        <strong className="text-[#12332F]">
                          {m.averageActualDays}d
                        </strong>{" "}
                        / Target: {m.charterSlaDays}d
                      </span>
                    </div>
                    <div className="w-full bg-[#EFF3F1] rounded-full h-2 overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all ${isOnTrack ? "bg-[#2F6E5F]" : "bg-[#E7A33E]"}`}
                        style={{
                          width: `${Math.min((m.averageActualDays / (m.charterSlaDays * 1.5)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#1A2421]/60">
                      <span>
                        Complaints this session: {m.totalComplaintsThisSession}
                      </span>
                      <span
                        className={
                          isOnTrack
                            ? "text-[#2F6E5F] font-medium"
                            : "text-[#DC2626] font-medium"
                        }
                      >
                        {isOnTrack
                          ? "Compliant with charter"
                          : "Area to strengthen"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#CBDAD6]/60 text-[11px] text-[#1A2421]/60">
            Escalation threshold: Any case pending beyond 1.5× charter timeline
            is routed to Senate Ombudsman.
          </div>
        </div>
      </div>

      {/* Executive Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-[#12332F]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#EFF3F1] text-[#1A2421] rounded-2xl max-w-3xl w-full shadow-2xl border border-[#CBDAD6] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#12332F] p-5 text-[#FBF9F4] flex items-center justify-between border-b border-[#1A433E]">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-[#E7A33E] font-medium">
                  Apex University Senate Briefing Document
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#FBF9F4]">
                  Official Institutional QA & SERVICOM Executive Report
                </h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-[#EFF3F1]/80 hover:text-white p-1 rounded-lg hover:bg-white/10 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs text-[#1A2421] leading-relaxed bg-white">
              {/* Document Header */}
              <div className="text-center border-b border-[#CBDAD6] pb-4 space-y-1">
                <div className="font-serif text-base font-semibold text-[#12332F] uppercase">
                  Apex University Quality Assurance Directorate & SERVICOM
                  Committee
                </div>
                <div className="text-xs text-[#1A2421]/70">
                  Comprehensive Mid-Semester Compliance, Lecturer Evaluation &
                  Complaint Report
                </div>
                <div className="text-[11px] font-mono text-[#1A2421]/60">
                  Generated on: {new Date().toLocaleDateString("en-GB")} •
                  Reference: SEC/QAD/2025/RPT-04
                </div>
              </div>

              {/* Summary Statements */}
              <div className="space-y-2">
                <h4 className="font-serif text-sm font-semibold text-[#12332F] uppercase tracking-wider">
                  1. Executive Summary
                </h4>
                <p>
                  During the ongoing {sessionInfo.session} (
                  {sessionInfo.semester}), the university recorded a total of{" "}
                  <strong>{qaAudits.length} digital quality audits</strong> with
                  an institutional compliance rate of{" "}
                  <strong>{auditComplianceRate}%</strong>. The overall student
                  teaching evaluation index stands at{" "}
                  <strong>4.23 out of 5.00</strong> across 5 faculties.
                </p>
                <p>
                  The SERVICOM Nodal Desk processed{" "}
                  <strong>{totalComplaints} formal complaint cases</strong>.
                  Resolution rate is currently at{" "}
                  <strong>{resolutionRate}%</strong>, with{" "}
                  {breachedComplaints.length} cases actively engaged through
                  designated follow-up pathways.
                </p>
              </div>

              {/* Key Highlights Table */}
              <div className="space-y-2">
                <h4 className="font-serif text-sm font-semibold text-[#12332F] uppercase tracking-wider">
                  2. Faculty Performance & Areas to Strengthen
                </h4>
                <div className="bg-[#EFF3F1] border border-[#CBDAD6] rounded-xl p-3">
                  <div className="grid grid-cols-3 gap-2 font-medium text-[#12332F] border-b border-[#CBDAD6] pb-1">
                    <span>Faculty</span>
                    <span>Teaching Rating</span>
                    <span>Audit Pass Rate</span>
                  </div>
                  {facultyStats.map((f, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-3 gap-2 py-1.5 border-b border-[#CBDAD6]/50 last:border-0"
                    >
                      <span className="font-medium text-[#12332F]">
                        {f.facultyName}
                      </span>
                      <span>{f.averageTeachingRating.toFixed(2)} / 5.0</span>
                      <span className="font-medium text-[#2F6E5F]">
                        {f.qaAuditPassRate}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations for Senate */}
              <div className="space-y-2">
                <h4 className="font-serif text-sm font-semibold text-[#12332F] uppercase tracking-wider">
                  3. Recommended Pathways for Institutional Strengthening
                </h4>
                <ul className="list-disc list-inside space-y-1.5 pl-1 text-[#1A2421]/90">
                  <li>
                    Direct Directorate of Works to expedite replacement of
                    acoustic public address systems in New Lecture Hall 1 and
                    Life Sciences Quadrangle.
                  </li>
                  <li>
                    Re-enforce Senate circular on prompt publication of
                    continuous assessment marks at least 14 days prior to
                    semester examinations.
                  </li>
                  <li>
                    Commend Dr. Miriam Adeleke (Computer Science) for exemplary
                    teaching evaluations (4.65/5.0) and comprehensive peer audit
                    compliance.
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#CBDAD6] flex items-center justify-between">
                <div className="text-[11px] text-[#1A2421]/60">
                  Approved by: Prof. Olumide Balogun (DVC Academic & QA
                  Oversight)
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#12332F] text-[#FBF9F4] rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer hover:bg-[#1A433E]"
                >
                  <Printer className="w-3.5 h-3.5 text-[#E7A33E]" />
                  <span>Print Official Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
