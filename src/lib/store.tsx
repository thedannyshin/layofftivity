import * as React from "react";
import { badges, byId, eventById, matchEvent, matchPeople, type Prefs } from "./data";

export type Reflection = {
  id: string;
  eventId: string;
  date: string;
  mood: string;
  gratitude: string;
  note: string;
  photos: number;
};

export type Message = { personId: string; text: string; time: string };

export type InviteStatus = "sent" | "opened" | "accepted" | "declined";

export type Invite = {
  id: string;
  name: string;
  relation: string;
  channel: "text" | "email" | "link";
  contact: string;
  eventId: string;
  hostId: string;
  status: InviteStatus;
};

export type CompletedDay = { id: string; eventId: string; date: string; hours: number };

export type Profile = { firstName: string; lastName: string; photo: string | null };

export type Onboarding = {
  complete: boolean;
  reasons: string[];
  laidOff: string;
  interests: string[];
  causes: string[];
  availability: string[];
  location: string;
};

export type State = {
  profile: Profile;
  onboarding: Onboarding;
  matchIds: string[];
  matchGreeted: string[];
  joinedEventIds: string[];
  checkedInEventIds: string[];
  completed: CompletedDay[];
  reflections: Reflection[];
  invites: Invite[];
  rideClaimed: string | null;
  threads: Record<string, Message[]>;
  continueChoice: string | null;
};

const initialState: State = {
  profile: { firstName: "", lastName: "", photo: null },
  onboarding: {
    complete: false,
    reasons: [],
    laidOff: "",
    interests: [],
    causes: [],
    availability: [],
    location: "",
  },
  matchIds: [],
  matchGreeted: [],
  joinedEventIds: [],
  checkedInEventIds: [],
  completed: [],
  reflections: [],
  invites: [],
  rideClaimed: null,
  threads: {},
  continueChoice: null,
};

type Ctx = {
  state: State;
  hydrated: boolean;
  update: (fn: (s: State) => State) => void;
  reset: () => void;
};

const StoreContext = React.createContext<Ctx | null>(null);
const KEY = "layofftivity-state-v2";

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

/* ---------- derived, shared by every screen ---------- */

export function initialsOf(profile: Profile) {
  const a = profile.firstName.trim()[0] ?? "";
  const b = profile.lastName.trim()[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

export function useApp() {
  const { state, hydrated, update, reset } = useStore();

  return React.useMemo(() => {
    const prefs: Prefs = {
      interests: state.onboarding.interests,
      causes: state.onboarding.causes,
      availability: state.onboarding.availability,
    };
    const fullName = `${state.profile.firstName} ${state.profile.lastName}`.trim();
    const matches = (state.matchIds.length ? state.matchIds : matchPeople(prefs).map((p) => p.id)).map(
      byId,
    );
    const primaryEvent = state.joinedEventIds.length
      ? eventById(state.joinedEventIds[0])
      : matchEvent(prefs);
    const guests = state.invites.filter((i) => i.status === "accepted");
    const hours = state.completed.reduce((n, c) => n + c.hours, 0);
    const sentMessages = Object.values(state.threads)
      .flat()
      .filter((m) => m.personId === "you").length;

    const earned: Record<string, boolean> = {
      first: state.completed.length >= 1,
      three: state.completed.length >= 3,
      connector: sentMessages > 0,
      journal: state.reflections.length >= 5,
      inviter: guests.length > 0,
      ten: state.completed.length >= 10,
    };

    return {
      state,
      hydrated,
      update,
      reset,
      prefs,
      profile: state.profile,
      fullName: fullName || "Your profile",
      initials: initialsOf(state.profile),
      matches,
      guests,
      primaryEvent,
      week: state.completed.length + 1,
      hours,
      daysCompleted: state.completed.length,
      badges: badges.map((b) => ({ ...b, earned: !!earned[b.id] })),
      isJoined: (id: string) => state.joinedEventIds.includes(id),
      isCheckedIn: (id: string) => state.checkedInEventIds.includes(id),
      thread: (key: string) => state.threads[key] ?? [],
    };
  }, [state, hydrated, update, reset]);
}

export function sendMessage(
  update: Ctx["update"],
  threadKey: string,
  message: Message,
) {
  update((s) => ({
    ...s,
    threads: { ...s.threads, [threadKey]: [...(s.threads[threadKey] ?? []), message] },
  }));
}
