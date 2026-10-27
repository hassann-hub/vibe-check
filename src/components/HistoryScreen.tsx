import React, { useState, useEffect } from 'react';
import { Clock, Trash2, Share2, Flame, Sparkles, Filter, X } from 'lucide-react';
import {
  getHistory,
  HistoryItem,
  deleteHistoryItem,
  clearAllHistory,
  getStreakData
} from '../utils/storage.ts';
import { VibeResult, RoastResult, FriendResult, DailyResult } from '../types.ts';
import { ResultCard } from './ResultCard.tsx';
import { FriendResultCard } from './FriendResultCard.tsx';
import { RoastResultCard } from './RoastResultCard.tsx';
import { sounds } from '../utils/soundEffects.ts';

interface HistoryScreenProps {
  onGoHome: () => void;
  onStartQuiz: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onGoHome, onStartQuiz }) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'quiz' | 'roast' | 'friend' | 'daily'>('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const streak = getStreakData();

  useEffect(() => {
    setHistoryItems(getHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    deleteHistoryItem(id);
    setHistoryItems(getHistory());
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Sach mein saari Vibe History delete karni hai?")) {
      sounds.playPop();
      clearAllHistory();
      setHistoryItems([]);
    }
  };

  const filteredItems = historyItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

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
        <div className="flex items-center gap-2">
          {historyItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Screen Title & Streak Stat Banner */}
      <div className="w-full mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-widest uppercase font-bold text-pink-400">
              Saved Archives
            </div>
            <h1 className="text-2xl font-black text-white font-display">
              Vibe History
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            <span>{streak.count} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {[
          { key: 'all', label: 'All' },
          { key: 'quiz', label: 'Quizzes' },
          { key: 'roast', label: 'Roasts' },
          { key: 'friend', label: 'BFF Tests' },
          { key: 'daily', label: 'Daily Auras' }
        ].map((tab) => {
          const isActive = filterType === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                sounds.playSelect();
                setFilterType(tab.key as any);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* History Items List */}
      {filteredItems.length === 0 ? (
        <div className="w-full glass-panel rounded-3xl p-8 border border-white/10 text-center my-6">
          <span className="text-5xl inline-block mb-3">👻</span>
          <h2 className="text-lg font-bold text-white mb-1 font-display">
            Abhi koi Vibe Card nahi hai!
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto mb-5">
            Apna pehla viral Vibe Check quiz lo ya kisi dost ka test karke yahan card save karo.
          </p>
          <button
            onClick={onStartQuiz}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 active:scale-95 transition-all"
          >
            Start Vibe Check Quiz ⚡
          </button>
        </div>
      ) : (
        <div className="w-full space-y-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                sounds.playPop();
                setSelectedItem(item);
              }}
              className="w-full p-4 rounded-2xl glass-card border border-white/10 hover:border-pink-500/40 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-pink-400">
                      {item.type === 'quiz'
                        ? 'Vibe Quiz'
                        : item.type === 'roast'
                        ? 'AI Roast'
                        : item.type === 'friend'
                        ? 'BFF Compatibility'
                        : 'Daily Aura'}
                    </span>
                    <span className="text-[10px] text-slate-400">· {item.dateStr}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate font-display">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  title="Delete card"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal View for Selected Card */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
          <div className="relative w-full max-w-md my-auto">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-2 right-2 z-50 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedItem.type === 'quiz' && (
              <ResultCard
                result={selectedItem.payload as VibeResult}
                onRetake={() => setSelectedItem(null)}
                onGoHome={() => setSelectedItem(null)}
              />
            )}

            {selectedItem.type === 'friend' && (
              <FriendResultCard
                result={selectedItem.payload as FriendResult}
                onRetake={() => setSelectedItem(null)}
                onGoHome={() => setSelectedItem(null)}
              />
            )}

            {selectedItem.type === 'roast' && (
              <RoastResultCard
                result={selectedItem.payload as RoastResult}
                onRetake={() => setSelectedItem(null)}
                onGoHome={() => setSelectedItem(null)}
              />
            )}

            {selectedItem.type === 'daily' && (
              <div className="w-full glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#1b152b] to-[#0a0715] text-center">
                <span className="text-6xl inline-block mb-3 animate-bounce">
                  {(selectedItem.payload as DailyResult).emoji}
                </span>
                <div className="text-[10px] tracking-widest uppercase font-bold text-pink-400">
                  DAILY VIBE AURA ARCHIVE
                </div>
                <h2 className="text-2xl font-black text-white mt-1 font-display">
                  {(selectedItem.payload as DailyResult).aura}
                </h2>
                <p className="text-xs text-slate-300 mt-3 italic max-w-xs mx-auto">
                  "{(selectedItem.payload as DailyResult).answer}"
                </p>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
                  <span>{(selectedItem.payload as DailyResult).dateStr}</span>
                  <button
                    onClick={() => {
                      sounds.playPop();
                      const text = `Check my Daily Aura: ${(selectedItem.payload as DailyResult).aura} ${(selectedItem.payload as DailyResult).emoji} on VibeCheck!`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
