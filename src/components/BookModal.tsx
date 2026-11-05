import React from 'react';
import { X } from 'lucide-react';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-b from-[#14231e] via-[#0d1614] to-[#080d0c] border border-[#27342e] rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94a69a] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Rover Book Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#a3e635] to-[#65a30d] flex items-center justify-center text-black font-extrabold text-base shadow-[0_0_15px_rgba(163,230,53,0.3)]">
            R
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white">
            ROVER <span className="text-[#a3e635]">TRADING</span>
          </span>
        </div>

        {/* Animated Candles */}
        <div className="flex justify-center items-end gap-3 h-24 my-6 py-2 px-6 bg-[#0a110f] border border-[#1d2a24] rounded-xl">
          <div className="flex flex-col items-center">
            <div className="w-[1px] h-3 bg-[#b4fc78]" />
            <div className="w-3 h-10 bg-[#b4fc78] rounded-xs shadow-[0_0_8px_rgba(180,252,120,0.4)]" />
            <div className="w-[1px] h-3 bg-[#b4fc78]" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-[1px] h-4 bg-[#ff7777]" />
            <div className="w-3 h-8 bg-[#ff7777] rounded-xs shadow-[0_0_8px_rgba(255,119,119,0.4)]" />
            <div className="w-[1px] h-2 bg-[#ff7777]" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-[1px] h-2 bg-[#b4fc78]" />
            <div className="w-3 h-14 bg-[#b4fc78] rounded-xs shadow-[0_0_8px_rgba(180,252,120,0.4)]" />
            <div className="w-[1px] h-3 bg-[#b4fc78]" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-[1px] h-3 bg-[#b4fc78]" />
            <div className="w-3 h-12 bg-[#b4fc78] rounded-xs shadow-[0_0_8px_rgba(180,252,120,0.4)]" />
            <div className="w-[1px] h-2 bg-[#b4fc78]" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 leading-snug">
          Read the market.<br />
          <span className="text-[#a3e635]">One candle at a time.</span>
        </h3>

        <p className="text-sm text-[#94a69a] mb-6 font-medium">Lethabo Loate</p>

        <div className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#17231e] text-[#94a69a] border border-[#27342e]">
          Currently Unavailable (Sold Out)
        </div>
      </div>
    </div>
  );
};
