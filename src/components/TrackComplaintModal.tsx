import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Star, 
  FileText, 
  X,
  UserCheck
} from 'lucide-react';

interface TrackComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  onSwitchToLeadership?: () => void;
}

export const TrackComplaintModal: React.FC<TrackComplaintModalProps> = ({ 
  isOpen, 
  onClose,
  initialCode = ''
}) => {
  const { complaints, rateComplaintResolution } = useApp();
  const [searchCode, setSearchCode] = useState(initialCode);
  const [hasSearched, setHasSearched] = useState(!!initialCode);

  // Sync initialCode when opened
  React.useEffect(() => {
    if (isOpen) {
      setSearchCode(initialCode || '');
      setHasSearched(!!initialCode);
    }
  }, [isOpen, initialCode]);

  if (!isOpen) return null;

  const foundComplaint = searchCode.trim() 
    ? complaints.find(c => c.trackingCode.toLowerCase() === searchCode.trim().toLowerCase())
    : null;

  const handleQuickCode = (code: string) => {
    setSearchCode(code);
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm">Track Complaint / SERVICOM SLA Status</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 text-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Enter Tracking Code:</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. SRV-2025-0142"
                value={searchCode}
                onChange={(e) => {
                  setSearchCode(e.target.value);
                  setHasSearched(true);
                }}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-semibold uppercase bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 flex-wrap">
              <span>Try sample dockets:</span>
              {complaints.slice(0, 3).map(c => (
                <button
                  key={c.id}
                  onClick={() => handleQuickCode(c.trackingCode)}
                  className="font-mono bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200 cursor-pointer"
                >
                  {c.trackingCode}
                </button>
              ))}
            </div>
          </div>

          {hasSearched && searchCode.trim().length > 0 && !foundComplaint && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-center text-rose-700">
              <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-rose-500" />
              <p className="font-semibold">No docket found for "{searchCode}"</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Please check the code or contact the SERVICOM Nodal Desk.</p>
            </div>
          )}

          {foundComplaint && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
                <div>
                  <span className="font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {foundComplaint.trackingCode}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">
                    {foundComplaint.title}
                  </h4>
                  <div className="text-[11px] text-slate-500">
                    Location: {foundComplaint.location} • Filed on {foundComplaint.submittedAt}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    foundComplaint.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : foundComplaint.isSlaBreached
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {foundComplaint.status.replace('_', ' ')}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {foundComplaint.isSlaBreached ? 'SLA Breached' : `SLA: ${foundComplaint.slaHoursRemaining}h remaining`}
                  </div>
                </div>
              </div>

              <div className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 text-xs italic">
                "{foundComplaint.description}"
              </div>

              {foundComplaint.resolutionSummary && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-950">
                  <div className="font-bold flex items-center gap-1 text-xs text-emerald-900 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official Resolution Summary:</span>
                  </div>
                  <p className="text-xs">{foundComplaint.resolutionSummary}</p>
                </div>
              )}

              <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                <div><strong>Assigned Unit:</strong> {foundComplaint.assignedUnit || 'SERVICOM Nodal Desk'}</div>
                <div><strong>Assigned Officer:</strong> {foundComplaint.assignedOfficer || 'Mrs. Grace Danladi'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
