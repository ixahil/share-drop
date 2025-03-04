"use client";
import { useCallback } from "react";

const useSessionStorage = () => {
  const setItem = useCallback(<T,>(key: string, value: T) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(key, JSON.stringify(value));
  }, []);

  const getItem = useCallback(<T,>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    const item = sessionStorage.getItem(key);
    if (item) {
      const parsedItem = JSON.parse(item) as T;
      console.log(parsedItem);
      return parsedItem;
    }
    return null;
  }, []);

  return { getItem, setItem };
};

export default useSessionStorage;
