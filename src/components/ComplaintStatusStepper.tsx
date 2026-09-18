import React from 'react';
import { Check } from 'lucide-react';
import { ComplaintStatus } from '../types';
import { STATUS_PIPELINE, getPipelineStepIndex } from '../utils/complaintTracking';

interface ComplaintStatusStepperProps {
  status: ComplaintStatus;
}

export const ComplaintStatusStepper: React.FC<ComplaintStatusStepperProps> = ({ status }) => {
  if (status === 'escalated') {
    return (
      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase text-purple-700 bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg">
        Escalated to DVC Academic — outside standard pipeline
      </div>
    );
  }

  const currentIndex = getPipelineStepIndex(status);

  return (
    <div className="flex items-center w-full overflow-x-auto pb-1">
      {STATUS_PIPELINE.map((step, idx) => {
        const isDone = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center shrink-0" style={{ minWidth: 64 }}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                  isDone
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-3 h-3" /> : idx + 1}
              </div>
              <span
                className={`text-[9px] mt-1 text-center leading-tight ${
                  isCurrent ? 'font-bold text-amber-700' : isDone ? 'text-emerald-700 font-medium' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STATUS_PIPELINE.length - 1 && (
              <div className={`flex-1 h-0.5 mb-4 min-w-[12px] ${idx < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};