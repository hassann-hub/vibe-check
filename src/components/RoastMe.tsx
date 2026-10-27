import React, { useState } from 'react';
import { Flame, Sparkles, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { RoastResult } from '../types.ts';
import { RoastResultCard } from './RoastResultCard.tsx';
import { sounds } from '../utils/soundEffects.ts';
import { saveHistoryItem, getStoredUserName, isUserVip } from '../utils/storage.ts';

interface RoastMeProps {
  onGoHome: () => void;
  onOpenPremium: () => void;
}

export const RoastMe: React.FC<RoastMeProps> = ({ onGoHome, onOpenPremium }) => {
  const [name, setName] = useState(getStoredUserName() || '');
  const [habit, setHabit] = useState('');
  const [hobby, setHobby] = useState('');
  const [randomFact, setRandomFact] = useState('');
  const [savageLevel, setSavageLevel] = useState<'mild' | 'medium' | 'extra-spicy'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingMessages = [
    "Insta screen time aur search history scan ho rahi hai...",
    "Rishtedaaron ke taane download ho rahe hain...",
    "Procrastination meter 100% blast ho chuka hai...",
    "Savage Hinglish punchlines cook ho rahe hain..."
  ];

  const quickHabits = [
    "1% battery pe bhi reels scroll karna",
    "Alarm 10 baar snooze karke 11 baje uthna",
    "Zomato cart bana kar cancel kar dena"
  ];

  const quickHobbies = [
    "3 AM pe existential crisis documentary dekhna",
    "Online shopping cart bhar ke khali chhodna",
    "Ghar pe aalas se let kar Spotify sad songs sunna"
  ];

  const quickFacts = [
    "Dost ko seen pe chhod kar 4 din baad reply dena",
    "Strangers ke samne fake phone call ka natak karna",
    "Har 5 minute mein fridge khol ke wapas band karna"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !habit.trim() || !hobby.trim() || !randomFact.trim()) return;

    sounds.playSavage();
    setIsLoading(true);

    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1200);

    try {
      const res = await fetch('/api/roast-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          habit: habit.trim(),
          hobby: hobby.trim(),
          randomFact: randomFact.trim(),
          savageLevel
        })
      });

      const data: RoastResult = await res.json();
      clearInterval(interval);

      const roastResult: RoastResult = {
        ...data,
        id: `roast-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      setResult(roastResult);
      saveHistoryItem({
        id: roastResult.id,
        type: 'roast',
        title: roastResult.title,
        emoji: roastResult.emoji,
        subtitle: `Level: ${savageLevel.toUpperCase()} · ${roastResult.punchline.slice(0, 36)}...`,
        dateStr: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        payload: roastResult
      });
    } catch (err) {
      clearInterval(interval);
      console.error('Roast error:', err);
      // Fallback
      const fallbackResult: RoastResult = {
        id: `roast-${Date.now()}`,
        name: name.trim(),
        title: 'Certified Drama Creator',
        emoji: '🍿',
        punchline: 'Life chal nahi rahi, bas dharne pe baithi hai.',
        roastLines: [
          `Kehte ho "${habit}" tumhari habit hai... Bhai yeh habit nahi, self-sabotage ka free subscription hai.`,
          `"${hobby}" karne ka time hai tumhare paas, par dost ka 2-word message reply karne mein 3 business days lagte hain.`,
          `Aur yeh jo random fact diya hai: "${randomFact}"... Bro, even CID wouldn't be able to solve why you behave like this.`
        ],
        diagnosis: 'Chronic Procrastination with Delusional Ambitions',
        prescribedRemedy: 'Ek cup kadak chai piyo aur apni Zomato order history dekh kar sharam karo.',
        savageLevel,
        createdAt: new Date().toISOString()
      };
      setResult(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
  };

  if (result) {
    return <RoastResultCard result={result} onRetake={handleRetake} onGoHome={onGoHome} />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto px-6 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin flex items-center justify-center" />
          <span className="absolute inset-0 flex items-center justify-center text-3xl">
            🌶️
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2 font-display">
          Roasting You In Progress...
        </h2>
        <p className="text-xs text-rose-300 italic max-w-xs transition-opacity duration-300">
          {loadingMessages[loadingTextIndex]}
        </p>
      </div>
    );
  }

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
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" /> Roast Me Mode
        </span>
      </div>

      <div className="w-full glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <span className="text-5xl inline-block mb-2">🔥</span>
          <div className="text-[10px] tracking-widest uppercase font-bold text-rose-400">
            Zero Mercy AI Roast
          </div>
          <h1 className="text-2xl font-black text-white font-display">
            Roast Me, VibeCheck!
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Apni 3 ajeeb harkatein batao aur AI se authentic Hinglish roast suno.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Aapka Naam
            </label>
            <input
              type="text"
              required
              maxLength={24}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aryan, Simran, Rohan"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                1. Worst Habit (Aalas / Phone addiction)
              </label>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              value={habit}
              onChange={(e) => setHabit(e.target.value)}
              placeholder="e.g. Raat 3 baje tak reels scroll karna"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 transition-colors"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {quickHabits.map((h, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    sounds.playSelect();
                    setHabit(h);
                  }}
                  className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 px-2 py-0.5 rounded-md truncate max-w-[200px]"
                >
                  + {h}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                2. Hobby / Obsession
              </label>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              value={hobby}
              onChange={(e) => setHobby(e.target.value)}
              placeholder="e.g. Clothes buy karke kabhi na pehanna"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 transition-colors"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {quickHobbies.map((h, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    sounds.playSelect();
                    setHobby(h);
                  }}
                  className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 px-2 py-0.5 rounded-md truncate max-w-[200px]"
                >
                  + {h}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                3. Random Weird Fact / Quirk
              </label>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              value={randomFact}
              onChange={(e) => setRandomFact(e.target.value)}
              placeholder="e.g. Call kaat ke text karna 'Who is this?'"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 transition-colors"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {quickFacts.map((f, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    sounds.playSelect();
                    setRandomFact(f);
                  }}
                  className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 px-2 py-0.5 rounded-md truncate max-w-[200px]"
                >
                  + {f}
                </button>
              ))}
            </div>
          </div>

          {/* Savage Level Slider / Segmented Control */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Savage Level
              </label>
              <span className="text-[11px] font-bold text-rose-400">
                {savageLevel === 'mild' ? 'Mild 🌶️' : savageLevel === 'medium' ? 'Medium 🌶️🌶️' : 'Extra Spicy 🌶️🌶️🌶️'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'mild', label: 'Mild 🌶️', desc: 'Halka mazaak' },
                { key: 'medium', label: 'Medium 🌶️🌶️', desc: 'Desi taunts' },
                { key: 'extra-spicy', label: 'Extra Spicy 🌶️🌶️🌶️', desc: 'Full savage' }
              ].map((lvl) => {
                const isSelected = savageLevel === lvl.key;
                return (
                  <button
                    type="button"
                    key={lvl.key}
                    onClick={() => {
                      sounds.playSelect();
                      setSavageLevel(lvl.key as any);
                    }}
                    className={`py-2 px-2 rounded-xl text-center border transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{lvl.label}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{lvl.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 text-[10px] text-slate-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>100% Wholesome: No religion, caste, body shaming, politics, or abuse. Only funny banter!</span>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !habit.trim() || !hobby.trim() || !randomFact.trim()}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <span>Roast Me Now 🔥</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
