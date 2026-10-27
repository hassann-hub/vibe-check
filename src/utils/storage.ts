import { VibeResult, RoastResult, FriendResult, DailyResult } from '../types.ts';

export interface HistoryItem {
  id: string;
  type: 'quiz' | 'roast' | 'friend' | 'daily';
  title: string;
  emoji: string;
  subtitle: string;
  dateStr: string;
  payload: VibeResult | RoastResult | FriendResult | DailyResult;
}

export interface StreakData {
  count: number;
  lastCheckDate: string; // YYYY-MM-DD
  bestStreak: number;
}

const STORAGE_KEYS = {
  USER_NAME: 'vibecheck_username',
  HISTORY: 'vibecheck_history_v2',
  STREAK: 'vibecheck_streak_v2',
  IS_VIP: 'vibecheck_is_vip',
  DAILY_LAST_ANSWER: 'vibecheck_daily_answer_'
};

export const getStoredUserName = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.USER_NAME) || '';
  } catch {
    return '';
  }
};

export const setStoredUserName = (name: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  } catch {
    // ignore
  }
};

export const getHistory = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveHistoryItem = (item: HistoryItem): void => {
  try {
    const current = getHistory();
    // Prepend new item
    const updated = [item, ...current.filter((i) => i.id !== item.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving history item', e);
  }
};

export const deleteHistoryItem = (id: string): void => {
  try {
    const current = getHistory();
    const updated = current.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting history item', e);
  }
};

export const clearAllHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch {
    // ignore
  }
};

// Streak calculation
export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getStreakData = (): StreakData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
    if (!raw) {
      return { count: 0, lastCheckDate: '', bestStreak: 0 };
    }
    const data: StreakData = JSON.parse(raw);
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    // If last check was neither today nor yesterday, streak has reset
    if (data.lastCheckDate && data.lastCheckDate !== today && data.lastCheckDate !== yesterday) {
      return {
        count: 0,
        lastCheckDate: data.lastCheckDate,
        bestStreak: data.bestStreak || 0
      };
    }

    return data;
  } catch {
    return { count: 0, lastCheckDate: '', bestStreak: 0 };
  }
};

export const recordDailyParticipation = (): { newStreak: number; isFirstToday: boolean } => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const current = getStreakData();

  if (current.lastCheckDate === today) {
    return { newStreak: current.count, isFirstToday: false };
  }

  let newCount = 1;
  if (current.lastCheckDate === yesterday) {
    newCount = current.count + 1;
  }

  const updated: StreakData = {
    count: newCount,
    lastCheckDate: today,
    bestStreak: Math.max(newCount, current.bestStreak || 0)
  };

  try {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return { newStreak: newCount, isFirstToday: true };
};

export const getDailyAnswerForToday = (): DailyResult | null => {
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_LAST_ANSWER + today);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveDailyAnswerForToday = (res: DailyResult): void => {
  const today = getTodayDateString();
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_LAST_ANSWER + today, JSON.stringify(res));
  } catch {
    // ignore
  }
};

export const isUserVip = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEYS.IS_VIP) === 'true';
  } catch {
    return false;
  }
};

export const setUserVip = (vip: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_VIP, String(vip));
  } catch {
    // ignore
  }
};
