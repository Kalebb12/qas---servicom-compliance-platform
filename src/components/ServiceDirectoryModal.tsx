import React, { useState } from 'react';
import {
  X,
  Compass,
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  MapPin,
  FileText,
  ShieldAlert,
  ClipboardList,
  Wallet,
  Home,
  PenSquare,
  CreditCard,
  GraduationCap,
  HeartPulse,
  BookOpen,
  Wifi
} from 'lucide-react';
import { ComplaintCategory, DirectoryCategoryId, ServiceDirectoryEntry } from '../types';
import { SERVICE_DIRECTORY } from '../data/mockData';

interface ServiceDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileComplaint: (category: ComplaintCategory) => void;
}

// One icon per directory category, kept in its own map so the entry data stays plain/serializable.
const CATEGORY_ICONS: Record<DirectoryCategoryId, React.ReactNode> = {
  registration: <ClipboardList className="w-5 h-5" />,
  transcript: <FileText className="w-5 h-5" />,
  hostel: <Home className="w-5 h-5" />,
  fees: <Wallet className="w-5 h-5" />,
  examination: <PenSquare className="w-5 h-5" />,
  id_card: <CreditCard className="w-5 h-5" />,
  academic_issues: <GraduationCap className="w-5 h-5" />,
  health_services: <HeartPulse className="w-5 h-5" />,
  library: <BookOpen className="w-5 h-5" />,
  ict: <Wifi className="w-5 h-5" />
};

export const ServiceDirectoryModal: React.FC<ServiceDirectoryModalProps> = ({
  isOpen,
  onClose,
  onFileComplaint
}) => {
  const [selected, setSelected] = useState<ServiceDirectoryEntry | null>(null);

  // Reset back to the category grid every time the modal is opened fresh.
  React.useEffect(() => {
    if (isOpen) setSelected(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setSelected(null);
  };

  const handleFileComplaint = () => {
    if (!selected) return;
    onFileComplaint(selected.relatedComplaintCategory);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selected ? (
              <button
                onClick={() => setSelected(null)}
                className="p-1 -ml-1 rounded hover:bg-white/10 cursor-pointer"
                aria-label="Back to categories"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <Compass className="w-4 h-4 text-amber-400" />
            )}
            <h3 className="font-bold text-sm">
              {selected ? selected.label : 'Where Do I Go? — Service Directory'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 text-lg cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 text-xs">
          {!selected ? (
            <>
              <p className="text-slate-600 mb-4">
                <span className="font-semibold text-slate-800">What do you need help with?</span>{' '}
                Pick a category to see which unit handles it, before filing a complaint in the wrong place.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SERVICE_DIRECTORY.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setSelected(entry)}
                    className="flex flex-col items-start gap-2 p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/60 text-left transition-all cursor-pointer"
                  >
                    <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                      {CATEGORY_ICONS[entry.id]}
                    </span>
                    <span className="font-semibold text-slate-800 text-[11px] leading-tight">
                      {entry.label}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                      {entry.shortDescription}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2 pb-2 border-b border-slate-200">
                  <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      This request is handled by
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      {selected.responsibleUnit}
                    </div>
                    <div className="text-[11px] text-slate-500">{selected.building}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-500">Email</div>
                      <div className="text-slate-800">{selected.contactEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-500">Phone</div>
                      <div className="text-slate-800">{selected.contactPhone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-500">Office Hours</div>
                      <div className="text-slate-800">{selected.officeHours}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-500">Expected Processing Time</div>
                      <div className="text-slate-800">{selected.expectedProcessingTime}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold text-slate-500 mb-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Required Documents</span>
                  </div>
                  <ul className="space-y-1">
                    {selected.requiredDocuments.map((doc, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-slate-700">
                        <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  ← Browse Other Categories
                </button>
                <button
                  onClick={handleFileComplaint}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  Still an issue? File a complaint about this
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                Only file a complaint if you've already tried this unit and the issue wasn't resolved.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};