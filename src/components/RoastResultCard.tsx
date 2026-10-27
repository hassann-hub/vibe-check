import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Share2, Copy, Check, RefreshCw, Palette, Flame, Instagram } from 'lucide-react';
import { RoastResult, CARD_THEMES } from '../types.ts';
import { sounds } from '../utils/soundEffects.ts';

interface RoastResultCardProps {
  result: RoastResult;
  onRetake: () => void;
  onGoHome: () => void;
}

export const RoastResultCard: React.FC<RoastResultCardProps> = ({ result, onRetake, onGoHome }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedThemeKey, setSelectedThemeKey] = useState<string>('sunset-pink');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    sounds.playSavage();
    try {
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f97316', '#ec4899']
      });
    } catch {
      // ignore
    }
  }, []);

  const currentTheme = CARD_THEMES[selectedThemeKey] || CARD_THEMES['sunset-pink'];
  const themeKeys = Object.keys(CARD_THEMES);

  const cycleTheme = () => {
    sounds.playPop();
    const currentIndex = themeKeys.indexOf(selectedThemeKey);
    const nextKey = themeKeys[(currentIndex + 1) % themeKeys.length];
    setSelectedThemeKey(nextKey);
  };

  const handleShareInstagramStory = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    sounds.playPop();

    try {
      await new Promise((r) => setTimeout(r, 120));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 1.0,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });

      const fileName = `VibeCheck-Roast-${result.name || 'Desi'}.png`;

      if (navigator.share && navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `${result.name}'s Savage Roast`,
              text: `AI ne meri dhajjiyan uda di: "${result.punchline}" 😂🔥 Check yours on VibeCheck!`,
              files: [file]
            });
            setToastMessage('Shared to Instagram Story! 📸');
            setTimeout(() => setToastMessage(null), 3500);
            setIsExporting(false);
            return;
          }
        } catch {
          // fallback to download
        }
      }

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      setToastMessage('9:16 Story Image Saved! Open Instagram → Add to Story 📸');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to export story card:', err);
      setToastMessage('Export failed. Please try again!');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleWhatsAppShare = () => {
    sounds.playPop();
    const text = `Bhai AI ne mera Roast kardiya, check this out! 💀🔥\n\n*Roast Title:* ${result.title} ${result.emoji}\n*Level:* ${result.savageLevel.toUpperCase()}\n*Punchline:* "${result.punchline}"\n\n*Diagnosis:* ${result.diagnosis}\n*Remedy:* ${result.prescribedRemedy}\n\nRoast yourself here: ${window.location.origin}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = async () => {
    sounds.playSelect();
    const text = `🔥 ROAST ME RESULT FOR ${result.name}:\nTitle: ${result.title} ${result.emoji}\nLevel: ${result.savageLevel}\n\nPunchline: ${result.punchline}\n\nRoast:\n${result.roastLines.map((l, i) => `${i + 1}. ${l}`).join('\n')}\n\nDiagnosis: ${result.diagnosis}\nRemedy: ${result.prescribedRemedy}\n\nMade with VibeCheck ✨ ${window.location.origin}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto pb-24 px-4 pt-2">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 max-w-md mx-auto z-50 p-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold text-xs text-center shadow-2xl border border-white/20 animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}

      {/* Top Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <button
          onClick={onGoHome}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          ← Home
        </button>
        <button
          onClick={cycleTheme}
          className="text-xs font-medium text-pink-400 hover:text-pink-300 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Palette className="w-3.5 h-3.5" />
          Theme: {currentTheme.name}
        </button>
      </div>

      {/* 9:16 Instagram Story Card */}
      <div
        ref={cardRef}
        id="roast-story-card"
        className={`w-full aspect-[9/16] rounded-3xl p-6 bg-gradient-to-b ${currentTheme.bgGradient} border ${currentTheme.borderGlow} relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-300`}
        style={{ minHeight: '640px' }}
      >
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Brand Watermark */}
        <div className="relative z-10">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌶️</span>
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-white font-display">
                  VIBECHECK
                </span>
                <span className="text-[9px] text-rose-400 font-bold block -mt-0.5 tracking-wider">
                  SAVAGE AI ROAST REPORT
                </span>
              </div>
            </div>
            <div className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {result.savageLevel === 'extra-spicy'
                ? 'Extra Spicy 🌶️🌶️🌶️'
                : result.savageLevel === 'medium'
                ? 'Medium 🌶️🌶️'
                : 'Mild 🌶️'}
            </div>
          </div>

          {/* Title & Emoji */}
          <div className="text-center mt-5 mb-3">
            <span className="text-6xl inline-block drop-shadow-md hover:scale-110 transition-transform">
              {result.emoji}
            </span>
            <div className="mt-2 text-[10px] tracking-widest uppercase font-bold text-rose-400">
              ROAST VERDICT FOR @{result.name}
            </div>
            <h1 className="text-2xl font-black text-white mt-1 leading-tight tracking-tight font-display">
              {result.title}
            </h1>
            <p className="text-xs font-semibold text-rose-200/90 italic mt-1.5 px-2">
              "{result.punchline}"
            </p>
          </div>
        </div>

        {/* Roast Lines */}
        <div className="relative z-10 my-2 bg-black/45 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
          <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            AI Roast Punchlines
          </div>
          {result.roastLines.map((line, idx) => (
            <div key={idx} className="text-xs text-slate-100 leading-relaxed flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">{idx + 1}.</span>
              <span>{line}</span>
            </div>
          ))}
        </div>

        {/* Diagnosis & Desi Remedy */}
        <div className="relative z-10 space-y-2">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 text-xs">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">
              🩺 Clinical Diagnosis
            </div>
            <p className="text-[11px] text-slate-200 font-medium">
              {result.diagnosis}
            </p>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-2.5 backdrop-blur-sm text-xs">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">
              💊 Desi Remedy
            </div>
            <p className="text-[11px] text-emerald-100 font-medium">
              {result.prescribedRemedy}
            </p>
          </div>
        </div>

        {/* Brand Watermark Footer */}
        <div className="relative z-10 pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
          <div className="flex items-center gap-1.5 font-bold tracking-wide text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>Made with VibeCheck</span>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-rose-400">
            vibecheck.in
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full mt-4 space-y-2.5">
        <button
          onClick={handleShareInstagramStory}
          disabled={isExporting}
          className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-extrabold text-sm shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2.5 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating 9:16 Story PNG...</span>
            </>
          ) : (
            <>
              <Instagram className="w-5 h-5" />
              <span>Share on Instagram Story</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleWhatsAppShare}
            className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <span>💬</span> Share WhatsApp
          </button>
          <button
            onClick={handleCopyText}
            className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Roast
              </>
            )}
          </button>
        </div>

        <button
          onClick={onRetake}
          className="w-full py-2.5 text-xs font-medium text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Roast Again with New Habits
        </button>
      </div>
    </div>
  );
};
