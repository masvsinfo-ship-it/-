
import { HistoryItem } from './types';

const STORAGE_KEY = 'stone_calc_history_flat';

export const saveToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
  const history = getHistory();
  const newItem: HistoryItem = { ...item, id: Date.now().toString(), timestamp: Date.now() };
  const updated = [newItem, ...history].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getHistory = (): HistoryItem[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  try { return stored ? JSON.parse(stored) : []; } catch { return []; }
};

export const deleteHistoryItem = (id: string) => {
  const history = getHistory();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.filter(i => i.id !== id)));
};

export const clearAllHistory = () => localStorage.removeItem(STORAGE_KEY);
