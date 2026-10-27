import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Calendar, Sparkles, Check, Share2, ArrowRight } from 'lucide-react';
import { DAILY_QUESTIONS } from '../data/quizData.ts';
import { DailyResult } from '../types.ts';
import { sounds } from '../utils/soundEffects.ts';
import {
  getStreakData,
  recordDailyParticipation,
  getDailyAnswerForToday,
  saveDailyAnswerForToday,
  saveHistoryItem,
  getTodayDateString,
  getStoredUserName
} from '../utils/storage.ts';

interface DailyVibeProps {
  onGoHome: () => void;
}

export const DailyVibe: React.FC<DailyVibeProps> = ({ onGoHome }) => {
  const [streakData, setStreakData] = useState(getStreakData());
  const [todayResult, setTodayResult] = useState<DailyResult | null>(getDailyAnswerForToday());
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Synchronize question with day-of-year
  const todayStr = getTodayDateString();
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const questionIndex = dayOfYear % DAILY_QUESTIONS.length;
  const currentQuestion = DAILY_QUESTIONS[questionIndex];

  const handleSelectOption = (idx: number) => {
    sounds.playSelect();
    setSelectedOptionIndex(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null) return;
    setIsSubmitting(true);
    sounds.playSuccess();

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f97316', '#eab308', '#ec4899']
      });
    } catch {
      // ignore
    }

    const chosen = currentQuestion.options[selectedOptionIndex];
    const { newStreak, isFirstToday } = recordDailyParticipation();
    const updatedStreak = getStreakData();
    setStreakData(updatedStreak);

    const result: DailyResult = {
      id: `daily-${todayStr}`,
      dateStr: new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }),
      aura: chosen.aura,
      emoji: chosen.emoji,
      question: currentQuestion.question,
      answer: chosen.text,
      createdAt: new Date().toISOString()
    };

    saveDailyAnswerForToday(result);
    setTodayResult(result);

    // Also push to history
    saveHistoryItem({
      id: result.id,
      type: 'daily',
      title: result.aura,
      emoji: result.emoji,
      subtitle: `${result.dateStr} · ${newStreak} Day Streak 🔥`,
      dateStr: result.dateStr,
      payload: result
    });

    setIsSubmitting(false);
  };

  const handleShareDaily = () => {
    if (!todayResult) return;
    sounds.playPop();
    const text = `Aaj ka mera Daily Vibe Aura check karo: "${todayResult.aura}" ${todayResult.emoji} 🔥\nStreak: ${streakData.count} days strong!\nCheck your daily vibe: ${window.location.origin}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto pb-24 px-4 pt-2">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between mb-4 px-1">
        <button
          onClick={onGoHome}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          ← Home
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold animate-pulse">
          <Flame className="w-3.5 h-3.5 fill-orange-500" />
          <span>{streakData.count} Day Streak</span>
        </div>
      </div>

      {/* Streak Hero Card */}
      <div className="w-full glass-panel rounded-3xl p-6 border border-orange-500/25 mb-4 shadow-xl relative overflow-hidden bg-gradient-to-br from-[#261005] via-[#1a0a03] to-[#0a0401]">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            <span className="text-3xl">🔥</span>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-orange-400">
              Daily Streak Counter
            </div>
            <h2 className="text-2xl font-black text-white font-display">
              {streakData.count} Days Strong!
            </h2>
            <p className="text-xs text-orange-200/80 mt-0.5">
              {streakData.count === 0
                ? "Aaj ka question answer karke streak shuru karo!"
                : "Roz 1 question answer karke streak maintain rakho."}
            </p>
          </div>
        </div>
      </div>

      {/* If already answered today */}
      {todayResult ? (
        <div className="w-full space-y-4">
          <div className="w-full glass-card rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#1b152b] to-[#0a0715]">
            <div className="text-center">
              <span className="text-5xl inline-block mb-3 animate-bounce">
                {todayResult.emoji}
              </span>
              <div className="text-[10px] tracking-widest uppercase font-bold text-pink-400">
                TODAY'S DAILY VIBE AURA
              </div>
              <h1 className="text-2xl font-black text-white mt-1 font-display">
                {todayResult.aura}
              </h1>
              <p className="text-xs text-slate-300 mt-2 italic max-w-xs mx-auto">
                "{todayResult.answer}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Date: {todayResult.dateStr}</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Checked In
              </span>
            </div>
          </div>

          <button
            onClick={handleShareDaily}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Today's Aura on WhatsApp</span>
          </button>

          <p className="text-center text-xs text-slate-500">
            Naya Daily Vibe question kal subah 12:00 AM pe unlock hoga! ⏰
          </p>
        </div>
      ) : (
        /* Question Form */
        <div className="w-full space-y-4">
          <div className="w-full glass-panel rounded-3xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span>Today's Question · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug font-display">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.98] flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-orange-500/20 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.25)]'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                  }`}
                >
                  <span className="text-2xl shrink-0">{opt.emoji}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold leading-relaxed">{opt.text}</p>
                    <span className="text-[10px] text-orange-300 font-medium">
                      Aura: {opt.aura}
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-orange-400 bg-orange-400 text-black'
                        : 'border-white/20'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOptionIndex === null || isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lock Daily Aura & Boost Streak</span>
          </button>
        </div>
      )}
    </div>
  );
};
