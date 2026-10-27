import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, RefreshCw } from 'lucide-react';
import { VIBE_QUESTIONS } from '../data/quizData.ts';
import { VibeResult } from '../types.ts';
import { ResultCard } from './ResultCard.tsx';
import { sounds } from '../utils/soundEffects.ts';
import { saveHistoryItem, getStoredUserName, setStoredUserName } from '../utils/storage.ts';

interface QuizScreenProps {
  onGoHome: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ onGoHome }) => {
  const [userName, setUserName] = useState<string>(getStoredUserName() || '');
  const [hasStarted, setHasStarted] = useState<boolean>(Boolean(getStoredUserName()));
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, { text: string; vibeTag: string }>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VibeResult | null>(null);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingMessages = [
    "2 AM overthinking patterns decode ho rahe hain...",
    "WhatsApp seen timestamps aur excuses analyze ho rahe hain...",
    "Zomato cart abandonment history calculate ho rahi hai...",
    "Official Vibe Type aur Hinglish roast generate ho raha hai..."
  ];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    sounds.playPop();
    setStoredUserName(userName.trim());
    setHasStarted(true);
  };

  const handleSelectOption = async (option: { text: string; vibeTag: string }) => {
    sounds.playSelect();
    const updated = {
      ...selectedAnswers,
      [currentQIndex]: { text: option.text, vibeTag: option.vibeTag }
    };
    setSelectedAnswers(updated);

    if (currentQIndex < VIBE_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Completed all 8 questions!
      setIsLoading(true);

      const interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1200);

      try {
        const answersSummary = VIBE_QUESTIONS.map((q, idx) => {
          return `Question: ${q.question}\nAnswer Chosen: ${updated[idx]?.text || 'N/A'}`;
        }).join('\n\n');

        const res = await fetch('/api/vibe-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userName.trim() || 'Dost',
            answersSummary
          })
        });

        const data: VibeResult = await res.json();
        clearInterval(interval);

        const vibeResult: VibeResult = {
          ...data,
          id: `vibe-${Date.now()}`,
          userName: userName.trim() || 'Dost',
          createdAt: new Date().toISOString()
        };

        setResult(vibeResult);
        saveHistoryItem({
          id: vibeResult.id,
          type: 'quiz',
          title: vibeResult.vibeType,
          emoji: vibeResult.emoji,
          subtitle: `@${vibeResult.userName} · "${vibeResult.roast[0].slice(0, 36)}..."`,
          dateStr: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          payload: vibeResult
        });
      } catch (err) {
        clearInterval(interval);
        console.error('Vibe check API error:', err);
        // Fallback
        const fallbackResult: VibeResult = {
          id: `vibe-${Date.now()}`,
          userName: userName.trim() || 'Dost',
          vibeType: '3 AM Overthinker Pro Max',
          emoji: '🧠',
          themeGradient: 'purple-neon',
          roast: [
            "Raat ko 3 baje ceiling ghoorte hue pure universe ki problems solve karte ho.",
            "10 saal pehle school assembly mein jo mistake ki thi, uska guilt trip abhi bhi chal raha hai.",
            "Dost bolte hain 'chill kar bhai', lekin tumhara dimaag 144Hz pe panic chala raha hai."
          ],
          traits: [
            "Sleep schedule is purely imaginary",
            "Drafts folder mein 47 unposted rants hain",
            "Reel dekh kar existential crisis mein chale jaate ho"
          ],
          redFlag: "Message seen karke dimaag mein reply de dete ho aur phir 4 din baad yaad aata hai.",
          greenFlag: "Group chat mein 2 baje koi ro raha ho toh instantly best therapist ban jaate ho.",
          vibeQuote: "Neend nahi aa rahi, bas puraani baatein yaad aa rahi hain.",
          createdAt: new Date().toISOString()
        };
        setResult(fallbackResult);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setResult(null);
  };

  if (result) {
    return <ResultCard result={result} onRetake={handleRetake} onGoHome={onGoHome} />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto px-6 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-pink-500 animate-spin flex items-center justify-center" />
          <span className="absolute inset-0 flex items-center justify-center text-3xl">
            ✨
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2 font-display">
          Decoding Your Vibe...
        </h2>
        <p className="text-xs text-pink-300 italic max-w-xs transition-opacity duration-300">
          {loadingMessages[loadingTextIndex]}
        </p>
      </div>
    );
  }

  // Name Prompt Screen before quiz
  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center w-full max-w-md mx-auto pb-24 px-4 pt-2">
        <div className="w-full flex items-center justify-between mb-4 px-1">
          <button
            onClick={onGoHome}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
            8 Quick Questions ⚡
          </span>
        </div>

        <div className="w-full glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden text-center">
          <span className="text-5xl inline-block mb-2">✨</span>
          <div className="text-[10px] tracking-widest uppercase font-bold text-pink-400">
            Step 1 of VibeCheck
          </div>
          <h1 className="text-2xl font-black text-white font-display mb-1">
            Apna Naam Batao!
          </h1>
          <p className="text-xs text-slate-300 max-w-xs mx-auto mb-6">
            Taaki aapke Instagram Story result card pe aapka naam chamak sake.
          </p>

          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <input
                type="text"
                required
                maxLength={24}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Aryan, Tanya, Kabir"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 transition-colors text-center font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={!userName.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <span>Start Vibe Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Quiz Question Interface
  const currentQ = VIBE_QUESTIONS[currentQIndex];

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto pb-24 px-4 pt-2">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <button
          onClick={onGoHome}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          ✕ Exit
        </button>
        <div className="text-xs font-bold text-pink-400">
          Question {currentQIndex + 1} of {VIBE_QUESTIONS.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-300"
          style={{ width: `${((currentQIndex + 1) / VIBE_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="w-full glass-panel rounded-3xl p-6 border border-white/10 shadow-xl mb-4 relative overflow-hidden">
        <div className="text-[10px] tracking-widest uppercase font-bold text-pink-400 mb-1">
          {currentQ.kicker}
        </div>
        <h2 className="text-lg font-bold text-white leading-snug font-display">
          {currentQ.question}
        </h2>
      </div>

      {/* 4 Funny Options */}
      <div className="w-full space-y-2.5">
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelectOption(opt)}
            className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-pink-500/20 border border-white/10 hover:border-pink-500/40 text-slate-200 text-xs font-medium leading-relaxed transition-all active:scale-[0.98] flex items-start gap-3"
          >
            <span className="text-2xl shrink-0 -mt-0.5">{opt.emoji}</span>
            <span className="flex-1">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
