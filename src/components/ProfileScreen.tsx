import React, { useState } from 'react';
import { User, Volume2, VolumeX, Crown, Flame, Share2, Sparkles, Check, Vibrate, Smartphone } from 'lucide-react';
import { sounds } from '../utils/soundEffects.ts';
import { haptics } from '../utils/haptics.ts';
import {
  getStoredUserName,
  setStoredUserName,
  getStreakData,
  getHistory,
  isUserVip
} from '../utils/storage.ts';

interface ProfileScreenProps {
  onOpenPremium: () => void;
  onGoHome: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenPremium, onGoHome }) => {
  const [userName, setUserName] = useState(getStoredUserName() || 'Dost');
  const [isEditing, setIsEditing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);
  const [hapticEnabled, setHapticEnabled] = useState(haptics.enabled);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const streak = getStreakData();
  const history = getHistory();
  const isVip = isUserVip();

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    setStoredUserName(userName.trim());
    setIsEditing(false);
    setSavedSuccess(true);
    sounds.playPop();
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleToggleSound = () => {
    const newState = sounds.toggle();
    setSoundEnabled(newState);
    if (newState) sounds.playPop();
  };

  const handleToggleHaptic = () => {
    const newState = haptics.toggle();
    setHapticEnabled(newState);
    if (newState) haptics.medium();
  };

  const handleShareApp = () => {
    sounds.playPop();
    const text = `Bhai yeh VibeCheck app check karo! 💀🔥 AI se brutal Hinglish roast aur personality test milta hai. Link: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto pb-24 px-4 pt-2">
      <div className="w-full flex items-center justify-between mb-4 px-1">
        <button
          onClick={onGoHome}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          ← Home
        </button>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white">
          Profile Settings
        </span>
      </div>

      {/* Profile Card */}
      <div className="w-full glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden mb-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 mx-auto flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(236,72,153,0.35)] relative">
          <span className="text-4xl">😎</span>
          {isVip && (
            <span className="absolute -top-1 -right-1 p-1 bg-amber-400 text-black rounded-full shadow">
              <Crown className="w-3.5 h-3.5 fill-black" />
            </span>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveName} className="flex items-center justify-center gap-2 max-w-xs mx-auto">
            <input
              type="text"
              required
              maxLength={24}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-black/50 border border-pink-500 text-white text-sm text-center font-bold focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-pink-500 text-white text-xs font-bold"
            >
              Save
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-black text-white font-display">
              @{userName}
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-pink-400 hover:underline font-semibold"
            >
              Edit
            </button>
          </div>
        )}

        {savedSuccess && (
          <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
            Name updated!
          </span>
        )}

        <div className="mt-2 flex items-center justify-center gap-1.5">
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
            {isVip ? 'Gold VIP Member' : 'Free Explorer'}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-orange-400 flex items-center justify-center gap-1 text-sm font-black font-display">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span>{streak.count} Days</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
              Current Streak
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-pink-400 flex items-center justify-center gap-1 text-sm font-black font-display">
              <Sparkles className="w-4 h-4" />
              <span>{history.length} Saved</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
              Vibes Checked
            </div>
          </div>
        </div>
      </div>

      {/* Preferences & Actions */}
      <div className="w-full space-y-2.5">
        {/* VIP Banner */}
        <button
          onClick={onOpenPremium}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/20 border border-amber-500/30 flex items-center justify-between text-left transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                {isVip ? 'VIP Features Unlocked' : 'VibeCheck Gold Teaser'}
              </h4>
              <p className="text-[11px] text-slate-300">
                {isVip ? 'You have access to all savage modes!' : 'Unlock extra spicy mode & themes for ₹49'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400">
            {isVip ? 'Active' : 'Preview'} →
          </span>
        </button>

        {/* Haptic feedback toggle */}
        <button
          onClick={handleToggleHaptic}
          className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-left hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 text-slate-300">
              <Smartphone className={`w-5 h-5 ${hapticEnabled ? 'text-pink-400 animate-pulse' : 'text-slate-500'}`} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Haptic Feedback (Vibration)</h4>
              <p className="text-[11px] text-slate-400">
                Tactile pulses on button clicks and card transitions
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold ${hapticEnabled ? 'text-pink-400' : 'text-slate-500'}`}>
            {hapticEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={handleToggleSound}
          className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-left hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 text-slate-300">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-rose-400" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Sound Effects</h4>
              <p className="text-[11px] text-slate-400">
                Synthesized pops, snaps and fanfare
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold ${soundEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
            {soundEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Share app */}
        <button
          onClick={handleShareApp}
          className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-left hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Invite Friends</h4>
              <p className="text-[11px] text-slate-400">
                Send VibeCheck to your WhatsApp group
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400">Share →</span>
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-500 mt-8">
        VibeCheck v2.5 · Tactile Mobile Edition ⚡
      </p>
    </div>
  );
};
