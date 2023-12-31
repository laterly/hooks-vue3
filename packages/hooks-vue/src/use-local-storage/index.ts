import { ref,unref } from 'vue';
import type { Ref, UnwrapRef } from 'vue';
import { storage } from './storage';

function getInitState<T>(key: string, value: T) {
  const localStorageValue = storage.local.get<T>(key) || null;
  if (localStorageValue) {
    return localStorageValue;
  }
  storage.local.set<T>(key, value);
  return value;
}

function useLocalStorage<T>(
  key: string,
  value: T,
): [
  Ref<UnwrapRef<T>>,
  {
    set: (value: UnwrapRef<T>) => void;
    del: () => void;
    clear: () => void;
  },
] {
  const state = ref<T>(getInitState<T>(key, value));

  const set = (value: UnwrapRef<T>) => {
    state.value = unref(value);
    storage.local.set<UnwrapRef<T>>(key, value);
  };
  const del = () => {
    state.value = undefined as UnwrapRef<T>;
    storage.local.del(key);
  };

  const clear = () => {
    state.value = undefined as UnwrapRef<T>;
    storage.local.clear();
  };

  return [
    state,
    {
      set,
      del,
      clear,
    },
  ];
}
export default useLocalStorage;
