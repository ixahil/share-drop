"use client";
import { useCallback } from "react";

const useLocalStorage = () => {
  const setItem = useCallback(<T,>(key: string, value: T) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  const getItem = useCallback(<T,>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    const item = localStorage.getItem(key);
    if (item) {
      const parsedItem = JSON.parse(item) as T;
      return parsedItem;
    }
    return null;
  }, []);

  return { getItem, setItem };
};

export default useLocalStorage;
