import React, { useState } from 'react';
import {
  User as UserIcon,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Video,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  X,
  ExternalLink,
} from 'lucide-react';
import { PageView, User } from '../types';
import { StoreService } from '../services/store';

interface DashboardViewProps {
  currentUser: User;
  setCurrentView: (view: PageView) => void;
  onLogout: () => void;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  setCurrentView,
  onLogout,
  showToast,
}) => {
  const [showPayModal, setShowPayModal] = useState(false);
  const [user, setUser] = useState<User>(currentUser);

  // Real-time Firestore sync
  React.useEffect(() => {
    setUser(currentUser);
    const unsub = StoreService.subscribeToUser(currentUser.id, (updated) => {
      setUser(updated);
    });
    return () => unsub();
  }, [currentUser]);

  // Sync state if payment changed
  const isPaid = user.paymentStatus === 'paid';

  const formattedDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleSimulatePayment = () => {
    const updated = StoreService.updateUser(user.id, { paymentStatus: 'paid' });
    if (updated) {
      setUser(updated);
      setShowPayModal(false);
      showToast(
        'success',
        'Payment Verified!',
        'Your subscription is now marked as Paid! You now have full access to live classes and course materials.'
      );
    }
  };

  return (
    <div className="max-w-[1050px] mx-auto px-4 sm:px-6 py-10 relative z-10">
      {/* Top Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Welcome back, <span className="text-[#a3e635]">{user.firstName}</span> 👋
        </h1>
        <p className="text-xs sm:text-sm text-[#94a69a]">
          Here is an overview of your Rover Trading student account and learning access.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {/* Account Number */}
        <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 hover:border-[#a3e635]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#173d28] text-[#a3e635] flex items-center justify-center mb-4">
            <UserIcon className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider mb-1">
            Account Number
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#a3e635]">
            {user.accountNumber}
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 hover:border-[#a3e635]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#173d28] text-[#a3e635] flex items-center justify-center mb-4">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider mb-2">
            Subscription Status
          </div>
          <div>
            {isPaid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#173d28] text-[#a3e635] border border-[#a3e635]/30">
                <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
                PAID & ACTIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                PAYMENT PENDING
              </span>
            )}
          </div>
        </div>

        {/* Member Since */}
        <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 hover:border-[#a3e635]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#173d28] text-[#a3e635] flex items-center justify-center mb-4">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider mb-1">
            Member Since
          </div>
          <div className="text-lg font-bold text-white">
            {formattedDate(user.createdAt)}
          </div>
        </div>
      </div>

      {/* Account Details Card */}
      <div className="bg-[#101917] border border-[#27342e] rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-[#a3e635]">◈</span> Account Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider mb-1">
              Account Number
            </div>
            <div className="inline-block px-3 py-1.5 rounded-lg bg-[#15211d] border border-[#27342e] font-mono text-sm font-bold text-[#a3e635]">
              {user.accountNumber}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider mb-1">
              Full Name
            </div>
            <div className="text-sm font-semibold text-white">
              {user.firstName} {user.lastName}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider mb-1">
              Email Address
            </div>
            <div className="text-sm font-semibold text-white">
              {user.email}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider mb-1">
              Cell Number
            </div>
            <div className="text-sm font-semibold text-white">
              {user.cellNumber}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider mb-1">
              Subscription
            </div>
            <div>
              {isPaid ? (
                <span className="text-xs font-bold text-[#a3e635]">Paid (Full Access)</span>
              ) : (
                <span className="text-xs font-bold text-amber-400">Pending Verification</span>
              )}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider mb-1">
              Account Created
            </div>
            <div className="text-sm font-semibold text-white">
              {formattedDate(user.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Required Notice (if unpaid) */}
      {!isPaid && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-6 sm:p-8 mb-8 animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-amber-400">Payment Required</h3>
              <p className="text-xs sm:text-sm text-[#94a69a] leading-relaxed max-w-2xl">
                Your account subscription is currently pending payment confirmation. To unlock live Zoom session links, chapter study notes, and active mentoring, please complete your course fee payment.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setShowPayModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-black hover:opacity-90 transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                >
                  Make Payment / View Banking Details →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Portal Materials */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-[#a3e635]">◎</span> Course Curriculum Access
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chapter 1 Card */}
          <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#a3e635] uppercase">
                Chapter 01
              </span>
              <h4 className="text-base font-bold text-white mt-1 mb-2">Market Foundations</h4>
              <p className="text-xs text-[#94a69a] mb-4">
                Candlestick basics, order types, broker setup, and history of modern trading.
              </p>
            </div>
            {isPaid ? (
              <div className="pt-4 border-t border-[#1e2b25] flex items-center justify-between text-xs">
                <span className="text-[#a3e635] font-bold">Unlocked</span>
                <span className="text-white hover:underline cursor-pointer">View Materials ↗</span>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#1e2b25] text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Locked until payment
              </div>
            )}
          </div>

          {/* Chapter 2 Card */}
          <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#a3e635] uppercase">
                Chapter 02
              </span>
              <h4 className="text-base font-bold text-white mt-1 mb-2">Advanced Market Analysis</h4>
              <p className="text-xs text-[#94a69a] mb-4">
                Market structure shifts, liquidity pools, multi-timeframe analysis & patience.
              </p>
            </div>
            {isPaid ? (
              <div className="pt-4 border-t border-[#1e2b25] flex items-center justify-between text-xs">
                <span className="text-[#a3e635] font-bold">Unlocked</span>
                <span className="text-white hover:underline cursor-pointer">View Materials ↗</span>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#1e2b25] text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Locked until payment
              </div>
            )}
          </div>

          {/* Chapter 3 Card */}
          <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#a3e635] uppercase">
                Chapter 03
              </span>
              <h4 className="text-base font-bold text-white mt-1 mb-2">Psychology & Trading Plans</h4>
              <p className="text-xs text-[#94a69a] mb-4">
                Emotional discipline, risk per trade, economic news events, and execution checklists.
              </p>
            </div>
            {isPaid ? (
              <div className="pt-4 border-t border-[#1e2b25] flex items-center justify-between text-xs">
                <span className="text-[#a3e635] font-bold">Unlocked</span>
                <span className="text-white hover:underline cursor-pointer">View Materials ↗</span>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#1e2b25] text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Locked until payment
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#101917] border border-[#27342e] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowPayModal(false)}
              className="absolute top-5 right-5 text-[#94a69a] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-xs font-bold text-[#a3e635] uppercase tracking-wider block mb-1">
                Rover Trading Bank Transfer
              </span>
              <h3 className="text-xl font-bold text-white">Course Payment Details</h3>
            </div>

            <div className="bg-[#15211d] border border-[#27342e] rounded-2xl p-4 space-y-2.5 text-xs text-[#94a69a] mb-6">
              <div className="flex justify-between py-1 border-b border-[#27342e]">
                <span>Bank:</span>
                <span className="text-white font-semibold">Standard Bank / Capitec</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#27342e]">
                <span>Account Name:</span>
                <span className="text-white font-semibold">Rover Trading Academy</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#27342e]">
                <span>Account Type:</span>
                <span className="text-white font-semibold">Cheque / Savings</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#27342e]">
                <span>Payment Reference:</span>
                <span className="text-[#a3e635] font-mono font-bold">{user.accountNumber}</span>
              </div>
              <div className="text-[11px] text-[#94a69a] pt-1">
                * Please use your account number <strong className="text-[#a3e635]">{user.accountNumber}</strong> as the payment reference so your account can be verified promptly.
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSimulatePayment}
                className="w-full py-3.5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-black hover:opacity-90 transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)]"
              >
                Simulate Payment & Activate Immediately ↗
              </button>
              <button
                onClick={() => setShowPayModal(false)}
                className="w-full py-2.5 rounded-xl text-xs text-[#94a69a] hover:text-white"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
