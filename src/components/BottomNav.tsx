import React from 'react';
import { Home, Flame, Clock, User } from 'lucide-react';
import { AppScreen } from '../types.ts';
import { sounds } from '../utils/soundEffects.ts';
import { getStreakData, getHistory } from '../utils/storage.ts';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const streak = getStreakData();
  const history = getHistory();

  const navItems = [
    {
      screen: 'home' as AppScreen,
      label: 'Home',
      icon: <Home className="w-5 h-5" />
    },
    {
      screen: 'daily' as AppScreen,
      label: 'Daily',
      icon: <Flame className="w-5 h-5" />,
      badge: streak.count > 0 ? `${streak.count}🔥` : undefined
    },
    {
      screen: 'history' as AppScreen,
      label: 'History',
      icon: <Clock className="w-5 h-5" />,
      badge: history.length > 0 ? String(history.length) : undefined
    },
    {
      screen: 'profile' as AppScreen,
      label: 'Profile',
      icon: <User className="w-5 h-5" />
    }
  ];

  const handleTabClick = (screen: AppScreen) => {
    sounds.playSelect();
    onNavigate(screen);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0c0a18]/90 backdrop-blur-xl border-t border-white/10 px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            currentScreen === item.screen ||
            (item.screen === 'home' &&
              (currentScreen === 'quiz' ||
                currentScreen === 'roast-me' ||
                currentScreen === 'friend-test'));

          return (
            <button
              key={item.screen}
              onClick={() => handleTabClick(item.screen)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl relative transition-all active:scale-95 ${
                isActive ? 'text-pink-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 text-[9px] font-black px-1.5 py-0.2 rounded-full bg-orange-500 text-white shadow-sm leading-tight">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-pink-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
