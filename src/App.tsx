import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { PageView, User, Review } from './types';
import { StoreService } from './services/store';
import { Navbar } from './components/Navbar';
import { ParticlesBackground } from './components/ParticlesBackground';
import { ToastContainer, ToastItem } from './components/ToastContainer';
import { HomeView } from './views/HomeView';
import { LoginView } from './views/LoginView';
import { SignupView } from './views/SignupView';
import { DashboardView } from './views/DashboardView';
import { AdminView } from './views/AdminView';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(() => StoreService.getCurrentUser());
  const [reviews, setReviews] = useState<Review[]>(() => StoreService.getReviews());
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Real-time Firestore sync for reviews
  useEffect(() => {
    const unsub = StoreService.subscribeToReviews((latest) => {
      setReviews(latest);
    });
    return () => unsub();
  }, []);

  // Monitor scroll progress & back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 450);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    msg: string
  ) => {
    const id = `t_${Date.now()}_${Math.random()}`;
    const newToast: ToastItem = { id, type, title, msg };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = () => {
    StoreService.setCurrentUser(null);
    setCurrentUser(null);
    showToast('info', 'Signed Out', 'You have been safely signed out.');
    setCurrentView('home');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleSignupSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleReviewAdded = (rev: Review) => {
    setReviews(StoreService.getReviews());
    showToast('success', 'Review Submitted', 'Thank you for your valuable feedback!');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#070c0b] text-[#f6faf7] selection:bg-[#a3e635] selection:text-black font-['DM_Sans',sans-serif]">
      {/* Scroll Progress Bar at the top */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#b4fc78] z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Dynamic Animated Particles and Radial Glows */}
      <ParticlesBackground />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Global Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Active View */}
      <main className="relative z-10">
        {currentView === 'home' && (
          <HomeView
            setCurrentView={setCurrentView}
            reviews={reviews}
            onReviewAdded={handleReviewAdded}
            onEnquirySuccess={(msg) => showToast('success', 'Enquiry Sent', msg)}
          />
        )}

        {currentView === 'login' && (
          <LoginView
            setCurrentView={setCurrentView}
            onLoginSuccess={handleLoginSuccess}
            showToast={showToast}
          />
        )}

        {currentView === 'signup' && (
          <SignupView
            setCurrentView={setCurrentView}
            onSignupSuccess={handleSignupSuccess}
            showToast={showToast}
          />
        )}

        {currentView === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            setCurrentView={setCurrentView}
            onLogout={handleLogout}
            showToast={showToast}
          />
        )}

        {currentView === 'admin' && currentUser && (
          <AdminView
            currentUser={currentUser}
            setCurrentView={setCurrentView}
            showToast={showToast}
          />
        )}

        {/* If user visits dashboard or admin while logged out, fallback gracefully */}
        {(currentView === 'dashboard' || currentView === 'admin') && !currentUser && (
          <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 text-center">
            <div className="bg-[#101917] border border-[#27342e] rounded-3xl p-8 max-w-md w-full space-y-4">
              <h2 className="text-xl font-bold text-white">Authentication Required</h2>
              <p className="text-xs text-[#94a69a]">
                You must be logged in to view your account dashboard.
              </p>
              <button
                onClick={() => setCurrentView('login')}
                className="w-full py-3 rounded-xl font-extrabold text-xs bg-[#a3e635] text-black hover:opacity-90 transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)]"
              >
                Go to Login ↗
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#15211d] border border-[#27342e] text-[#a3e635] hover:border-[#a3e635] hover:bg-[#1a2b25] flex items-center justify-center shadow-2xl transition-all duration-300 animate-in fade-in"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
export default App;
