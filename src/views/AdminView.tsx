import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  AlertCircle,
  Search,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  Shield,
  Download,
  Calendar,
} from 'lucide-react';
import { PageView, User, Enquiry, Review } from '../types';
import { StoreService } from '../services/store';

interface AdminViewProps {
  currentUser: User;
  setCurrentView: (view: PageView) => void;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  setCurrentView,
  showToast,
}) => {
  const [users, setUsers] = useState<User[]>(() => StoreService.getUsers());
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => StoreService.getEnquiries());
  const [reviews, setReviews] = useState<Review[]>(() => StoreService.getReviews());
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'members' | 'enquiries' | 'reviews'>('members');

  // Real-time Firestore sync for Admin panel
  React.useEffect(() => {
    const unsubMembers = StoreService.subscribeToMembers((m) => setUsers(m));
    const unsubReviews = StoreService.subscribeToReviews((r) => setReviews(r));
    return () => {
      unsubMembers();
      unsubReviews();
    };
  }, []);

  const totalMembers = users.length;
  const paidMembers = users.filter((u) => u.paymentStatus === 'paid').length;
  const unpaidMembers = users.filter((u) => u.paymentStatus !== 'paid').length;

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.accountNumber.toLowerCase().includes(q) ||
      (u.cellNumber && u.cellNumber.includes(q))
    );
  });

  const handleTogglePay = async (userId: string) => {
    const updated = await StoreService.togglePayment(userId);
    if (updated) {
      setUsers(StoreService.getUsers());
      showToast(
        'success',
        'Status Updated',
        `${updated.firstName} ${updated.lastName} is now marked as ${updated.paymentStatus.toUpperCase()}.`
      );
    }
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (userId === currentUser.id) {
      showToast('error', 'Cannot Delete Self', 'You cannot delete the active logged in admin account.');
      return;
    }
    StoreService.deleteUser(userId);
    setUsers(StoreService.getUsers());
    showToast('info', 'Member Removed', `${name} was removed from the member directory.`);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rover_trading_members_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('success', 'Export Complete', 'Members exported to JSON file.');
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 relative z-10">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Admin <span className="text-[#a3e635]">Dashboard</span>
            </h1>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded tracking-wide uppercase">
              Management
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#94a69a]">
            Manage all Rover Trading student accounts, payment verifications, and enquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#15211d] text-white border border-[#27342e] hover:border-[#a3e635] transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 hover:border-[#a3e635]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#173d28] text-[#a3e635] flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider mb-1">
            Total Members
          </div>
          <div className="text-3xl font-extrabold text-white">{totalMembers}</div>
        </div>

        <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 hover:border-[#a3e635]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider mb-1">
            Paid Members
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{paidMembers}</div>
        </div>

        <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 hover:border-[#a3e635]/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider mb-1">
            Unpaid / Pending
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{unpaidMembers}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#27342e] mb-6 gap-2">
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'members'
              ? 'text-[#a3e635] border-b-2 border-[#a3e635]'
              : 'text-[#94a69a] hover:text-white'
          }`}
        >
          Members Directory ({totalMembers})
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'enquiries'
              ? 'text-[#a3e635] border-b-2 border-[#a3e635]'
              : 'text-[#94a69a] hover:text-white'
          }`}
        >
          Enrollment Enquiries ({enquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'reviews'
              ? 'text-[#a3e635] border-b-2 border-[#a3e635]'
              : 'text-[#94a69a] hover:text-white'
          }`}
        >
          Published Reviews ({reviews.length})
        </button>
      </div>

      {/* TAB 1: MEMBERS DIRECTORY */}
      {activeTab === 'members' && (
        <div className="bg-[#101917] border border-[#27342e] rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 sm:p-6 border-b border-[#27342e] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <h3 className="text-base font-bold text-white">All Members ({filteredUsers.length})</h3>

            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, RT #..."
                className="w-full bg-[#15211d] border border-[#27342e] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#94a69a]/60 focus:outline-none focus:border-[#a3e635]"
              />
              <Search className="w-3.5 h-3.5 text-[#94a69a] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-[#27342e] uppercase text-[10px] tracking-wider text-[#94a69a] font-bold">
                <tr>
                  <th className="py-3.5 px-5">Account #</th>
                  <th className="py-3.5 px-5">Name</th>
                  <th className="py-3.5 px-5">Email</th>
                  <th className="py-3.5 px-5">Cell</th>
                  <th className="py-3.5 px-5">Joined</th>
                  <th className="py-3.5 px-5">Payment</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2b25]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#94a69a]">
                      No members matching "{search}"
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isUserPaid = u.paymentStatus === 'paid';
                    return (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-5 font-mono font-bold text-[#a3e635]">
                          {u.accountNumber}
                        </td>
                        <td className="py-4 px-5 font-semibold text-white">
                          {u.firstName} {u.lastName}
                          {u.role === 'admin' && (
                            <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                              Admin
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-[#94a69a]">{u.email}</td>
                        <td className="py-4 px-5 text-[#94a69a]">{u.cellNumber || '—'}</td>
                        <td className="py-4 px-5 text-[#94a69a]">{formatDate(u.createdAt)}</td>
                        <td className="py-4 px-5">
                          {isUserPaid ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#173d28] text-[#a3e635] border border-[#a3e635]/30">
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              Unpaid
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-right space-x-2">
                          <button
                            onClick={() => handleTogglePay(u.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              isUserPaid
                                ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                                : 'bg-[#173d28] text-[#a3e635] hover:bg-[#1f5035] border border-[#a3e635]/30'
                            }`}
                          >
                            {isUserPaid ? 'Mark Unpaid' : 'Mark Paid'}
                          </button>
                          {u.id !== currentUser.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id, `${u.firstName} ${u.lastName}`)}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 className="w-3 h-3 inline" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="bg-[#101917] border border-[#27342e] rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 sm:p-6 border-b border-[#27342e]">
            <h3 className="text-base font-bold text-white">
              Course Enrollment Inquiries ({enquiries.length})
            </h3>
            <p className="text-xs text-[#94a69a]">
              Prospects who submitted their details via the public landing page form.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-[#27342e] uppercase text-[10px] tracking-wider text-[#94a69a] font-bold">
                <tr>
                  <th className="py-3.5 px-5">Prospect Name</th>
                  <th className="py-3.5 px-5">Email</th>
                  <th className="py-3.5 px-5">Phone</th>
                  <th className="py-3.5 px-5">Course Selected</th>
                  <th className="py-3.5 px-5">Date Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2b25]">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#94a69a]">
                      No enrollment inquiries yet.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-5 font-semibold text-white">{enq.fullName}</td>
                      <td className="py-4 px-5 text-[#a3e635]">
                        <a href={`mailto:${enq.email}`} className="hover:underline">
                          {enq.email}
                        </a>
                      </td>
                      <td className="py-4 px-5 text-[#94a69a]">{enq.contactNumber}</td>
                      <td className="py-4 px-5 font-semibold text-white">{enq.course}</td>
                      <td className="py-4 px-5 text-[#94a69a]">{formatDate(enq.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="bg-[#101917] border border-[#27342e] rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white mb-2">
            Published Reviews ({reviews.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-[#15211d] border border-[#27342e] rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-sm text-white font-bold">{r.name}</strong>
                    <div className="flex text-[#ffd700] text-xs">{'★'.repeat(r.rating)}</div>
                  </div>
                  <div className="text-[11px] text-[#a3e635] mb-2">{r.course}</div>
                  <p className="text-xs text-[#94a69a] italic">"{r.text}"</p>
                </div>
                <div className="pt-3 mt-3 border-t border-[#27342e] text-[10px] text-[#94a69a] flex justify-between">
                  <span>{formatDate(r.date)}</span>
                  <span className="text-[#a3e635]">Live on Website</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tip Banner */}
      <div className="mt-8 p-4 rounded-2xl bg-[#101917] border border-[#27342e] text-xs text-[#94a69a] flex items-center justify-between">
        <div>
          <strong className="text-white">Admin Notice:</strong> Toggle payment status to immediately unlock course materials on the student's dashboard.
        </div>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="text-[#a3e635] font-bold hover:underline"
        >
          View Student Portal →
        </button>
      </div>
    </div>
  );
};
