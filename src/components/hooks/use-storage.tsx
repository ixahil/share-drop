type StorageType = "session" | "local";

type UseStorageReturnValue = {
  getItem: (key: string, type?: StorageType) => string;

  setItem: (key: string, value: string, type?: StorageType) => boolean;

  removeItem: (key: string, type?: StorageType) => void;
};

const useStorage = (): UseStorageReturnValue => {
  const isBrowser: boolean = ((): boolean => typeof window !== "undefined")();

  const getItem = (key: string, type?: StorageType): string => {
    return isBrowser ? sessionStorage.getItem(key)! : "";
  };

  const setItem = (key: string, value: string, type?: StorageType): boolean => {
    if (isBrowser) {
      sessionStorage.setItem(key, value);

      return true;
    }
    return false;
  };

  const removeItem = (key: string, type?: StorageType): void => {
    sessionStorage.removeItem(key);
  };

  return {
    getItem,
    setItem,
    removeItem,
  };
};
export default useStorage;
