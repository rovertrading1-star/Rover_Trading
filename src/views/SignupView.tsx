import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { PageView, User } from '../types';
import { StoreService } from '../services/store';

interface SignupViewProps {
  setCurrentView: (view: PageView) => void;
  onSignupSuccess: (user: User) => void;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void;
}

export const SignupView: React.FC<SignupViewProps> = ({
  setCurrentView,
  onSignupSuccess,
  showToast,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cell, setCell] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Compute password strength 0 to 4
  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-amber-400', 'bg-[#a3e635]'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      showToast('warning', 'Name Required', 'Please enter your first name and surname.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('warning', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!cell.trim() || cell.replace(/[\s\-()]/g, '').length < 9) {
      showToast('warning', 'Invalid Cell', 'Please enter a valid phone number.');
      return;
    }
    if (password.length < 8) {
      showToast('warning', 'Weak Password', 'Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      showToast('error', 'Mismatch', 'Passwords do not match.');
      return;
    }
    if (!agree) {
      showToast('warning', 'Terms Required', 'Please accept the Terms & Conditions.');
      return;
    }

    setIsLoading(true);

    const result = await StoreService.registerUser({
      firstName,
      lastName,
      email,
      cellNumber: cell,
      password,
    });

    setIsLoading(false);

    if (!result.success || !result.user) {
      showToast('error', 'Signup Failed', result.error || 'Could not register account.');
      return;
    }

    const newUser = result.user;
    showToast(
      'success',
      'Account Created!',
      `Your account number is ${newUser.accountNumber}. Welcome to Rover Trading!`
    );
    onSignupSuccess(newUser);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4 sm:px-6 relative z-10">
      <div className="w-full max-w-[1100px] bg-[#101917] border border-[#27342e] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 animate-in fade-in duration-300">
        {/* Left Side: Pitch */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#12221b] via-[#0d1714] to-[#070c0b] p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#27342e]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173d28] border border-[#27342e] text-[#a3e635] text-[11px] font-bold tracking-wider uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-ping" />
              Structured Live Trading Education
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
              Start your trading journey <span className="text-[#a3e635]">today.</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#94a69a] leading-relaxed mb-8">
              Join the Rover Trading community and learn to read the market, one candle at a time. Create your account to access the student portal.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3.5 text-xs text-[#94a69a]">
                <div className="w-8 h-8 rounded-lg bg-[#173d28] text-[#a3e635] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Live trading education sessions with active Q&A</span>
              </div>
              <div className="flex items-center gap-3.5 text-xs text-[#94a69a]">
                <div className="w-8 h-8 rounded-lg bg-[#173d28] text-[#a3e635] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Price action & institutional market structure</span>
              </div>
              <div className="flex items-center gap-3.5 text-xs text-[#94a69a]">
                <div className="w-8 h-8 rounded-lg bg-[#173d28] text-[#a3e635] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Build your own repeatable trading playbook</span>
              </div>
              <div className="flex items-center gap-3.5 text-xs text-[#94a69a]">
                <div className="w-8 h-8 rounded-lg bg-[#173d28] text-[#a3e635] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Dedicated mentor support and accountability</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-[#1e2b25] text-xs text-[#94a69a]">
            Already enrolled?{' '}
            <button
              onClick={() => setCurrentView('login')}
              className="text-[#a3e635] font-bold hover:underline"
            >
              Sign into your account →
            </button>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Create Account</h2>
            <p className="text-xs sm:text-sm text-[#94a69a]">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentView('login')}
                className="text-[#a3e635] font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#94a69a] mb-1.5 tracking-wider">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full bg-[#15211d] border border-[#27342e] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#94a69a]/50 focus:outline-none focus:border-[#a3e635]"
                  />
                  <UserIcon className="w-4 h-4 text-[#94a69a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#94a69a] mb-1.5 tracking-wider">
                  Surname
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full bg-[#15211d] border border-[#27342e] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#94a69a]/50 focus:outline-none focus:border-[#a3e635]"
                  />
                  <UserIcon className="w-4 h-4 text-[#94a69a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#94a69a] mb-1.5 tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-[#15211d] border border-[#27342e] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#94a69a]/50 focus:outline-none focus:border-[#a3e635]"
                />
                <Mail className="w-4 h-4 text-[#94a69a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#94a69a] mb-1.5 tracking-wider">
                Cell Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={cell}
                  onChange={(e) => setCell(e.target.value)}
                  placeholder="+27 81 234 5678"
                  className="w-full bg-[#15211d] border border-[#27342e] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#94a69a]/50 focus:outline-none focus:border-[#a3e635]"
                />
                <Phone className="w-4 h-4 text-[#94a69a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#94a69a] mb-1.5 tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password (min 8 chars)"
                  className="w-full bg-[#15211d] border border-[#27342e] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-[#94a69a]/50 focus:outline-none focus:border-[#a3e635]"
                />
                <Lock className="w-4 h-4 text-[#94a69a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a69a] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          bar <= strength ? strengthColors[strength] : 'bg-[#27342e]'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-[#94a69a] flex justify-between font-mono">
                    <span>Password Strength:</span>
                    <span className="font-bold text-white">{strengthLabels[strength]}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#94a69a] mb-1.5 tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full bg-[#15211d] border border-[#27342e] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#94a69a]/50 focus:outline-none focus:border-[#a3e635]"
                />
                <Lock className="w-4 h-4 text-[#94a69a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 text-xs text-[#94a69a] cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="rounded border-[#27342e] bg-[#15211d] text-[#a3e635] focus:ring-0 cursor-pointer"
                />
                <span>I agree to the Terms & Conditions and academy code of conduct</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-black hover:opacity-90 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <span>Create Account ↗</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
