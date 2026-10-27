import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Crown, Sparkles, Check, X, Flame, Heart, Palette, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/soundEffects.ts';
import { isUserVip, setUserVip } from '../utils/storage.ts';

interface PremiumModalProps {
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  const [isVip, setIsVipState] = useState(isUserVip());
  const [unlockedSuccess, setUnlockedSuccess] = useState(false);

  const handleUnlock = () => {
    sounds.playSuccess();
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#fbbf24', '#fef3c7', '#ec4899']
      });
    } catch {
      // ignore
    }
    setUserVip(true);
    setIsVipState(true);
    setUnlockedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#2b1f07] via-[#1a1203] to-[#0a0701] border border-amber-500/40 p-6 shadow-2xl overflow-hidden my-auto">
        {/* Glow ambient */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
            <Crown className="w-8 h-8 text-amber-400" />
          </div>
          <div className="text-[10px] tracking-widest uppercase font-bold text-amber-400">
            VIBECHECK GOLD VIP
          </div>
          <h2 className="text-2xl font-black text-white font-display">
            Unlock Full Savage AI
          </h2>
          <p className="text-xs text-amber-200/80 mt-1">
            Gen Z ke sabse unhinged features unlock karo.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-6">
          {[
            {
              icon: <Flame className="w-4 h-4 text-rose-400" />,
              title: "Extra Spicy Savage Mode",
              desc: "Uncapped college canteen level brutal roasts"
            },
            {
              icon: <Heart className="w-4 h-4 text-pink-400" />,
              title: "Couple & Crush Mode",
              desc: "Test mutual attraction & red flag compatibility"
            },
            {
              icon: <Palette className="w-4 h-4 text-purple-400" />,
              title: "VIP Holographic & Gold Card Themes",
              desc: "Special Instagram Story export aesthetics"
            },
            {
              icon: <Sparkles className="w-4 h-4 text-amber-400" />,
              title: "Kundali & Astro Roast",
              desc: "AI planetary roast based on birthday & signs"
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-2xl bg-black/40 border border-amber-500/20"
            >
              <div className="p-2 rounded-xl bg-white/5 shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[11px] text-slate-300 leading-tight">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Price & CTA */}
        {unlockedSuccess || isVip ? (
          <div className="space-y-3 text-center">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>VIP Status Active! All Features Unlocked</span>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleUnlock}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black font-extrabold text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all"
            >
              <Crown className="w-4 h-4" />
              <span>Unlock for ₹49 (Beta Free Access)</span>
            </button>
            <p className="text-center text-[10px] text-slate-400">
              No credit card required · Early beta user pass
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
