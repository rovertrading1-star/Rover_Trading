import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  msg: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => {
        const borderColors = {
          success: 'border-l-[#22c55e]',
          error: 'border-l-[#ef4444]',
          warning: 'border-l-[#f59e0b]',
          info: 'border-l-[#a3e635]',
        };
        const iconColors = {
          success: 'text-[#22c55e]',
          error: 'text-[#ef4444]',
          warning: 'text-[#f59e0b]',
          info: 'text-[#a3e635]',
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto bg-[#101917] border border-[#27342e] border-l-4 ${borderColors[t.type]} rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-in slide-in-from-right-4 duration-200 backdrop-blur-md`}
          >
            <div className={`mt-0.5 flex-shrink-0 ${iconColors[t.type]}`}>
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
              {t.type === 'info' && <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white mb-0.5">{t.title}</div>
              <div className="text-xs text-[#94a69a] leading-relaxed break-words">{t.msg}</div>
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="text-[#94a69a] hover:text-white p-1 rounded-md"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
