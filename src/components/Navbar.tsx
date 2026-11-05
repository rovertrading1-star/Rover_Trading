import React, { useState } from 'react';
import { Menu, X, Shield, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { PageView, User } from '../types';

interface NavbarProps {
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onLogout,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileOpen(false);
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070c0b]/90 backdrop-blur-md border-b border-[#27342e]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 min-h-[72px] flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a3e635] to-[#65a30d] flex items-center justify-center text-black font-extrabold text-xl shadow-[0_0_20px_rgba(163,230,53,0.35)] group-hover:scale-105 transition-transform">
            R
          </div>
          <div>
            <div className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
              ROVER <span className="text-[#a3e635]">TRADING</span>
              {currentUser?.role === 'admin' && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded tracking-wide uppercase">
                  Admin
                </span>
              )}
            </div>
            <div className="text-[10px] text-[#94a69a] tracking-wider uppercase hidden sm:block">
              Trading Academy
            </div>
          </div>
        </button>

        {/* Desktop Nav Links (when on home or for quick jumping) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#94a69a]">
          <button
            onClick={() => handleNavClick('about')}
            className="hover:text-white transition-colors"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('curriculum')}
            className="hover:text-white transition-colors"
          >
            Curriculum
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            className="hover:text-white transition-colors"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNavClick('schedule')}
            className="hover:text-white transition-colors"
          >
            Schedule
          </button>
          <button
            onClick={() => handleNavClick('reviews')}
            className="hover:text-white transition-colors"
          >
            Reviews
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="hover:text-white transition-colors"
          >
            FAQ
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="hover:text-white transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentView === 'admin'
                      ? 'bg-[#a3e635] text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                      : 'bg-[#15211d] text-white border border-[#27342e] hover:border-[#a3e635]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Panel
                </button>
              ) : null}

              <button
                onClick={() => setCurrentView('dashboard')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-[#a3e635] text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                    : 'bg-[#15211d] text-white border border-[#27342e] hover:border-[#a3e635]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard ({currentUser.firstName})
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-[#94a69a] hover:text-[#ff7777] rounded-xl hover:bg-white/5 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('login')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentView === 'login'
                    ? 'bg-white/10 text-white border border-[#a3e635]'
                    : 'text-white hover:text-[#a3e635] border border-[#27342e] bg-[#101917]'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setCurrentView('signup')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-black hover:opacity-90 transition-all shadow-[0_0_15px_rgba(163,230,53,0.25)] hover:shadow-[0_0_20px_rgba(163,230,53,0.4)]"
              >
                Get Started ↗
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-white hover:text-[#a3e635] transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#27342e] bg-[#0a100e] px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-3 font-medium text-sm text-[#94a69a]">
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-1 hover:text-white"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('curriculum')}
              className="text-left py-1 hover:text-white"
            >
              Curriculum
            </button>
            <button
              onClick={() => handleNavClick('pricing')}
              className="text-left py-1 hover:text-white"
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavClick('schedule')}
              className="text-left py-1 hover:text-white"
            >
              Schedule
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="text-left py-1 hover:text-white"
            >
              Reviews
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-left py-1 hover:text-white"
            >
              FAQ
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left py-1 hover:text-white"
            >
              Contact
            </button>
          </div>

          <div className="pt-4 border-t border-[#27342e] flex flex-col gap-2">
            {currentUser ? (
              <>
                <div className="text-xs text-[#94a69a] mb-1">
                  Signed in as <strong className="text-white">{currentUser.firstName} {currentUser.lastName}</strong>
                </div>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      setCurrentView('admin');
                      setMobileOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-[#15211d] text-[#a3e635] border border-[#27342e]"
                  >
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    setMobileOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-[#a3e635] text-black"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full py-2 rounded-xl text-center text-xs font-bold text-[#ff7777] hover:bg-white/5"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setCurrentView('login');
                    setMobileOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white border border-[#27342e] bg-[#101917]"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setCurrentView('signup');
                    setMobileOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-[#a3e635] text-black"
                >
                  Get Started ↗
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
