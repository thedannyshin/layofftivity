import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { ChevronLeft, Send } from "lucide-react";
import { Avatar } from "@/components/app/Shell";
import { byId, cohort, cohortMembers, you } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/cohort-chat")({
  head: () => ({
    meta: [
      { title: "Saturday Crew group chat — Layofftivity" },
      {
        name: "description",
        content: "Coordinate rides, timing, and Saturday plans with your six-person volunteer cohort.",
      },
      { property: "og:title", content: "Saturday Crew group chat" },
      { property: "og:description", content: "Rides, timing, and small talk with your cohort." },
    ],
  }),
  component: CohortChat,
});

function CohortChat() {
  const { state, update } = useStore();
  const [draft, setDraft] = React.useState("");
  const members = cohortMembers();

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    update((s) => ({
      ...s,
      cohortMessages: [...s.cohortMessages, { personId: "you", text: value, time: "Just now" }],
      goalDone: s.goalDone.includes("message") ? s.goalDone : [...s.goalDone, "message"],
    }));
    setDraft("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 bg-card">
        <div className="mx-auto flex w-full max-w-[430px] items-center gap-3 px-3 py-3">
          <Link
            to="/cohort"
            aria-label="Back to cohort"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex -space-x-2">
            {members.slice(0, 3).map((m) => (
              <Avatar key={m.id} src={m.photo} name={m.name} size={30} />
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold">{cohort.name}</p>
            <p className="truncate text-[12px] text-muted-foreground">{members.length} members</p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[430px] flex-1 space-y-3 px-5 py-5 pb-44">
        {state.cohortMessages.map((m, i) => {
          const mine = m.personId === "you";
          const person = mine ? you : byId(m.personId);
          return (
            <div key={i} className={cn("flex gap-2", mine ? "justify-end" : "justify-start")}>
              {!mine && <Avatar src={person.photo} name={person.name} size={30} />}
              <div className="max-w-[76%]">
                {!mine && (
                  <p className="mb-1 ml-1 text-[12px] font-semibold text-muted-foreground">
                    {person.name.split(" ")[0]}
                  </p>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5",
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground",
                  )}
                >
                  <p className="text-[15px] leading-relaxed">{m.text}</p>
                  <p
                    className={cn(
                      "mt-1 text-[11px]",
                      mine ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-card">
        <div className="mx-auto w-full max-w-[430px] px-4 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {["I'm in for Saturday", "Can I grab the last seat?", "Bringing extra gloves"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="shrink-0 rounded-full bg-secondary px-3.5 py-2 text-[13px] font-semibold"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message the crew"
              className="h-12 flex-1 rounded-xl bg-secondary px-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!draft.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}