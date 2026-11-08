"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { STORAGE_KEY, initialState, sanitize, type AppState } from "./state";

interface Store {
  state: AppState;
  ready: boolean;
  storageOk: boolean;
  update: (fn: (s: AppState) => AppState) => void;
  toggleCheck: (id: string) => void;
  replace: (s: AppState) => void;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);
  const [storageOk, setStorageOk] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? sanitize(JSON.parse(raw)) : null;
      if (parsed) setState(parsed);
    } catch {
      setStorageOk(false);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      setStorageOk(false);
    }
  }, [state, ready]);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((s) => ({ ...fn(s), updatedAt: new Date().toISOString() }));
  }, []);

  const toggleCheck = useCallback(
    (id: string) =>
      update((s) => {
        const checks = { ...s.checks };
        if (checks[id]) delete checks[id];
        else checks[id] = true;
        // Checking the first item of a task nudges it to "In progress".
        const task = id.slice(0, 2) as "t1" | "t2" | "t3";
        const taskStatus = { ...s.taskStatus };
        if (checks[id] && task in taskStatus && taskStatus[task] === "not_started") taskStatus[task] = "in_progress";
        return { ...s, checks, taskStatus };
      }),
    [update],
  );

  const replace = useCallback((s: AppState) => setState(s), []);
  const reset = useCallback(() => setState(initialState()), []);

  const value = useMemo(
    () => ({ state, ready, storageOk, update, toggleCheck, replace, reset }),
    [state, ready, storageOk, update, toggleCheck, replace, reset],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside StoreProvider");
  return v;
}
