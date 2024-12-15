import { writable, type Updater, type Writable } from "svelte/store";
import type { Serializer } from "./localStorageStoreTypes";

const DEFAULT_SERIALIZER: Serializer = JSON;

function useLocalStorage<T>(key: string, defaultValue: T): Writable<T> {
  function updateLocalStorage(key: string, value: T) {
    window.localStorage.setItem(key, DEFAULT_SERIALIZER.stringify(value));
  }

  function storeStartStopNotifier(set: (value: T) => void) {
    function handleStorageEvent(event: StorageEvent) {
      if (event.key === key) {
        set(event.newValue ? DEFAULT_SERIALIZER.parse(event.newValue) : null);
      }
    }
    window.addEventListener("storage", handleStorageEvent);

    return () => window.removeEventListener("storage", handleStorageEvent);
  }

  const existingValue = window.localStorage.getItem(key);
  let initial = defaultValue;
  if (existingValue) {
    initial = DEFAULT_SERIALIZER.parse(existingValue) as T;
  }
  updateLocalStorage(key, initial);

  const internalStore = writable<T>(initial, storeStartStopNotifier);

  return {
    subscribe: internalStore.subscribe,
    set: (value: T) => {
      internalStore.set(value);
      updateLocalStorage(key, value);
    },
    update: (callback: Updater<T>) => {
      return internalStore.update((last) => {
        const value = callback(last);
        updateLocalStorage(key, value);
        return value;
      });
    },
  };
}

export default useLocalStorage;
