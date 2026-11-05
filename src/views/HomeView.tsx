import React, { useState } from 'react';
import {
  ArrowRight,
  TrendingUp,
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  Star,
  MessageCircle,
  Video,
  Laptop,
  Layers,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { CandleChart } from '../components/CandleChart';
import { BookModal } from '../components/BookModal';
import { Review, PageView } from '../types';
import { StoreService } from '../services/store';

interface HomeViewProps {
  setCurrentView: (view: PageView) => void;
  reviews: Review[];
  onReviewAdded: (rev: Review) => void;
  onEnquirySuccess: (msg: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentView,
  reviews,
  onReviewAdded,
  onEnquirySuccess,
}) => {
  const [bookModalOpen, setBookModalOpen] = useState(false);

  // Review Form state
  const [revRating, setRevRating] = useState<number>(5);
  const [revName, setRevName] = useState('');
  const [revCourse, setRevCourse] = useState('Premium Course');
  const [revText, setRevText] = useState('');
  const [revSuccess, setRevSuccess] = useState(false);

  // Enroll Form state
  const [enrollName, setEnrollName] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollPhone, setEnrollPhone] = useState('');
  const [enrollCourse, setEnrollCourse] = useState('Standard Course - R150');
  const [enrollSubmitting, setEnrollSubmitting] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState<string | null>(null);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculate Average Rating
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revText.trim()) return;

    const added = await StoreService.addReview({
      name: revName,
      course: revCourse,
      rating: revRating,
      text: revText,
    });
    onReviewAdded(added);
    setRevSuccess(true);
    setRevName('');
    setRevText('');
    setTimeout(() => setRevSuccess(false), 5000);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollName.trim() || !enrollEmail.trim() || !enrollPhone.trim()) return;

    setEnrollSubmitting(true);
    await StoreService.addEnquiry({
      fullName: enrollName,
      email: enrollEmail,
      contactNumber: enrollPhone,
      course: enrollCourse,
    });
    setEnrollSubmitting(false);
    setEnrollMessage('✓ Your enquiry has been sent successfully! We will respond within 24 hours.');
    onEnquirySuccess(`Enquiry received for ${enrollName}! We'll contact you soon.`);
    setEnrollName('');
    setEnrollEmail('');
    setEnrollPhone('');
    setTimeout(() => setEnrollMessage(null), 8000);
  };

  return (
    <div className="relative z-10">
      {/* 1. HERO SECTION */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#173d28]/70 border border-[#27342e] text-[#b4fc78] text-xs font-extrabold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#b4fc78] animate-ping" />
                Structured Live Trading Education
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold leading-[1.08] tracking-tight text-white">
                Read the market.{' '}
                <span className="text-[#a3e635] drop-shadow-[0_0_25px_rgba(163,230,53,0.3)]">
                  One candle
                </span>{' '}
                at a time.
              </h1>

              <p className="text-base sm:text-lg text-[#94a69a] max-w-xl leading-relaxed">
                Learn to understand price action, analyse markets, build trading discipline and develop
                your own systematic trading plan with the Rover Trading Program.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#enroll"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(163,230,53,0.35)]"
                >
                  Start Learning ↗
                </a>
                <a
                  href="#curriculum"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-transparent hover:bg-white/5 text-white border border-[#27342e] hover:border-[#a3e635] transition-all"
                >
                  Explore Curriculum <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1e2b25] max-w-md">
                <div>
                  <div className="text-3xl font-extrabold text-white">03</div>
                  <div className="text-xs text-[#94a69a]">Learning chapters</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">06</div>
                  <div className="text-xs text-[#94a69a]">Week duration</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-[#a3e635]">Live</div>
                  <div className="text-xs text-[#94a69a]">Practical sessions</div>
                </div>
              </div>
            </div>

            {/* Right Column: Simulated Price Action Chart */}
            <div className="lg:col-span-5">
              <CandleChart />
              <p className="text-center text-[11px] text-[#94a69a] mt-2.5">
                Simulated educational price feed illustration. Not a live execution signal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="py-20 border-t border-[#192420]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-extrabold text-[#a3e635] tracking-widest uppercase">
              Why Rover Trading?
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Build knowledge before <span className="text-[#a3e635]">taking market risks.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#94a69a]">
              Our program introduces the foundations of financial markets before progressing into
              advanced analysis, trading plans, emotional discipline and guided live practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-7 hover:border-[#a3e635]/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#173d28] text-[#a3e635] flex items-center justify-center font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                ◈
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Understand the Market</h3>
              <p className="text-sm text-[#94a69a] leading-relaxed">
                Learn how global financial markets work, why liquidity moves prices, and how to
                interpret institutional candlestick behaviour with confidence.
              </p>
            </div>

            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-7 hover:border-[#a3e635]/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#173d28] text-[#a3e635] flex items-center justify-center font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                ⌁
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Learn Through Practice</h3>
              <p className="text-sm text-[#94a69a] leading-relaxed">
                Combine theoretical lessons with a full week of hands-on practical execution and chart
                breakdowns after every single chapter.
              </p>
            </div>

            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-7 hover:border-[#a3e635]/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#173d28] text-[#a3e635] flex items-center justify-center font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                ◎
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Develop Discipline</h3>
              <p className="text-sm text-[#94a69a] leading-relaxed">
                Build a repeatable trading plan while mastering patience, emotional psychology, and
                strict risk management boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURRICULUM SECTION */}
      <section id="curriculum" className="py-20 border-t border-[#192420] bg-[#09100e]/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-extrabold text-[#a3e635] tracking-widest uppercase">
              Your Learning Roadmap
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Three chapters. <span className="text-[#a3e635]">One structured journey.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#94a69a]">
              Each chapter introduces a progressive tier of trading expertise, cemented with a live
              practical immersion week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chapter 1 */}
            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-7 flex flex-col justify-between hover:border-[#a3e635]/60 transition-all">
              <div>
                <span className="text-xs font-mono font-bold text-[#a3e635] tracking-wider uppercase block mb-2">
                  CHAPTER 01
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">Market Foundations</h3>
                <p className="text-xs text-[#94a69a] mb-5">
                  Begin with the core principles and master the language of modern financial markets.
                </p>
                <ul className="space-y-2.5 text-sm text-[#f6faf7] border-t border-[#1e2b25] pt-4">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> History of financial trading
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> The start of modern trading
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Understanding the marketplace
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Basic market & trend analysis
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> How to properly place a trade
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Guided live practice session
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-[#1e2b25] text-xs font-extrabold tracking-wider text-[#a3e635]">
                FOUNDATIONAL LEARNING →
              </div>
            </div>

            {/* Chapter 2 */}
            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-7 flex flex-col justify-between hover:border-[#a3e635]/60 transition-all">
              <div>
                <span className="text-xs font-mono font-bold text-[#a3e635] tracking-wider uppercase block mb-2">
                  CHAPTER 02
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">Advanced Market Analysis</h3>
                <p className="text-xs text-[#94a69a] mb-5">
                  Explore market structure, orderflow concepts and develop structured analysis techniques.
                </p>
                <ul className="space-y-2.5 text-sm text-[#f6faf7] border-t border-[#1e2b25] pt-4">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> What moves financial markets
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Understanding different asset classes
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Professional trading concepts
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Advanced technical price action
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Setting realistic trading goals
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Mastering patience and timing
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Guided live practice session
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-[#1e2b25] text-xs font-extrabold tracking-wider text-[#a3e635]">
                ANALYTICAL DEVELOPMENT →
              </div>
            </div>

            {/* Chapter 3 */}
            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-7 flex flex-col justify-between hover:border-[#a3e635]/60 transition-all">
              <div>
                <span className="text-xs font-mono font-bold text-[#a3e635] tracking-wider uppercase block mb-2">
                  CHAPTER 03
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">Psychology & Plans</h3>
                <p className="text-xs text-[#94a69a] mb-5">
                  Bring your entire foundation together through psychology, planning and execution.
                </p>
                <ul className="space-y-2.5 text-sm text-[#f6faf7] border-t border-[#1e2b25] pt-4">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Professional trading psychology
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Building a consistent trading plan
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Understanding trading signals & triggers
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Completing your learning journey
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Bonus: trading economic events
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Guided live practice session
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#a3e635]">✓</span> Signal community group information
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-[#1e2b25] text-xs font-extrabold tracking-wider text-[#a3e635]">
                DEVELOPING INDEPENDENCE →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE BOOK SECTION */}
      <section className="py-20 border-t border-[#192420]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-[#101917] via-[#12201c] to-[#0c1513] border border-[#27342e] rounded-3xl p-8 sm:p-14 overflow-hidden relative shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-extrabold text-[#a3e635] tracking-widest uppercase">
                  Book Information
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                  Read the Market <span className="text-[#a3e635]">like a Rover</span>
                </h2>
                <p className="text-sm sm:text-base text-[#94a69a] max-w-lg leading-relaxed">
                  Find your taste in decades of market concepts summarised in a single, clear, comprehensive
                  curriculum book written by Lethabo Loate.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setBookModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm bg-[#a3e635] text-black hover:bg-[#bcf95a] transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                  >
                    <BookOpen className="w-4 h-4" />
                    Preview Book Edition
                  </button>
                </div>
              </div>

              {/* Book Preview Artwork */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  onClick={() => setBookModalOpen(true)}
                  className="cursor-pointer group relative max-w-[280px] rounded-2xl overflow-hidden border-2 border-[#27342e] shadow-[0_20px_40px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-all duration-300"
                >
                  <img
                    src="/Link Images/book.jpeg"
                    alt="Read the Market like a Rover Book Cover"
                    className="w-full h-auto object-cover group-hover:brightness-110 transition-all"
                    onError={(e) => {
                      // Fallback visual if image file path is unavailable
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6 text-center">
                    <span className="px-4 py-2 bg-[#a3e635] text-black rounded-lg text-xs font-extrabold shadow-lg">
                      Click to View Book Details ↗
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-20 border-t border-[#192420]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-extrabold text-[#a3e635] tracking-widest uppercase">
              Course Investment
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Invest in your <span className="text-[#a3e635]">financial education.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#94a69a]">
              Choose the learning option that best matches your current level of experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Standard */}
            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 flex flex-col justify-between hover:border-[#a3e635]/60 transition-all">
              <div>
                <span className="text-[10px] font-bold text-[#94a69a] tracking-widest uppercase block mb-1">
                  BEGINNERS COURSE
                </span>
                <h3 className="text-xl font-bold text-white">Standard</h3>
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-white">R150</span>
                  <span className="text-xs text-[#94a69a] ml-1">one-time</span>
                </div>
                <p className="text-xs text-[#94a69a] mb-5">Three-week educational program.</p>
                <ul className="space-y-2 text-xs text-[#f6faf7] border-t border-[#1e2b25] pt-4">
                  <li className="flex items-center gap-2">✓ Access to all three chapters</li>
                  <li className="flex items-center gap-2">✓ Trading plan development</li>
                  <li className="flex items-center gap-2">✓ Trading psychology education</li>
                  <li className="flex items-center gap-2">✓ Online Zoom Classes</li>
                  <li className="flex items-center gap-2">✓ One Time Payment</li>
                </ul>
              </div>
              <a
                href="#enroll"
                onClick={() => setEnrollCourse('Standard Course - R150')}
                className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-bold text-white border border-[#27342e] hover:border-[#a3e635] hover:bg-white/5 transition-all block"
              >
                Enquire Standard →
              </a>
            </div>

            {/* Advanced */}
            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 flex flex-col justify-between hover:border-[#a3e635]/60 transition-all">
              <div>
                <span className="text-[10px] font-bold text-[#94a69a] tracking-widest uppercase block mb-1">
                  ADVANCED LEARNING
                </span>
                <h3 className="text-xl font-bold text-white">Advanced</h3>
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-white">R250</span>
                  <span className="text-xs text-[#94a69a] ml-1">one-time</span>
                </div>
                <p className="text-xs text-[#94a69a] mb-5">
                  For learners with prior trading knowledge requiring Chapters 2 & 3.
                </p>
                <ul className="space-y-2 text-xs text-[#f6faf7] border-t border-[#1e2b25] pt-4">
                  <li className="flex items-center gap-2">✓ Chapter 2 & 3 only</li>
                  <li className="flex items-center gap-2">✓ Trading plan development</li>
                  <li className="flex items-center gap-2">✓ Guided practical learning</li>
                  <li className="flex items-center gap-2">✓ Prior knowledge required</li>
                  <li className="flex items-center gap-2">✓ One Time Payment</li>
                </ul>
              </div>
              <a
                href="#enroll"
                onClick={() => setEnrollCourse('Advanced Course - R250')}
                className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-bold text-white border border-[#27342e] hover:border-[#a3e635] hover:bg-white/5 transition-all block"
              >
                Enquire Advanced →
              </a>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-b from-[#13231e] to-[#101917] border-2 border-[#a3e635] rounded-2xl p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(163,230,53,0.15)] relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#a3e635] text-black text-[10px] font-extrabold tracking-wider px-3 py-0.5 rounded-full uppercase">
                MOST POPULAR
              </span>
              <div>
                <span className="text-[10px] font-bold text-[#a3e635] tracking-widest uppercase block mb-1">
                  FULL COURSE
                </span>
                <h3 className="text-xl font-bold text-white">Premium</h3>
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-white">R600</span>
                  <span className="text-xs text-[#94a69a] ml-1">one-time</span>
                </div>
                <p className="text-xs text-[#94a69a] mb-5">Six-week complete educational program.</p>
                <ul className="space-y-2 text-xs text-[#f6faf7] border-t border-[#1e2b25] pt-4">
                  <li className="flex items-center gap-2">✓ Access to all three chapters</li>
                  <li className="flex items-center gap-2">✓ Trading plan development</li>
                  <li className="flex items-center gap-2">✓ Live interactive group lessons</li>
                  <li className="flex items-center gap-2">✓ Market analysis training</li>
                  <li className="flex items-center gap-2">✓ Practical learning sessions</li>
                  <li className="flex items-center gap-2">✓ Psychology & risk frameworks</li>
                </ul>
              </div>
              <a
                href="#enroll"
                onClick={() => setEnrollCourse('Premium Course - R600')}
                className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-extrabold bg-[#a3e635] text-black hover:bg-[#bcf95a] transition-all block shadow-[0_0_15px_rgba(163,230,53,0.3)]"
              >
                Enquire Premium ↗
              </a>
            </div>

            {/* Signals */}
            <div className="bg-[#101917]/70 border border-[#27342e] rounded-2xl p-6 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
              <div>
                <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase block mb-1">
                  SIGNAL COURSE
                </span>
                <h3 className="text-xl font-bold text-white">Rover Signals</h3>
                <div className="my-4">
                  <span className="text-2xl font-extrabold text-amber-400">Coming Soon</span>
                </div>
                <p className="text-xs text-[#94a69a] mb-5">Experience daily signals with Rover Trading.</p>
                <ul className="space-y-2 text-xs text-[#94a69a] border-t border-[#1e2b25] pt-4">
                  <li>• Daily market signals</li>
                  <li>• Reasoning for each signal</li>
                  <li>• Weekly signal feedback</li>
                  <li>• Back-to-back reviews</li>
                  <li>• 66%+ calculated accuracy target</li>
                </ul>
              </div>
              <button
                disabled
                className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-bold text-[#94a69a] border border-[#27342e] cursor-not-allowed bg-black/20"
              >
                Currently Unavailable
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-[#94a69a] mt-8">
            Prices are based on program information. Confirm placement, advanced eligibility, and enrollment confirmation with course leadership.
          </p>
        </div>
      </section>

      {/* 6. WEEKLY SCHEDULE */}
      <section id="schedule" className="py-20 border-t border-[#192420] bg-[#09100e]/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-extrabold text-[#a3e635] tracking-widest uppercase">
              Weekly Lesson Timetable
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              A learning schedule <span className="text-[#a3e635]">built around you.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#94a69a]">
              Learners are placed into structured group sessions according to their active chapters.
            </p>
          </div>

          {/* Orientation briefing banner */}
          <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#173d28] text-[#a3e635] flex items-center justify-center font-bold">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Pre-Class Briefing</h3>
                <p className="text-xs text-[#94a69a]">Program orientation, preparation and weekly instructions via Zoom.</p>
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#15211d] border border-[#27342e] text-[#a3e635] font-mono text-xs font-bold">
              Sunday · 19:40–20:00
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>Chapter 01</span>
                <span className="text-xs text-[#a3e635] font-mono font-normal">Foundations</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-[#1e2b25]">
                  <span className="text-[#94a69a]">Monday</span>
                  <span className="font-mono text-white font-semibold">18:00–18:30</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1e2b25]">
                  <span className="text-[#94a69a]">Tuesday</span>
                  <span className="font-mono text-white font-semibold">17:00–18:00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#94a69a]">Thursday</span>
                  <span className="font-mono text-white font-semibold">18:00–18:30</span>
                </div>
              </div>
            </div>

            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>Chapter 02</span>
                <span className="text-xs text-[#a3e635] font-mono font-normal">Analysis</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-[#1e2b25]">
                  <span className="text-[#94a69a]">Monday</span>
                  <span className="font-mono text-white font-semibold">18:30–19:00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1e2b25]">
                  <span className="text-[#94a69a]">Wednesday</span>
                  <span className="font-mono text-white font-semibold">18:00–19:00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#94a69a]">Thursday</span>
                  <span className="font-mono text-white font-semibold">18:30–19:00</span>
                </div>
              </div>
            </div>

            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>Chapter 03</span>
                <span className="text-xs text-[#a3e635] font-mono font-normal">Psychology & Plan</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-[#1e2b25]">
                  <span className="text-[#94a69a]">Tuesday</span>
                  <span className="font-mono text-white font-semibold">18:00–19:00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1e2b25]">
                  <span className="text-[#94a69a]">Wednesday</span>
                  <span className="font-mono text-white font-semibold">19:00–20:00</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#94a69a]">Sunday</span>
                  <span className="font-mono text-white font-semibold">19:00–19:40</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-[#101917] border border-[#27342e] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Live Practice Weeks</h3>
              <p className="text-xs text-[#94a69a]">
                A full week of hands-on guided charting follows the completion of each theoretical chapter.
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#173d28] border border-[#27342e] text-[#b4fc78] text-xs font-bold uppercase">
              Included in Program
            </div>
          </div>
        </div>
      </section>

      {/* 7. REQUIREMENTS SECTION */}
      <section className="py-20 border-t border-[#192420]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-extrabold text-[#a3e635] tracking-widest uppercase">
              Before Your First Lesson
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything you need <span className="text-[#a3e635]">to get started.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#94a69a]">
              Prepare the following essential learning tools before your first scheduled live class.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-7 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#173d28] text-[#a3e635] flex items-center justify-center mx-auto mb-2">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Digital Device</h3>
              <p className="text-xs text-[#94a69a] leading-relaxed">
                A smartphone, laptop, tablet, or desktop with a stable, reliable internet connection.
              </p>
            </div>

            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-7 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#173d28] text-[#a3e635] flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Trading Applications</h3>
              <p className="text-xs text-[#94a69a] leading-relaxed">
                Install MetaTrader 4 or 5 and TradingView for chart analysis, plus an approved broker account.
              </p>
            </div>

            <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-7 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#173d28] text-[#a3e635] flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Learning Materials</h3>
              <p className="text-xs text-[#94a69a] leading-relaxed">
                A dedicated trade journal or notebook, and Zoom meeting software installed for live sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. REVIEWS SECTION */}
      <section id="reviews" className="py-20 border-t border-[#192420] bg-[#09100e]/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <p className="text-xs font-extrabold text-[#a3e635] tracking-widest uppercase">
              Student Experiences
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              What our students <span className="text-[#a3e635]">are saying.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#94a69a]">
              Real feedback from learners who have completed the Rover Trading Program.
            </p>
          </div>

          {/* Average Rating Banner */}
          <div className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 max-w-md mx-auto text-center mb-12 shadow-xl">
            <div className="text-5xl font-extrabold text-white tracking-tight mb-2">{avgRating}</div>
            <div className="flex justify-center gap-1 text-[#ffd700] text-xl mb-2">
              {'★'.repeat(Math.round(Number(avgRating)))}
              {'☆'.repeat(Math.max(0, 5 - Math.round(Number(avgRating))))}
            </div>
            <div className="text-xs text-[#94a69a]">Based on {totalReviews} verified student reviews</div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#101917] border border-[#27342e] rounded-2xl p-6 flex flex-col justify-between hover:border-[#a3e635]/40 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-[#ffd700] text-sm">
                      {'★'.repeat(rev.rating)}
                      <span className="text-[#3b4b42]">{'★'.repeat(5 - rev.rating)}</span>
                    </div>
                    <span className="text-[10px] text-[#94a69a] font-mono">
                      {new Date(rev.date).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-[#f6faf7] leading-relaxed italic mb-6">
                    "{rev.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#1e2b25]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#a3e635] to-[#65a30d] text-black font-extrabold text-sm flex items-center justify-center">
                    {rev.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong className="block text-sm text-white font-bold">{rev.name}</strong>
                    <span className="text-xs text-[#94a69a]">{rev.course} Graduate</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit a Review Form */}
          <div className="max-w-xl mx-auto bg-[#101917] border border-[#27342e] rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-center text-white mb-2">
              Share Your <span className="text-[#a3e635]">Experience</span>
            </h3>
            <p className="text-xs text-[#94a69a] text-center mb-6">
              We value honest reviews from our active and graduated students.
            </p>

            {revSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-[#173d28] border border-[#a3e635]/40 text-center animate-in fade-in">
                <div className="text-[#a3e635] font-bold text-sm mb-1">✓ Thank you!</div>
                <div className="text-xs text-white">Your review has been published and added to our wall.</div>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#94a69a] mb-2 text-center">
                  Your Rating
                </label>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRevRating(star)}
                      className={`text-2xl transition-transform hover:scale-125 ${
                        star <= revRating ? 'text-[#ffd700]' : 'text-[#3b4b42]'
                      }`}
                      aria-label={`${star} star rating`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#94a69a] mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  placeholder="e.g. Kagiso M."
                  className="w-full bg-[#15211d] border border-[#27342e] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a69a]/60 focus:outline-none focus:border-[#a3e635]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#94a69a] mb-1.5">
                  Course Completed
                </label>
                <select
                  value={revCourse}
                  onChange={(e) => setRevCourse(e.target.value)}
                  className="w-full bg-[#15211d] border border-[#27342e] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#a3e635]"
                >
                  <option value="Standard Course">Standard Course</option>
                  <option value="Advanced Course">Advanced Course</option>
                  <option value="Premium Course">Premium Course</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#94a69a] mb-1.5">
                  Your Review
                </label>
                <textarea
                  required
                  rows={3}
                  value={revText}
                  onChange={(e) => setRevText(e.target.value)}
                  placeholder="Tell us about your experience with Rover Trading..."
                  className="w-full bg-[#15211d] border border-[#27342e] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a69a]/60 focus:outline-none focus:border-[#a3e635]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-black hover:opacity-90 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)]"
              >
                Submit Review ↗
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 9. CONTACT & SOCIAL */}
      <section id="contact" className="py-20 border-t border-[#192420]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-extrabold text-[#a3e635] tracking-widest uppercase">
              Get In Touch
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Connect with <span className="text-[#a3e635]">Rover Trading.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#94a69a]">
              Follow us across social media for daily chart breakdowns, market insights and student highlights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="https://www.instagram.com/rover_trading"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#101917] border border-[#27342e] rounded-2xl p-7 hover:border-pink-500/50 transition-all group block"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Instagram</h3>
              <p className="text-xs text-[#94a69a] mb-4">
                Follow for daily chart analysis, trading tips and market recaps.
              </p>
              <span className="text-xs font-bold text-pink-400">@rover_trading →</span>
            </a>

            <a
              href="https://www.tiktok.com/@rover_trading"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#101917] border border-[#27342e] rounded-2xl p-7 hover:border-cyan-400/50 transition-all group block"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">TikTok</h3>
              <p className="text-xs text-[#94a69a] mb-4">
                Short-form trading education, psychological breakdowns and highlights.
              </p>
              <span className="text-xs font-bold text-cyan-400">@rover_trading →</span>
            </a>

            <a
              href="https://wa.me/27683708749"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#101917] border border-[#27342e] rounded-2xl p-7 hover:border-emerald-500/50 transition-all group block"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">WhatsApp Support</h3>
              <p className="text-xs text-[#94a69a] mb-4">
                Direct enrollment enquiries, account questions and timetable support.
              </p>
              <span className="text-xs font-bold text-emerald-400">Message Us Directly →</span>
            </a>
          </div>
        </div>
      </section>

      {/* 10. FAQ / TERMS & CONDITIONS */}
      <section id="faq" className="py-20 border-t border-[#192420] bg-[#09100e]/60">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-3">
            <p className="text-xs font-extrabold text-[#a3e635] tracking-widest uppercase">
              Important Information
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Program terms <span className="text-[#a3e635]">& conditions.</span>
            </h2>
            <p className="text-sm text-[#94a69a]">
              Please review our transparent academy guidelines before enrolling.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What happens when the administrator postpones a lesson?',
                a: 'If the lesson administrator is delayed or needs to postpone due to unforeseen circumstances, the session will be rescheduled to a suitable time communicated to all affected learners.',
              },
              {
                q: 'What happens if I miss a lesson?',
                a: 'You will need to attend the relevant lesson when it is taught to the subsequent group. A R150 make-up lesson fee will apply.',
              },
              {
                q: 'Can I restart a chapter?',
                a: 'Restarting a chapter is subject to the original applicable chapter fee of R100 or R250. Please confirm the exact charge with the administrator before restarting.',
              },
              {
                q: 'Can I skip chapters?',
                a: 'Chapters are purposefully designed to be completed in sequence. The advanced option is reserved for learners who already meet the foundational knowledge requirements.',
              },
              {
                q: 'Are course payments refundable?',
                a: 'The program policy is that educational payments are non-refundable once materials or live sessions have commenced, subject to applicable consumer protection statutory rights.',
              },
              {
                q: 'Will I make money after completing the program?',
                a: 'Financial trading carries a risk of substantial losses, including the potential loss of entire trading capital. Educational training cannot eliminate these risks; our goal is to build risk management frameworks and structured discipline.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-[#101917] border border-[#27342e] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-white hover:text-[#a3e635] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#94a69a] transition-transform ${
                      openFaq === i ? 'rotate-180 text-[#a3e635]' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#94a69a] leading-relaxed border-t border-[#1e2b25] pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. ENROLLMENT SECTION */}
      <section id="enroll" className="py-24 border-t border-[#192420]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#101917] via-[#12221d] to-[#0c1613] border border-[#27342e] rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-extrabold text-[#a3e635] tracking-widest uppercase">
                  Start Your Journey
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Your next chapter <span className="text-[#a3e635]">starts here.</span>
                </h2>
                <p className="text-sm text-[#94a69a] leading-relaxed">
                  Submit an enquiry to begin your enrollment process. Learn the foundations, understand
                  how financial markets behave, and develop your own independent trading approach.
                </p>
                <p className="text-xs text-[#94a69a]">
                  No guaranteed earnings. No promises of instant wealth. Just real, structured financial
                  market education.
                </p>
              </div>

              <div className="lg:col-span-7">
                <form onSubmit={handleEnrollSubmit} className="space-y-4 bg-[#0a110f]/80 p-6 sm:p-8 rounded-2xl border border-[#27342e]">
                  {enrollMessage && (
                    <div className="p-3.5 rounded-xl bg-[#173d28] border border-[#a3e635]/40 text-xs text-[#b4fc78] font-medium">
                      {enrollMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#94a69a] mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={enrollName}
                      onChange={(e) => setEnrollName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-[#15211d] border border-[#27342e] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a69a]/60 focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#94a69a] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={enrollEmail}
                        onChange={(e) => setEnrollEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-[#15211d] border border-[#27342e] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a69a]/60 focus:outline-none focus:border-[#a3e635]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#94a69a] mb-1.5">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={enrollPhone}
                        onChange={(e) => setEnrollPhone(e.target.value)}
                        placeholder="+27 81 234 5678"
                        className="w-full bg-[#15211d] border border-[#27342e] rounded-xl px-4 py-3 text-sm text-white placeholder-[#94a69a]/60 focus:outline-none focus:border-[#a3e635]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#94a69a] mb-1.5">
                      Preferred Course
                    </label>
                    <select
                      value={enrollCourse}
                      onChange={(e) => setEnrollCourse(e.target.value)}
                      className="w-full bg-[#15211d] border border-[#27342e] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#a3e635]"
                    >
                      <option value="Standard Course - R150">Standard Course - R150</option>
                      <option value="Advanced Course - R250">Advanced Course - R250</option>
                      <option value="Premium Course - R600">Premium Course - R600</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={enrollSubmitting}
                    className="w-full py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-black hover:opacity-90 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] disabled:opacity-50"
                  >
                    {enrollSubmitting ? 'Submitting...' : 'Submit Enrollment Enquiry ↗'}
                  </button>

                  <p className="text-[11px] text-[#94a69a] text-center">
                    Your enquiry is sent directly to the Rover Trading team. We'll respond to your email within 24 hours.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1e2b25] bg-[#060a09] py-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-[#1e2b25]">
            <div className="space-y-2 max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a3e635] to-[#65a30d] flex items-center justify-center text-black font-extrabold text-base">
                  R
                </div>
                <span className="font-extrabold text-lg text-white">
                  ROVER <span className="text-[#a3e635]">TRADING</span>
                </span>
              </div>
              <p className="text-xs text-[#94a69a] leading-relaxed">
                Rover Trading Program provides structured trading education. It does not guarantee trading profits or offer personalised financial advice.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs text-[#94a69a]">
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#curriculum" className="hover:text-white transition-colors">Curriculum</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#schedule" className="hover:text-white transition-colors">Schedule</a>
              <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              <button
                onClick={() => setCurrentView('login')}
                className="hover:text-[#a3e635] transition-colors"
              >
                Portal Login
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#94a69a]">
            <div>
              © {new Date().getFullYear()} Rover Trading Program. All rights reserved. Educational services only.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
              <span>System operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Book preview modal */}
      <BookModal isOpen={bookModalOpen} onClose={() => setBookModalOpen(false)} />
    </div>
  );
};
