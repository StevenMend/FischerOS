// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';
import { logger } from '../core/utils/logger';

/**
 * Hook for managing localStorage with React state
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error('LocalStorage', 'Error reading localStorage', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      logger.error('LocalStorage', 'Error setting localStorage', error);
    }
  };

  return [storedValue, setValue] as const;
}
