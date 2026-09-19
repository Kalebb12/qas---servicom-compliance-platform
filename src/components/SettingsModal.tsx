import React from "react";
import {
  Check,
  Moon,
  Sun,
  Type,
  VolumeX,
  X,
  Accessibility,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    theme,
    setTheme,
    fontScale,
    setFontScale,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
  } = useApp();

  if (!isSettingsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark-panel">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 p-4 text-white">
          <div className="flex items-center gap-2">
            <Accessibility className="h-4 w-4 text-amber-400" />
            <h2 id="settings-title" className="text-sm font-bold">
              Accessibility & Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5 text-sm text-slate-800">
          <section>
            <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Sun className="h-3.5 w-3.5" /> Appearance
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(["light", "dark"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTheme(option)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${theme === option ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  {option === "light" ? (
                    <Sun className="h-3.5 w-3.5" />
                  ) : (
                    <Moon className="h-3.5 w-3.5" />
                  )}
                  {option === "light" ? "Light mode" : "Dark mode"}
                  {theme === option && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Type className="h-3.5 w-3.5" /> Text size
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(["default", "large", "xlarge"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFontScale(option)}
                  className={`rounded-lg border px-2 py-2 font-semibold ${fontScale === option ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 hover:bg-slate-50"} ${option === "large" ? "text-sm" : option === "xlarge" ? "text-base" : "text-xs"}`}
                >
                  {option === "default"
                    ? "Default"
                    : option === "large"
                      ? "Large"
                      : "Extra large"}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-4">
            <label className="flex items-center justify-between gap-3">
              <span>
                <strong className="block text-xs">High contrast</strong>
                <span className="text-[11px] text-slate-500">
                  Increase borders and text contrast.
                </span>
              </span>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(event) => setHighContrast(event.target.checked)}
                className="h-4 w-4 accent-blue-600"
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <VolumeX className="h-4 w-4 text-slate-500" />
                <span>
                  <strong className="block text-xs">Reduce motion</strong>
                  <span className="text-[11px] text-slate-500">
                    Limit animation and transitions.
                  </span>
                </span>
              </span>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(event) => setReducedMotion(event.target.checked)}
                className="h-4 w-4 accent-blue-600"
              />
            </label>
          </section>
        </div>
      </div>
    </div>
  );
};
