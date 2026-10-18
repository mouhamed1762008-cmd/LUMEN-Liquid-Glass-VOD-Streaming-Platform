import React from 'react';
import { useStreaming } from '../context/StreamingContext';
import { CheckCircle2, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStreaming();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel-elevated border border-white/15 text-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'cyan' && <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-slate-400 shrink-0" />}

          <span className="text-xs font-medium text-slate-200 flex-1 leading-snug">
            {toast.message}
          </span>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white transition-colors p-1 -mr-1"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
