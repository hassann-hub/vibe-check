import React, { useState } from 'react';
import { Sparkles, Users, ArrowRight, Smartphone, RefreshCw } from 'lucide-react';
import { FRIEND_QUESTIONS } from '../data/quizData.ts';
import { FriendResult } from '../types.ts';
import { FriendResultCard } from './FriendResultCard.tsx';
import { sounds } from '../utils/soundEffects.ts';
import { saveHistoryItem, getStoredUserName } from '../utils/storage.ts';

interface FriendTestProps {
  onGoHome: () => void;
}

export const FriendTest: React.FC<FriendTestProps> = ({ onGoHome }) => {
  const [step, setStep] = useState<'names' | 'p1-quiz' | 'handoff' | 'p2-quiz' | 'loading' | 'result'>('names');
  const [user1Name, setUser1Name] = useState(getStoredUserName() || '');
  const [user2Name, setUser2Name] = useState('');
  const [p1Answers, setP1Answers] = useState<Record<string, string>>({});
  const [p2Answers, setP2Answers] = useState<Record<string, string>>({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [result, setResult] = useState<FriendResult | null>(null);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingMessages = [
    "Dono ke WhatsApp chat screenshots scan ho rahe hain...",
    "Swiggy aur tapri bills ka balance check ho raha hai...",
    "Kalesh potential aur drama quotient calculate ho raha hai...",
    "AI roast prepare ho raha hai with zero mercy..."
  ];

  const handleStartP1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user1Name.trim() || !user2Name.trim()) return;
    sounds.playPop();
    setCurrentQIndex(0);
    setStep('p1-quiz');
  };

  const handleSelectP1Option = (questionId: string, optionLabel: string) => {
    sounds.playSelect();
    const updated = { ...p1Answers, [questionId]: optionLabel };
    setP1Answers(updated);

    if (currentQIndex < FRIEND_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      sounds.playPop();
      setStep('handoff');
      setCurrentQIndex(0);
    }
  };

  const handleStartP2 = () => {
    sounds.playPop();
    setStep('p2-quiz');
    setCurrentQIndex(0);
  };

  const handleSelectP2Option = async (questionId: string, optionLabel: string) => {
    sounds.playSelect();
    const updated = { ...p2Answers, [questionId]: optionLabel };
    setP2Answers(updated);

    if (currentQIndex < FRIEND_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Completed! Compute result
      setStep('loading');

      const interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1200);

      try {
        const summary = FRIEND_QUESTIONS.map((q) => {
          return `Q: ${q.question}\n${user1Name} answered: ${p1Answers[q.id]}\n${user2Name} answered: ${updated[q.id]}`;
        }).join('\n\n');

        const res = await fetch('/api/friend-compatibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user1Name: user1Name.trim(),
            user2Name: user2Name.trim(),
            answersSummary: summary
          })
        });

        const data: FriendResult = await res.json();
        clearInterval(interval);

        const friendResult: FriendResult = {
          ...data,
          id: `friend-${Date.now()}`,
          createdAt: new Date().toISOString()
        };

        setResult(friendResult);
        saveHistoryItem({
          id: friendResult.id,
          type: 'friend',
          title: friendResult.duoTitle,
          emoji: friendResult.emoji,
          subtitle: `${user1Name} & ${user2Name} · ${friendResult.compatibilityScore}% Synergy`,
          dateStr: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          payload: friendResult
        });

        setStep('result');
      } catch (err) {
        clearInterval(interval);
        console.error('Error generating compatibility:', err);
        // Fallback
        const fallbackResult: FriendResult = {
          id: `friend-${Date.now()}`,
          user1Name: user1Name.trim(),
          user2Name: user2Name.trim(),
          compatibilityScore: 92,
          duoTitle: 'Chai & Samosa Duo',
          emoji: '☕',
          summaryRoast: 'Tum dono ka relation bilkul tapri ki chai aur garam samosa jaisa hai - unhealthy hai, daily chahiye, aur bina iske din poora nahi hota.',
          strongestBond: 'Dono milkar kisi teesre bande ki 2 ghante tak bina break bitching kar sakte hain.',
          futurePrediction: 'Dono ek dusre ki shaadi mein sabse zyada naachenge aur phir rasgulle ki quality pe judge karenge.',
          createdAt: new Date().toISOString()
        };
        setResult(fallbackResult);
        setStep('result');
      }
    }
  };

  const handleRetake = () => {
    setP1Answers({});
    setP2Answers({});
    setCurrentQIndex(0);
    setResult(null);
    setStep('names');
  };

  // STEP: Result
  if (step === 'result' && result) {
    return <FriendResultCard result={result} onRetake={handleRetake} onGoHome={onGoHome} />;
  }

  // STEP: Loading
  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto px-6 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-lime-500/20 border-t-lime-400 animate-spin flex items-center justify-center" />
          <span className="absolute inset-0 flex items-center justify-center text-2xl">
            🤝
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2 font-display">
          Calculating Friend Vibe...
        </h2>
        <p className="text-sm text-lime-400/90 italic max-w-xs transition-opacity duration-300">
          {loadingMessages[loadingTextIndex]}
        </p>
      </div>
    );
  }

  // STEP: Names Input
  if (step === 'names') {
    return (
      <div className="flex flex-col items-center w-full max-w-md mx-auto pb-24 px-4 pt-2">
        <div className="w-full flex items-center justify-between mb-4 px-1">
          <button
            onClick={onGoHome}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20">
            Dost Test 🔥
          </span>
        </div>

        <div className="w-full glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-6">
            <span className="text-5xl inline-block mb-2">🤝</span>
            <div className="text-[10px] tracking-widest uppercase font-bold text-lime-400">
              Pass The Phone
            </div>
            <h1 className="text-2xl font-black text-white font-display">
              Friend Compatibility
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
              Dono ek hi phone pe 5 quick questions answer karo aur dekho kitna asli ya toxic bond hai!
            </p>
          </div>

          <form onSubmit={handleStartP1} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Aapka Naam (Player 1)
              </label>
              <input
                type="text"
                required
                maxLength={24}
                value={user1Name}
                onChange={(e) => setUser1Name(e.target.value)}
                placeholder="e.g. Aryan, Preeti, Kabir"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-lime-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Dost Ka Naam (Player 2)
              </label>
              <input
                type="text"
                required
                maxLength={24}
                value={user2Name}
                onChange={(e) => setUser2Name(e.target.value)}
                placeholder="e.g. Rohan, Naina, Circuit"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-lime-500 transition-colors"
              />
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-[11px] text-slate-300 space-y-1">
              <p className="font-semibold text-lime-400">Rules of the game:</p>
              <p>1. Pehle {user1Name || 'Player 1'} 5 questions answer karega.</p>
              <p>2. Phir phone pass hoga {user2Name || 'Player 2'} ko.</p>
              <p>3. Zero cheating & no peeking allowed!</p>
            </div>

            <button
              type="submit"
              disabled={!user1Name.trim() || !user2Name.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <span>Start Round 1 ({user1Name || 'Player 1'})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // STEP: Handoff Screen ("Pass the Phone")
  if (step === 'handoff') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-md mx-auto px-6 text-center">
        <div className="w-full glass-panel rounded-3xl p-8 border border-lime-500/30 relative overflow-hidden shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce">📱🤝</div>
          <div className="text-[11px] uppercase tracking-widest font-bold text-lime-400 mb-1">
            ROUND 1 COMPLETE
          </div>
          <h2 className="text-2xl font-black text-white font-display mb-2">
            Ab phone {user2Name} ko do!
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto mb-6">
            Aankhein band karlo <span className="text-white font-semibold">{user1Name}</span>, no peeking!
            Ab baari hai <span className="text-lime-300 font-semibold">{user2Name}</span> ki sachai batane ki.
          </p>

          <button
            onClick={handleStartP2}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-lime-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>Main {user2Name} hoon, Let's Play!</span>
          </button>
        </div>
      </div>
    );
  }

  // STEP: Player 1 or Player 2 Quiz Round
  const isP1 = step === 'p1-quiz';
  const currentActiveName = isP1 ? user1Name : user2Name;
  const currentQuestion = FRIEND_QUESTIONS[currentQIndex];

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto pb-24 px-4 pt-2">
      {/* Header with Player turn and progress */}
      <div className="w-full flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
          <span className="text-xs font-bold text-lime-400">
            {isP1 ? `Round 1: ${user1Name}` : `Round 2: ${user2Name}`}
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {currentQIndex + 1} of {FRIEND_QUESTIONS.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 transition-all duration-300"
          style={{ width: `${((currentQIndex + 1) / FRIEND_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="w-full glass-panel rounded-3xl p-6 border border-white/10 shadow-xl mb-4">
        <div className="text-[10px] tracking-widest uppercase font-bold text-slate-400 mb-1">
          Dost Reality Check #{currentQIndex + 1}
        </div>
        <h2 className="text-lg font-bold text-white leading-snug font-display">
          {currentQuestion.question}
        </h2>
      </div>

      {/* 4 Funny Options */}
      <div className="w-full space-y-2.5">
        {currentQuestion.options.map((opt, i) => (
          <button
            key={i}
            onClick={() =>
              isP1
                ? handleSelectP1Option(currentQuestion.id, opt.label)
                : handleSelectP2Option(currentQuestion.id, opt.label)
            }
            className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-lime-500/20 border border-white/10 hover:border-lime-500/40 text-slate-200 text-xs font-medium leading-relaxed transition-all active:scale-[0.98] flex items-start gap-3"
          >
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-lime-400 shrink-0 mt-0.5">
              {String.fromCharCode(65 + i)}
            </span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
