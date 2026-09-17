import * as React from 'react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QAAuditInspection, QAChecklist } from '../types';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  FileText,
  Plus,
  Send,
  Building2,
  Sparkles,
  Sliders,
  Calendar
} from 'lucide-react';

export const QAOfficerPortal: React.FC = () => {
  const { currentUser, qaAudits, recordNewAudit } = useApp();

  const [activeTab, setActiveTab] = useState<'checklist' | 'registry'>('checklist');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Audit Form State
  const [hallName, setHallName] = useState('Lecture Theatre B (LT-B)');
  const [building, setBuilding] = useState('Faculty of Engineering Complex');
  const [faculty, setFaculty] = useState('Engineering & Technology');
  const [courseCode, setCourseCode] = useState('MEE 305');
  const [courseTitle, setCourseTitle] = useState('Fluid Mechanics & Hydraulics');
  const [scheduledLecturer, setScheduledLecturer] = useState('Engr. Dr. S. O. Aremu');
  const [actualLecturer, setActualLecturer] = useState('Engr. Dr. S. O. Aremu');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [hallCapacity, setHallCapacity] = useState(150);
  const [studentHeadcount, setStudentHeadcount] = useState(128);
  const [inspectorRemarks, setInspectorRemarks] = useState('');
  const [rectificationDeadline, setRectificationDeadline] = useState('');

  // Checklist criteria
  const [checklist, setChecklist] = useState<QAChecklist>({
    lecturerPunctuality: 'punctual',
    hallCleanliness: 'compliant',
    seatingAdequacy: 'sufficient',
    audiovisualStatus: 'functional',
    ventilationAndLighting: 'adequate',
    syllabusAvailableToStudents: true,
    continuousAssessmentAnnounced: true,
    studentHeadcount: 128,
    hallCapacity: 150
  });

  // Calculate live readiness score
  const calculateScore = () => {
    let score = 0;
    // Lecturer punctuality (25%)
    if (checklist.lecturerPunctuality === 'punctual') score += 25;
    else if (checklist.lecturerPunctuality === 'late_10m') score += 12;
    else if (checklist.lecturerPunctuality === 'absent') score += 0;

    // Hall Cleanliness (15%)
    if (checklist.hallCleanliness === 'compliant') score += 15;
    else if (checklist.hallCleanliness === 'minor_litter') score += 8;

    // Seating adequacy (15%)
    if (checklist.seatingAdequacy === 'sufficient') score += 15;
    else if (checklist.seatingAdequacy === 'overcrowded') score += 7;

    // Audiovisual (15%)
    if (checklist.audiovisualStatus === 'functional') score += 15;
    else if (checklist.audiovisualStatus === 'intermittent') score += 8;

    // Ventilation & Lighting (10%)
    if (checklist.ventilationAndLighting === 'adequate') score += 10;
    else if (checklist.ventilationAndLighting === 'fair') score += 5;

    // Syllabus & CA (20%)
    if (checklist.syllabusAvailableToStudents) score += 10;
    if (checklist.continuousAssessmentAnnounced) score += 10;

    return Math.min(100, Math.max(0, score));
  };

  const currentScore = calculateScore();
  const calculatedStatus: 'passed' | 'conditional_pass' | 'non_compliant' =
    currentScore >= 80 ? 'passed' : currentScore >= 55 ? 'conditional_pass' : 'non_compliant';

  const handleSubmitAudit = (e: React.FormEvent) => {
    e.preventDefault();
    recordNewAudit({
      auditDate: new Date().toISOString().slice(0, 10),
      timeSlot,
      hallName,
      building,
      faculty,
      courseCode,
      courseTitle,
      scheduledLecturer,
      actualLecturer,
      checklist: {
        ...checklist,
        studentHeadcount,
        hallCapacity
      },
      overallScorePercentage: currentScore,
      status: calculatedStatus,
      inspectorName: currentUser.name,
      inspectorRemarks: inspectorRemarks || 'Physical QA audit completed during regular lecture hours.',
      rectificationDeadline: calculatedStatus !== 'passed' ? rectificationDeadline || '2025-03-01' : undefined
    });

    // Reset remarks and switch to registry
    setInspectorRemarks('');
    setActiveTab('registry');
  };

  // Filtered audits
  const filteredAudits = qaAudits.filter(a => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSearch =
      a.hallName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.scheduledLecturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.auditCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const passCount = qaAudits.filter(a => a.status === 'passed').length;
  const conditionalCount = qaAudits.filter(a => a.status === 'conditional_pass').length;
  const nonCompliantCount = qaAudits.filter(a => a.status === 'non_compliant').length;
  const averagePassRate = Math.round((passCount / (qaAudits.length || 1)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans text-[#1A2421]">
      {/* Header Banner */}
      <div className="bg-[#12332F] rounded-2xl p-6 sm:p-7 text-[#FBF9F4] shadow-md border border-[#1A433E] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2F6E5F]/30 text-[#EFF3F1] text-xs font-medium mb-1 border border-[#2F6E5F]/50">
              <ClipboardCheck className="w-3.5 h-3.5 text-[#E7A33E]" />
              <span>Directorate of Academic Planning & Quality Assurance</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#FBF9F4]">
              Digital Inspection & Compliance Console
            </h2>
            <p className="text-xs sm:text-sm text-[#EFF3F1]/80 mt-0.5">
              Auditor: {currentUser.name} • On-Site Classroom Spot-Checks, Accreditation Readiness & Facility Audits
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#1A433E] border border-[#275B52] rounded-xl px-4 py-3 text-center">
              <div className="font-sans text-2xl font-medium text-[#FBF9F4]">{qaAudits.length}</div>
              <div className="text-[11px] text-[#EFF3F1]/70 uppercase tracking-wider font-medium">Audits Recorded</div>
            </div>

            <div className="bg-[#1A433E] border border-[#275B52] rounded-xl px-4 py-3 text-center">
              <div className="font-sans text-2xl font-medium text-[#2F6E5F]">{averagePassRate}%</div>
              <div className="text-[11px] text-[#EFF3F1]/70 uppercase tracking-wider font-medium">Compliance Rate</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1A433E] mt-6 gap-2 text-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 pb-3 px-3 font-medium transition-colors border-b-2 cursor-pointer whitespace-nowrap text-xs sm:text-sm ${activeTab === 'checklist'
                ? 'border-[#E7A33E] text-[#E7A33E]'
                : 'border-transparent text-[#EFF3F1]/70 hover:text-white'
              }`}
          >
            <Plus className="w-4 h-4" />
            <span>Run Digital Audit Checklist</span>
          </button>

          <button
            onClick={() => setActiveTab('registry')}
            className={`flex items-center gap-2 pb-3 px-3 font-medium transition-colors border-b-2 cursor-pointer whitespace-nowrap text-xs sm:text-sm ${activeTab === 'registry'
                ? 'border-[#E7A33E] text-[#E7A33E]'
                : 'border-transparent text-[#EFF3F1]/70 hover:text-white'
              }`}
          >
            <FileText className="w-4 h-4" />
            <span>Campus Audit Registry ({qaAudits.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Digital Audit Checklist Runner */}
      {activeTab === 'checklist' && (
        <form onSubmit={handleSubmitAudit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#CBDAD6] p-6 shadow-xs space-y-6">
            {/* Live Score Floating Ribbon */}
            <div className="bg-[#12332F] text-[#FBF9F4] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 border border-[#1A433E]">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-medium text-lg ${calculatedStatus === 'passed'
                    ? 'bg-[#2F6E5F] text-[#FBF9F4]'
                    : calculatedStatus === 'conditional_pass'
                      ? 'bg-[#E7A33E] text-[#12332F]'
                      : 'bg-[#B93826] text-white'
                  }`}>
                  {currentScore}%
                </div>
                <div>
                  <span className="text-xs text-[#EFF3F1]/70 uppercase tracking-wider block">Live Audit Outcome</span>
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#FBF9F4]">
                    {calculatedStatus === 'passed' && 'COMPLIANT / PASSED'}
                    {calculatedStatus === 'conditional_pass' && 'CONDITIONAL PASS (Rectification Requested)'}
                    {calculatedStatus === 'non_compliant' && 'CRITICAL ESCALATION (Flagged for Immediate Attention)'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-[#EFF3F1]/70 space-y-0.5">
                <div>Passing Benchmark: ≥ 80%</div>
                <div>Action Notice Threshold: 55% - 79%</div>
              </div>
            </div>

            {/* Section 1: Venue & Course Data */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                1. Lecture Session & Venue Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hall / Venue Name *</label>
                  <input
                    type="text"
                    required
                    value={hallName}
                    onChange={(e) => setHallName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Building / Complex</label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Faculty</label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Physical & Computing Sciences">Physical & Computing Sciences</option>
                    <option value="Engineering & Technology">Engineering & Technology</option>
                    <option value="Management & Social Sciences">Management & Social Sciences</option>
                    <option value="Basic Medical Sciences">Basic Medical Sciences</option>
                    <option value="Environmental Sciences">Environmental Sciences</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Lecturer</label>
                  <input
                    type="text"
                    value={scheduledLecturer}
                    onChange={(e) => setScheduledLecturer(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Actual Lecturer Present</label>
                  <input
                    type="text"
                    value={actualLecturer}
                    onChange={(e) => setActualLecturer(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hall Seating Capacity</label>
                  <input
                    type="number"
                    value={hallCapacity}
                    onChange={(e) => setHallCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Actual Student Headcount</label>
                  <input
                    type="number"
                    value={studentHeadcount}
                    onChange={(e) => setStudentHeadcount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  {studentHeadcount > hallCapacity && (
                    <span className="text-[10px] text-rose-600 font-bold block mt-0.5">
                      ⚠️ Overcrowded: {Math.round(((studentHeadcount - hallCapacity) / hallCapacity) * 100)}% over capacity
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Physical Inspection Checklist */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                2. Physical Inspection Checklist (Weighted Criteria)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lecturer Punctuality */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>Lecturer Timetable Punctuality</span>
                    <span className="text-purple-700 font-mono">Weight: 25%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'punctual', label: 'Punctual (On Time)' },
                      { id: 'late_10m', label: 'Late (>10 mins)' },
                      { id: 'absent', label: 'Unannounced Absent' }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setChecklist(prev => ({ ...prev, lecturerPunctuality: opt.id as any }))}
                        className={`p-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${checklist.lecturerPunctuality === opt.id
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audiovisual Equipment */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>Audiovisual (PA System / Projector)</span>
                    <span className="text-purple-700 font-mono">Weight: 15%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'functional', label: 'Working & Clear' },
                      { id: 'intermittent', label: 'Intermittent / Glitch' },
                      { id: 'faulty', label: 'Broken / Missing' }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setChecklist(prev => ({ ...prev, audiovisualStatus: opt.id as any }))}
                        className={`p-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${checklist.audiovisualStatus === opt.id
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hall Cleanliness */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>Hall Cleanliness & Waste Disposal</span>
                    <span className="text-purple-700 font-mono">Weight: 15%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'compliant', label: 'Sanitary / Clean' },
                      { id: 'minor_litter', label: 'Minor Litter' },
                      { id: 'unsanitary', label: 'Dirty / Unsanitary' }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setChecklist(prev => ({ ...prev, hallCleanliness: opt.id as any }))}
                        className={`p-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${checklist.hallCleanliness === opt.id
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seating Furniture */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>Seating Adequacy & Furniture State</span>
                    <span className="text-purple-700 font-mono">Weight: 15%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sufficient', label: 'Adequate Desks' },
                      { id: 'overcrowded', label: 'Standing Students' },
                      { id: 'broken_furniture', label: 'Broken Benches' }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setChecklist(prev => ({ ...prev, seatingAdequacy: opt.id as any }))}
                        className={`p-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${checklist.seatingAdequacy === opt.id
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ventilation, Syllabus & CA toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-800">Ventilation & Illumination</div>
                  <div className="flex gap-2">
                    {[
                      { id: 'adequate', label: 'Adequate' },
                      { id: 'fair', label: 'Fair' },
                      { id: 'poor_ac_lighting', label: 'Poor / Hot' }
                    ].map((v) => (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => setChecklist(prev => ({ ...prev, ventilationAndLighting: v.id as any }))}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${checklist.ventilationAndLighting === v.id
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-slate-700 border-slate-300'
                          }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Syllabus Outline in Class</div>
                    <div className="text-[11px] text-slate-500">Students possess printed or digital pack</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={checklist.syllabusAvailableToStudents}
                    onChange={(e) => setChecklist(prev => ({ ...prev, syllabusAvailableToStudents: e.target.checked }))}
                    className="w-5 h-5 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Continuous Assessment Date</div>
                    <div className="text-[11px] text-slate-500">Scheduled test date officially declared</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={checklist.continuousAssessmentAnnounced}
                    onChange={(e) => setChecklist(prev => ({ ...prev, continuousAssessmentAnnounced: e.target.checked }))}
                    className="w-5 h-5 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Auditor Remarks & Rectification */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                3. Auditor Remarks & Corrective Action
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Audit Notes / Direct Observations *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record observations, e.g. 'Projector HDMI port requires maintenance, 20 additional chairs needed, lecturer was on time and used multimedia slides effectively'..."
                  value={inspectorRemarks}
                  onChange={(e) => setInspectorRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                />
              </div>

              {calculatedStatus !== 'passed' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Rectification Notice Required (Non-Compliant Criteria Detected)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-medium text-amber-900 mb-1">
                        Remediation Deadline Date
                      </label>
                      <input
                        type="date"
                        value={rectificationDeadline}
                        onChange={(e) => setRectificationDeadline(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg bg-white"
                      />
                    </div>
                    <div className="text-xs text-amber-800 flex items-center">
                      Notification will be dispatched to Dean of Faculty and Directorate of Works for immediate repair requisition.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Logged under Official Seal of Academic Planning Directorate
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#2F6E5F] hover:bg-[#26594D] text-[#FBF9F4] font-medium text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Publish Official Audit to Registry</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Campus Audit Registry */}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#CBDAD6] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#526460]" />
              <input
                type="text"
                placeholder="Search by hall, course code, lecturer, or audit code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-[#CBDAD6] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#2F6E5F] bg-[#EFF3F1] text-[#1A2421]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#526460]">Filter Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs px-3 py-1.5 border border-[#CBDAD6] rounded-lg bg-white text-[#1A2421]"
              >
                <option value="all">All Audits ({qaAudits.length})</option>
                <option value="passed">Passed ({passCount})</option>
                <option value="conditional_pass">Conditional ({conditionalCount})</option>
                <option value="non_compliant">Action Required ({nonCompliantCount})</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAudits.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#CBDAD6] p-5 shadow-xs hover:border-[#12332F]/40 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#12332F] bg-[#EFF3F1] px-2 py-0.5 rounded border border-[#CBDAD6]">
                        {item.auditCode}
                      </span>
                      <span className="text-xs text-[#526460]">
                        {item.auditDate} • {item.timeSlot}
                      </span>
                      <span className="text-xs text-[#CBDAD6]">|</span>
                      <span className="text-xs font-medium text-[#1A2421]">
                        Auditor: {item.inspectorName}
                      </span>
                    </div>

                    <h4 className="font-serif font-semibold text-[#1A2421] text-base mt-2 flex items-center gap-2">
                      <span>{item.hallName}</span>
                      <span className="text-xs font-normal text-[#526460]">({item.building})</span>
                    </h4>

                    <div className="text-xs text-[#526460] mt-1">
                      <strong className="text-[#1A2421]">Course:</strong> {item.courseCode} — {item.courseTitle} • <strong className="text-[#1A2421]">Lecturer:</strong> {item.scheduledLecturer} {item.actualLecturer !== item.scheduledLecturer && <span className="text-[#E7A33E] font-semibold">(Delegate: {item.actualLecturer})</span>}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xl font-medium text-[#1A2421] font-mono">
                        {item.overallScorePercentage}%
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full uppercase ${item.status === 'passed'
                          ? 'bg-[#2F6E5F]/15 text-[#2F6E5F] border border-[#2F6E5F]/30'
                          : item.status === 'conditional_pass'
                            ? 'bg-[#E7A33E]/20 text-[#8F5A0E] border border-[#E7A33E]/40'
                            : 'bg-[#B93826]/15 text-[#B93826] border border-[#B93826]/30'
                        }`}>
                        {item.status === 'passed' ? 'Compliant' : item.status === 'conditional_pass' ? 'Action Notice' : 'Attention Required'}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#526460] mt-1">
                      Headcount: {item.checklist.studentHeadcount} / Capacity: {item.checklist.hallCapacity}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <strong>Auditor Findings:</strong> "{item.inspectorRemarks}"
                </div>

                {item.rectificationDeadline && (
                  <div className="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center justify-between">
                    <span>⚠️ Remediation Notice Dispatched to Faculty Dean</span>
                    <span>Deadline: {item.rectificationDeadline}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
