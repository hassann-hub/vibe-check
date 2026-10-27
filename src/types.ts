export type AppScreen = 'home' | 'quiz' | 'quiz-result' | 'roast-me' | 'roast-result' | 'friend-test' | 'friend-result' | 'daily' | 'history' | 'profile' | 'premium';

export interface VibeResult {
  id: string;
  userName: string;
  vibeType: string;
  emoji: string;
  themeGradient: string;
  roast: string[];
  traits: string[];
  redFlag: string;
  greenFlag: string;
  vibeQuote: string;
  createdAt: string;
  isAiGenerated?: boolean;
}

export interface RoastResult {
  id: string;
  name: string;
  title: string;
  emoji: string;
  punchline: string;
  roastLines: string[];
  diagnosis: string;
  prescribedRemedy: string;
  savageLevel: 'mild' | 'medium' | 'extra-spicy';
  createdAt: string;
  isAiGenerated?: boolean;
}

export interface FriendResult {
  id: string;
  user1Name: string;
  user2Name: string;
  compatibilityScore: number;
  duoTitle: string;
  emoji: string;
  summaryRoast: string;
  strongestBond: string;
  futurePrediction: string;
  createdAt: string;
  isAiGenerated?: boolean;
}

export interface DailyResult {
  id: string;
  dateStr: string;
  aura: string;
  emoji: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface CardTheme {
  id: string;
  name: string;
  bgGradient: string;
  borderGlow: string;
  textColor: string;
  accentBadge: string;
}

export const CARD_THEMES: Record<string, CardTheme> = {
  'purple-neon': {
    id: 'purple-neon',
    name: 'Cyber Violet',
    bgGradient: 'from-[#1a0b2e] via-[#2d1254] to-[#0d0722]',
    borderGlow: 'border-purple-500/30 shadow-[0_0_35px_rgba(168,85,247,0.25)]',
    textColor: 'text-purple-300',
    accentBadge: 'bg-purple-500/20 text-purple-200 border-purple-400/30'
  },
  'sunset-pink': {
    id: 'sunset-pink',
    name: 'Sunset Drama',
    bgGradient: 'from-[#2e081f] via-[#4d0d32] to-[#12040d]',
    borderGlow: 'border-pink-500/30 shadow-[0_0_35px_rgba(244,63,94,0.25)]',
    textColor: 'text-pink-300',
    accentBadge: 'bg-pink-500/20 text-pink-200 border-pink-400/30'
  },
  'electric-cyan': {
    id: 'electric-cyan',
    name: 'Electric Chill',
    bgGradient: 'from-[#06202e] via-[#09354d] to-[#041017]',
    borderGlow: 'border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.25)]',
    textColor: 'text-cyan-300',
    accentBadge: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30'
  },
  'toxic-lime': {
    id: 'toxic-lime',
    name: 'Kaleshi Lime',
    bgGradient: 'from-[#16270a] via-[#284411] to-[#0a1204]',
    borderGlow: 'border-lime-500/30 shadow-[0_0_35px_rgba(132,204,22,0.25)]',
    textColor: 'text-lime-300',
    accentBadge: 'bg-lime-500/20 text-lime-200 border-lime-400/30'
  },
  'cyber-violet': {
    id: 'cyber-violet',
    name: 'Midnight Gold',
    bgGradient: 'from-[#2b1f07] via-[#45310b] to-[#140e03]',
    borderGlow: 'border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.25)]',
    textColor: 'text-amber-300',
    accentBadge: 'bg-amber-500/20 text-amber-200 border-amber-400/30'
  }
};
