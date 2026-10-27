import React, { useState } from 'react';
import { AppScreen } from './types.ts';
import { HomeScreen } from './components/HomeScreen.tsx';
import { QuizScreen } from './components/QuizScreen.tsx';
import { RoastMe } from './components/RoastMe.tsx';
import { FriendTest } from './components/FriendTest.tsx';
import { DailyVibe } from './components/DailyVibe.tsx';
import { HistoryScreen } from './components/HistoryScreen.tsx';
import { ProfileScreen } from './components/ProfileScreen.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { PremiumModal } from './components/PremiumModal.tsx';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#08070e] text-slate-100 flex flex-col justify-between relative selection:bg-pink-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main content frame */}
      <main className="w-full max-w-md mx-auto flex-1 flex flex-col pt-3 z-10">
        {currentScreen === 'home' && (
          <HomeScreen
            onStartQuiz={() => setCurrentScreen('quiz')}
            onOpenRoast={() => setCurrentScreen('roast-me')}
            onOpenFriend={() => setCurrentScreen('friend-test')}
            onOpenDaily={() => setCurrentScreen('daily')}
            onOpenPremium={() => setShowPremiumModal(true)}
          />
        )}

        {currentScreen === 'quiz' && (
          <QuizScreen onGoHome={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'roast-me' && (
          <RoastMe
            onGoHome={() => setCurrentScreen('home')}
            onOpenPremium={() => setShowPremiumModal(true)}
          />
        )}

        {currentScreen === 'friend-test' && (
          <FriendTest onGoHome={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'daily' && (
          <DailyVibe onGoHome={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'history' && (
          <HistoryScreen
            onGoHome={() => setCurrentScreen('home')}
            onStartQuiz={() => setCurrentScreen('quiz')}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            onGoHome={() => setCurrentScreen('home')}
            onOpenPremium={() => setShowPremiumModal(true)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />

      {/* Premium Teaser Modal */}
      {showPremiumModal && (
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}
    </div>
  );
}
