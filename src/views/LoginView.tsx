import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Activity, BookOpen, Users } from 'lucide-react';
import { PageView, User } from '../types';
import { StoreService } from '../services/store';

interface LoginViewProps {
  setCurrentView: (view: PageView) => void;
  onLoginSuccess: (user: User) => void;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  setCurrentView,
  onLoginSuccess,
  showToast,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast('warning', 'Missing Fields', 'Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    const result = await StoreService.loginUser(email, password);
    setIsLoading(false);

    if (!result.success || !result.user) {
      showToast('error', 'Login Failed', result.error || 'Invalid email or password.');
      return;
    }

    const user = result.user;
    onLoginSuccess(user);
    showToast('success', 'Welcome Back!', `Signed in as ${user.firstName} ${user.lastName}.`);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const result = await StoreService.signInWithGoogle();
    setIsGoogleLoading(false);

    if (result.success && result.user) {
      onLoginSuccess(result.user);
      showToast('success', 'Google Sign-In Successful', `Welcome, ${result.user.firstName}!`);
    } else {
      showToast('error', 'Sign-In Failed', result.error || 'Google authentication was not completed.');
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('warning', 'Email Required', 'Please enter your email address first.');
      return;
    }
    await StoreService.sendPasswordReset(email);
    showToast('success', 'Reset Email Sent', `Password reset instructions sent to ${email}.`);
  };

  const fillDemo = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setEmail('tshiamo@rovertrading.com');
      setPassword('password123');
    } else {
      setEmail('admin@rovertrading.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4 sm:px-6 relative z-10">
      <div className="w-full max-w-[1050px] bg-[#101917] border border-[#27342e] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 animate-in fade-in duration-300">
        {/* Left Side: Brand & Benefits */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#12221b] via-[#0d1714] to-[#070c0b] p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#27342e]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173d28] border border-[#27342e] text-[#a3e635] text-[11px] font-bold tracking-wider uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse" />
              Welcome Back
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
              Read the market.{' '}
              <span className="text-[#a3e635]">One candle</span> at a time.
            </h1>

            <p className="text-xs sm:text-sm text-[#94a69a] leading-relaxed mb-8">
              Log in to access your Rover Trading student dashboard, track your payment status, and prepare for your scheduled live classes.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3.5 text-xs text-[#94a69a]">
                <div className="w-8 h-8 rounded-lg bg-[#173d28] text-[#a3e635] flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <span>Access your personal member dashboard</span>
              </div>
              <div className="flex items-center gap-3.5 text-xs text-[#94a69a]">
                <div className="w-8 h-8 rounded-lg bg-[#173d28] text-[#a3e635] flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span>Follow your structured 3-chapter curriculum</span>
              </div>
              <div className="flex items-center gap-3.5 text-xs text-[#94a69a]">
                <div className="w-8 h-8 rounded-lg bg-[#173d28] text-[#a3e635] flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <span>Join the live Zoom community sessions</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-[#1e2b25] text-xs text-[#94a69a]">
            Need help? Reach out on WhatsApp or email rovertrading1@gmail.com
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Sign In</h2>
            <p className="text-xs sm:text-sm text-[#94a69a]">
              Don't have an account yet?{' '}
              <button
                onClick={() => setCurrentView('signup')}
                className="text-[#a3e635] font-semibold hover:underline"
              >
                Create one here
              </button>
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 p-3.5 bg-[#15211d] border border-[#27342e] rounded-2xl flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-[#94a69a] uppercase tracking-wider">
              Test Accounts:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="px-2.5 py-1 text-[11px] font-bold bg-[#173d28] text-[#a3e635] rounded-lg hover:bg-[#1e4e33] transition-colors"
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="px-2.5 py-1 text-[11px] font-bold bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors"
              >
                Admin Demo
              </button>
            </div>
          </div>

          {/* Google 1-Click Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full mb-5 py-3 px-4 rounded-xl font-bold text-xs bg-[#15211d] border border-[#27342e] hover:border-white/30 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting with Google...' : 'Continue with Google Account'}</span>
          </button>

          <div className="relative py-2 mb-5 flex items-center justify-center">
            <div className="border-t border-[#1e2b25] w-full" />
            <span className="bg-[#101917] px-3 text-[11px] uppercase tracking-widest text-[#94a69a] absolute">
              or sign in with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#94a69a] mb-2 tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-[#15211d] border border-[#27342e] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-[#94a69a]/50 focus:outline-none focus:border-[#a3e635] transition-colors"
                />
                <Mail className="w-4 h-4 text-[#94a69a] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#94a69a] mb-2 tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#15211d] border border-[#27342e] rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-[#94a69a]/50 focus:outline-none focus:border-[#a3e635] transition-colors"
                />
                <Lock className="w-4 h-4 text-[#94a69a] absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a69a] hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[#94a69a] cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-[#27342e] bg-[#15211d] text-[#a3e635] focus:ring-0 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#a3e635] hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-black hover:opacity-90 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In ↗</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('signup')}
              className="w-full py-3 rounded-xl font-bold text-xs text-white border border-[#27342e] hover:border-[#a3e635] hover:bg-white/5 transition-all text-center block"
            >
              Create a new account →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
