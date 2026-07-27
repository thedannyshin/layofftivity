import * as React from "react";
import { seedCohortChat, seedReflections } from "./data";

export type Reflection = {
  id: string;
  date: string;
  mood: string;
  gratitude: string;
  note: string;
  photos: number;
};

export type Message = { personId: string; text: string; time: string };

type Onboarding = {
  complete: boolean;
  reason: string;
  laidOff: string;
  interests: string[];
  causes: string[];
  availability: string[];
  location: string;
};

type State = {
  onboarding: Onboarding;
  joinedEventIds: string[];
  checkedIn: boolean;
  rideClaimed: string | null;
  matchConnected: boolean;
  invitesSent: string[];
  reflections: Reflection[];
  cohortMessages: Message[];
  dmMessages: Message[];
  continueChoice: string | null;
  goalDone: string[];
};

const initialState: State = {
  onboarding: {
    complete: false,
    reason: "",
    laidOff: "",
    interests: [],
    causes: [],
    availability: [],
    location: "",
  },
  joinedEventIds: ["harvest-sat"],
  checkedIn: false,
  rideClaimed: null,
  matchConnected: false,
  invitesSent: [],
  reflections: seedReflections,
  cohortMessages: seedCohortChat,
  dmMessages: [
    {
      personId: "maya",
      text: "Hi Alex! Saw we both put food security first. Are you going Saturday?",
      time: "Yesterday 6:14 PM",
    },
  ],
  continueChoice: null,
  goalDone: ["shift"],
};

type Ctx = {
  state: State;
  hydrated: boolean;
  update: (fn: (s: State) => State) => void;
  reset: () => void;
};

const StoreContext = React.createContext<Ctx | null>(null);
const KEY = "layofftivity-state-v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(initialState);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const update = React.useCallback((fn: (s: State) => State) => {
    setState((prev) => {
      const next = fn(prev);
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const reset = React.useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setState(initialState);
  }, []);

  const value = React.useMemo(
    () => ({ state, hydrated, update, reset }),
    [state, hydrated, update, reset],
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}