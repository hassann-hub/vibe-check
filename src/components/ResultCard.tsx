import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Download, Copy, Check, Sparkles, RefreshCw, Palette, Instagram } from 'lucide-react';
import { VibeResult, CARD_THEMES } from '../types.ts';
import { sounds } from '../utils/soundEffects.ts';

interface ResultCardProps {
  result: VibeResult;
  onRetake: () => void;
  onGoHome: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onRetake, onGoHome }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedThemeKey, setSelectedThemeKey] = useState<string>(result.themeGradient || 'purple-neon');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    sounds.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#06b6d4', '#eab308']
      });
    } catch {
      // ignore
    }
  }, []);

  const currentTheme = CARD_THEMES[selectedThemeKey] || CARD_THEMES['purple-neon'];
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
      // Ensure layout and fonts are fully settled
      await new Promise((r) => setTimeout(r, 120));

      // Generate pristine 9:16 PNG using html-to-image with 3x pixel ratio
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 1.0,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });

      const fileName = `VibeCheck-Story-${(result.userName || 'Me').replace(/\s+/g, '-')}.png`;

      // Check if navigator.share with files is supported (mobile iOS/Android)
      if (navigator.share && navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `${result.userName}'s VibeCheck`,
              text: `Check my Vibe Type on VibeCheck: ${result.vibeType} ${result.emoji}! 🔥`,
              files: [file]
            });
            setToastMessage('Shared to Instagram Story! 📸');
            setTimeout(() => setToastMessage(null), 3500);
            setIsExporting(false);
            return;
          }
        } catch (shareErr) {
          console.warn('Native share error or dismissed, falling back to download:', shareErr);
        }
      }

      // Download file directly for Instagram Story upload
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      setToastMessage('9:16 Story Image Saved! Open Instagram → Add to Story 📸');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to export Instagram story card:', err);
      setToastMessage('Export failed. Please try again!');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleWhatsAppShare = () => {
    sounds.playPop();
    const text = `Bhai mera VibeCheck roast dekh! 💀🔥\n\n*Vibe Type:* ${result.vibeType} ${result.emoji}\n*Roast:* "${result.roast[0]}"\n*Red Flag:* ${result.redFlag}\n\nCheck your vibe here: ${window.location.origin}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = async () => {
    sounds.playSelect();
    const text = `🔥 VibeCheck for ${result.userName}:\nType: ${result.vibeType} ${result.emoji}\n\nRoast:\n1. ${result.roast[0]}\n2. ${result.roast[1]}\n3. ${result.roast[2]}\n\n🚩 Red Flag: ${result.redFlag}\n🍀 Green Flag: ${result.greenFlag}\n\nMade with VibeCheck ✨ ${window.location.origin}`;
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
        <div className="fixed top-4 inset-x-4 max-w-md mx-auto z-50 p-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold text-xs text-center shadow-2xl border border-white/20 animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}

      {/* Top Banner Controls */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <button
          onClick={onGoHome}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
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

      {/* Shareable 9:16 Aspect Ratio Instagram Story Card Container */}
      <div
        ref={cardRef}
        id="instagram-story-card"
        className={`w-full aspect-[9/16] rounded-3xl p-6 bg-gradient-to-b ${currentTheme.bgGradient} border ${currentTheme.borderGlow} relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-300`}
        style={{ minHeight: '640px' }}
      >
        {/* Ambient neon backdrop glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Brand Watermark */}
        <div className="relative z-10">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-white font-display">
                  VIBECHECK
                </span>
                <span className="text-[9px] text-pink-400 font-bold block -mt-0.5 tracking-wider">
                  APNA VIBE PATA KARO
                </span>
              </div>
            </div>
            <div className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white/95 border border-white/15 backdrop-blur-sm">
              @{result.userName || 'You'}
            </div>
          </div>

          {/* Vibe Title & Emoji Hero Anchor */}
          <div className="text-center mt-5 mb-3">
            <div className="inline-block relative">
              <span className="text-6xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transform inline-block hover:scale-110 transition-transform">
                {result.emoji || '🔥'}
              </span>
              <span className="absolute -top-1 -right-2 text-sm animate-bounce">⚡</span>
            </div>
            <div className="mt-2 text-[10px] tracking-widest uppercase font-bold text-pink-400">
              OFFICIAL VIBE TYPE
            </div>
            <h1 className="text-2xl font-black text-white mt-1 leading-tight tracking-tight drop-shadow-sm font-display">
              {result.vibeType}
            </h1>
            {result.vibeQuote && (
              <p className="text-xs italic text-white/75 mt-1 max-w-xs mx-auto">
                "{result.vibeQuote}"
              </p>
            )}
          </div>
        </div>

        {/* 3-Line Witty Roast Box */}
        <div className="relative z-10 my-2 bg-black/45 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI Reality Check
          </div>
          <div className="space-y-2 text-xs leading-relaxed text-slate-100">
            {result.roast.map((line, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-pink-400 font-bold shrink-0">{idx + 1}.</span>
                <span>{line}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Traits & Flags */}
        <div className="relative z-10 space-y-2">
          {/* Traits */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">
              Personality Traits
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.traits.map((trait, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium bg-black/30 border border-white/10 text-white/90 px-2.5 py-0.5 rounded-lg"
                >
                  • {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Red Flag & Green Flag */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-rose-950/40 border border-rose-500/20 rounded-xl p-2.5 backdrop-blur-sm">
              <div className="text-[10px] font-bold text-rose-400 flex items-center gap-1 mb-0.5">
                <span>🚩</span> RED FLAG
              </div>
              <p className="text-[11px] text-rose-100 leading-snug line-clamp-3">
                {result.redFlag}
              </p>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-2.5 backdrop-blur-sm">
              <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mb-0.5">
                <span>🍀</span> GREEN FLAG
              </div>
              <p className="text-[11px] text-emerald-100 leading-snug line-clamp-3">
                {result.greenFlag}
              </p>
            </div>
          </div>
        </div>

        {/* Brand Watermark Footer */}
        <div className="relative z-10 pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
          <div className="flex items-center gap-1.5 font-bold tracking-wide text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
            <span>Made with VibeCheck</span>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-pink-400">
            vibecheck.in
          </span>
        </div>
      </div>

      {/* Share Actions */}
      <div className="w-full mt-4 space-y-2.5">
        {/* Explicit 'Share on Instagram Story' Button */}
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

        {/* Secondary Sharing Actions */}
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
                Copy Text
              </>
            )}
          </button>
        </div>

        {/* Retake Button */}
        <button
          onClick={onRetake}
          className="w-full py-2.5 text-xs font-medium text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retake Quiz or Check Friend's Vibe
        </button>
      </div>
    </div>
  );
};
