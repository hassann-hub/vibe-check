import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Share2, Copy, Check, RefreshCw, Palette, Instagram } from 'lucide-react';
import { FriendResult, CARD_THEMES } from '../types.ts';
import { sounds } from '../utils/soundEffects.ts';

interface FriendResultCardProps {
  result: FriendResult;
  onRetake: () => void;
  onGoHome: () => void;
}

export const FriendResultCard: React.FC<FriendResultCardProps> = ({ result, onRetake, onGoHome }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedThemeKey, setSelectedThemeKey] = useState<string>('toxic-lime');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    sounds.playSuccess();
    try {
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#84cc16', '#eab308', '#ec4899', '#06b6d4']
      });
    } catch {
      // ignore
    }
  }, []);

  const currentTheme = CARD_THEMES[selectedThemeKey] || CARD_THEMES['toxic-lime'];
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

      const fileName = `VibeCheck-BFF-${result.user1Name}-${result.user2Name}.png`;

      if (navigator.share && navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `${result.user1Name} & ${result.user2Name} Friendship Vibe`,
              text: `Humara friendship score ${result.compatibilityScore}% hai: ${result.duoTitle}! 😂 Check your vibe on VibeCheck!`,
              files: [file]
            });
            setToastMessage('Shared to Instagram Story! 📸');
            setTimeout(() => setToastMessage(null), 3500);
            setIsExporting(false);
            return;
          }
        } catch {
          // fallback
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
    const text = `Bhai hamara Friendship Test Result aa gaya! 💀🤝\n\n*${result.user1Name} & ${result.user2Name}*\n*Compatibility:* ${result.compatibilityScore}%\n*Duo Type:* ${result.duoTitle} ${result.emoji}\n\n*Roast:* "${result.summaryRoast}"\n\n*Future:* ${result.futurePrediction}\n\nCheck yours here: ${window.location.origin}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = async () => {
    sounds.playSelect();
    const text = `🤝 BFF VIBECHECK: ${result.user1Name} & ${result.user2Name}\nScore: ${result.compatibilityScore}%\nType: ${result.duoTitle} ${result.emoji}\n\nRoast: ${result.summaryRoast}\n\nBond: ${result.strongestBond}\nPrediction: ${result.futurePrediction}\n\nMade with VibeCheck ✨ ${window.location.origin}`;
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
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 max-w-md mx-auto z-50 p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs text-center shadow-2xl border border-white/20 animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}

      {/* Top Banner */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <button
          onClick={onGoHome}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          ← Home
        </button>
        <button
          onClick={cycleTheme}
          className="text-xs font-medium text-lime-400 hover:text-lime-300 bg-lime-500/10 border border-lime-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Palette className="w-3.5 h-3.5" />
          Theme: {currentTheme.name}
        </button>
      </div>

      {/* 9:16 Instagram Story Card */}
      <div
        ref={cardRef}
        id="friend-story-card"
        className={`w-full aspect-[9/16] rounded-3xl p-6 bg-gradient-to-b ${currentTheme.bgGradient} border ${currentTheme.borderGlow} relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-300`}
        style={{ minHeight: '640px' }}
      >
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-lime-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Brand Watermark */}
        <div className="relative z-10">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤝</span>
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-white font-display">
                  VIBECHECK
                </span>
                <span className="text-[9px] text-lime-400 font-bold block -mt-0.5 tracking-wider">
                  DOST COMPATIBILITY TEST
                </span>
              </div>
            </div>
            <div className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white/95 border border-white/15 backdrop-blur-sm">
              {result.user1Name} + {result.user2Name}
            </div>
          </div>

          {/* Compatibility Score */}
          <div className="text-center mt-5 mb-3">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-lime-500/30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(132,204,22,0.3)]">
                <span className="text-3xl font-black text-white font-display">
                  {result.compatibilityScore}%
                </span>
                <span className="text-[9px] uppercase tracking-wider font-bold text-lime-400">
                  Synergy
                </span>
              </div>
              <span className="absolute -bottom-2 -right-1 text-2xl animate-bounce">
                {result.emoji}
              </span>
            </div>

            <div className="mt-3 text-[10px] tracking-widest uppercase font-bold text-lime-400">
              OFFICIAL FRIENDSHIP ARCHETYPE
            </div>
            <h1 className="text-2xl font-black text-white mt-1 leading-tight tracking-tight font-display">
              {result.duoTitle}
            </h1>
          </div>
        </div>

        {/* Witty Pair Roast in Hinglish */}
        <div className="relative z-10 my-2 bg-black/45 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="text-[10px] font-bold text-lime-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span>🔥</span> AI Duo Roast
          </div>
          <p className="text-xs leading-relaxed text-slate-100">
            {result.summaryRoast}
          </p>
        </div>

        {/* Strongest Bond & Future Prediction */}
        <div className="relative z-10 space-y-2">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <span>🧬</span> Asli Fevicol Ka Jod (Strongest Bond)
            </div>
            <p className="text-xs text-slate-200 leading-snug">
              {result.strongestBond}
            </p>
          </div>

          <div className="bg-amber-950/40 border border-amber-500/20 rounded-xl p-2.5 backdrop-blur-sm">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <span>🔮</span> 5 Saal Baad Ki Prediction
            </div>
            <p className="text-xs text-amber-100 leading-snug">
              {result.futurePrediction}
            </p>
          </div>
        </div>

        {/* Brand Watermark Footer */}
        <div className="relative z-10 pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
          <div className="flex items-center gap-1.5 font-bold tracking-wide text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-ping" />
            <span>Made with VibeCheck</span>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-lime-400">
            vibecheck.in
          </span>
        </div>
      </div>

      {/* Actions */}
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
                Copy Summary
              </>
            )}
          </button>
        </div>

        <button
          onClick={onRetake}
          className="w-full py-2.5 text-xs font-medium text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Test Another Friend
        </button>
      </div>
    </div>
  );
};
