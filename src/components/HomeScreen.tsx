import React from 'react';
import { Flame, Sparkles, Zap, Users, ArrowRight, Crown, ChevronRight } from 'lucide-react';
import { sounds } from '../utils/soundEffects.ts';
import { getStreakData, getStoredUserName, isUserVip, getDailyAnswerForToday } from '../utils/storage.ts';

interface HomeScreenProps {
  onStartQuiz: () => void;
  onOpenRoast: () => void;
  onOpenFriend: () => void;
  onOpenDaily: () => void;
  onOpenPremium: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartQuiz,
  onOpenRoast,
  onOpenFriend,
  onOpenDaily,
  onOpenPremium
}) => {
  const streak = getStreakData();
  const userName = getStoredUserName();
  const isVip = isUserVip();
  const dailyDone = Boolean(getDailyAnswerForToday());

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto pb-24 px-4 pt-2">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <span className="text-base">✨</span>
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-white font-display">
              VibeCheck
            </span>
            <span className="text-[10px] text-pink-400 font-semibold block -mt-0.5">
              AI Roast & Personality
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Flame streak badge */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenDaily();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition-all active:scale-95"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            <span>{streak.count} Streak</span>
          </button>

          {isVip && (
            <span className="p-1 px-2 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center gap-1">
              <Crown className="w-3 h-3 fill-black" /> VIP
            </span>
          )}
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="w-full relative rounded-3xl p-6 bg-gradient-to-b from-[#2a1147] via-[#1b0b2e] to-[#0c0516] border border-purple-500/30 shadow-2xl overflow-hidden mb-5 text-center">
        {/* Ambient neon backlights */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-pink-300 text-[11px] font-semibold border border-white/10 mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Gen Z Hinglish AI</span>
          </div>

          <h1 className="text-3xl font-black text-white leading-tight tracking-tight font-display">
            Apna Vibe Pata Karo!
          </h1>
          <p className="text-xs text-slate-300 mt-2 max-w-xs mx-auto leading-relaxed">
            Find your official vibe type, savage roast, red flags & Instagram Story-ready card in 2 minutes.
          </p>

          {/* Large Start Vibe Check button */}
          <button
            onClick={() => {
              sounds.playPop();
              onStartQuiz();
            }}
            className="w-full mt-5 py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-extrabold text-base shadow-xl shadow-pink-500/30 flex items-center justify-center gap-2.5 hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <Zap className="w-5 h-5 fill-white" />
            <span>Start Vibe Check</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Daily Vibe Streak Prompt */}
      {!dailyDone && (
        <button
          onClick={() => {
            sounds.playPop();
            onOpenDaily();
          }}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-between text-left mb-4 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-xl shrink-0">
              🔥
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                Daily Check-in
              </div>
              <h4 className="text-xs font-bold text-white">
                Aaj ka question baki hai!
              </h4>
              <p className="text-[11px] text-orange-200/80">
                1 question answer karke streak maintain rakho.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-orange-400 shrink-0" />
        </button>
      )}

      {/* Section Title */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Choose Mode · Kya Check Karna Hai?
        </h3>
      </div>

      {/* Mode Cards Grid (Roast Me, Vibe Type, Friend Compatibility, Daily Vibe) */}
      <div className="w-full grid grid-cols-2 gap-3 mb-5">
        {/* Roast Me Mode */}
        <button
          onClick={() => {
            sounds.playPop();
            onOpenRoast();
          }}
          className="p-4 rounded-3xl glass-card border border-rose-500/20 hover:border-rose-500/50 text-left transition-all active:scale-[0.98] flex flex-col justify-between h-38 bg-gradient-to-b from-[#240810] to-[#0c0205] group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                🔥
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Savage
              </span>
            </div>
            <h4 className="text-sm font-bold text-white font-display">
              Roast Me
            </h4>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-snug">
              Apni 3 ajeeb habits batao aur AI se brutal roast suno.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-2">
            Get Roasted →
          </span>
        </button>

        {/* Vibe Type Quiz */}
        <button
          onClick={() => {
            sounds.playPop();
            onStartQuiz();
          }}
          className="p-4 rounded-3xl glass-card border border-purple-500/20 hover:border-purple-500/50 text-left transition-all active:scale-[0.98] flex flex-col justify-between h-38 bg-gradient-to-b from-[#1a0b2e] to-[#0a0414] group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                ⚡
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                8 Questions
              </span>
            </div>
            <h4 className="text-sm font-bold text-white font-display">
              Vibe Type
            </h4>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-snug">
              2 AM thoughts, group chat role & red/green flags.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-purple-400 flex items-center gap-1 mt-2">
            Start Quiz →
          </span>
        </button>

        {/* Friend Compatibility */}
        <button
          onClick={() => {
            sounds.playPop();
            onOpenFriend();
          }}
          className="p-4 rounded-3xl glass-card border border-lime-500/20 hover:border-lime-500/50 text-left transition-all active:scale-[0.98] flex flex-col justify-between h-38 bg-gradient-to-b from-[#142308] to-[#070e03] group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                🤝
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-300 border border-lime-500/30">
                Pass Phone
              </span>
            </div>
            <h4 className="text-sm font-bold text-white font-display">
              Friend Test
            </h4>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-snug">
              Dono 5 questions answer karo aur compatibility dekho.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-lime-400 flex items-center gap-1 mt-2">
            Test Bond →
          </span>
        </button>

        {/* Daily Vibe */}
        <button
          onClick={() => {
            sounds.playPop();
            onOpenDaily();
          }}
          className="p-4 rounded-3xl glass-card border border-orange-500/20 hover:border-orange-500/50 text-left transition-all active:scale-[0.98] flex flex-col justify-between h-38 bg-gradient-to-b from-[#251005] to-[#0d0502] group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                📅
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Daily Aura
              </span>
            </div>
            <h4 className="text-sm font-bold text-white font-display">
              Daily Vibe
            </h4>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-snug">
              Roz 1 naya question aur flame streak badhao.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-orange-400 flex items-center gap-1 mt-2">
            Check Aura →
          </span>
        </button>
      </div>

      {/* Premium Teaser Banner */}
      <button
        onClick={() => {
          sounds.playPop();
          onOpenPremium();
        }}
        className="w-full p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-600/15 border border-amber-500/30 flex items-center justify-between text-left active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              {isVip ? 'VIP Mode Activated' : 'VibeCheck Gold Teaser'}
            </div>
            <h4 className="text-xs font-bold text-white">
              {isVip ? 'Enjoying Unlocked Savage Modes' : 'Extra Spicy & Couple Mode'}
            </h4>
            <p className="text-[11px] text-amber-200/80">
              {isVip ? 'All VIP features are unlocked for you!' : 'Exclusive holographic themes for ₹49'}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-400 shrink-0">
          {isVip ? 'Unlocked ✨' : 'Unlock →'}
        </span>
      </button>
    </div>
  );
};
