import { Complaint, ComplaintStatus } from '../types';

// Canonical status pipeline shown to students/officers as a visual tracker,
// mirroring "Submitted → Received → Assigned → Under Review → Action Taken →
// Resolved → Closed". 'triaged' in the data model covers both "Received" and
// "Assigned" as one step. 'escalated' is a branch off this main path, not a
// pipeline step, and is rendered separately.
export const STATUS_PIPELINE: { key: ComplaintStatus; label: string }[] = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'triaged', label: 'Received & Assigned' },
  { key: 'investigating', label: 'Under Review' },
  { key: 'action_taken', label: 'Action Taken' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' }
];

export const getPipelineStepIndex = (status: ComplaintStatus): number => {
  const idx = STATUS_PIPELINE.findIndex(s => s.key === status);
  return idx === -1 ? 0 : idx; // 'escalated' has no pipeline position
};

// hoursRemaining ticks down live (see AppContext's SLA interval), so this
// always reflects the current session's real elapsed time, not a fixed value.
export const formatSlaLabel = (hoursRemaining: number, isBreached: boolean): string => {
  const absHours = Math.abs(hoursRemaining);
  const unit = absHours < 1 ? `${Math.max(1, Math.round(absHours * 60))}m` : `${Math.round(absHours)}h`;
  return isBreached ? `Overdue by ${unit}` : `${unit} left`;
};

// Computed once from the stored submission date + target — a fixed
// calendar date, not tied to the live countdown above.
export const getExpectedResponseDate = (complaint: Complaint): string => {
  const submittedMs = new Date(complaint.submittedAt.replace(' ', 'T')).getTime();
  if (Number.isNaN(submittedMs)) return 'Not available';
  const targetMs = submittedMs + complaint.slaHoursTarget * 60 * 60 * 1000;
  return new Date(targetMs).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getLastUpdateLabel = (complaint: Complaint): string => {
  if (complaint.investigationNotes.length === 0) return complaint.submittedAt;
  return complaint.investigationNotes[complaint.investigationNotes.length - 1].timestamp;
};