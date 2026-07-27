import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { ChevronLeft, Send } from "lucide-react";
import { Avatar } from "@/components/app/Shell";
import { byId } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$personId")({
  head: ({ params }) => ({
    meta: [
      { title: `Chat with ${byId(params.personId).name} — Layofftivity` },
      {
        name: "description",
        content: "A one-to-one conversation with someone from your volunteer cohort.",
      },
      { property: "og:title", content: "Cohort conversation" },
      { property: "og:description", content: "Talk one-to-one before your next volunteer day." },
    ],
  }),
  component: Chat,
});

function Chat() {
  const { personId } = Route.useParams();
  const person = byId(personId);
  const { state, update } = useStore();
  const [draft, setDraft] = React.useState("");
  const messages = state.dmMessages.filter(
    (m) => m.personId === person.id || m.personId === "you",
  );

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    update((s) => ({
      ...s,
      matchConnected: true,
      dmMessages: [...s.dmMessages, { personId: "you", text: value, time: "Just now" }],
    }));
    setDraft("");
  };

  const suggestions = [
    "Yes — I'll be there Saturday. Want to meet at the awning?",
    "What pulled you toward food security?",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 bg-card">
        <div className="mx-auto flex w-full max-w-[430px] items-center gap-3 px-3 py-3">
          <Link
            to="/match"
            aria-label="Back to match"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <Avatar src={person.photo} name={person.name} size={38} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold">{person.name}</p>
            <p className="truncate text-[12px] text-muted-foreground">{person.city}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[430px] flex-1 space-y-3 px-5 py-5 pb-44">
        <p className="rounded-xl bg-secondary px-4 py-3 text-center text-[13px] text-muted-foreground">
          You were matched because you both chose food security and Saturday mornings.
        </p>
        {messages.map((m, i) => {
          const mine = m.personId === "you";
          return (
            <div key={i} className={cn("flex gap-2", mine ? "justify-end" : "justify-start")}>
              {!mine && <Avatar src={byId(m.personId).photo} name={m.personId} size={30} />}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5",
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
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-card">
        <div className="mx-auto w-full max-w-[430px] px-4 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {suggestions.map((s) => (
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
              placeholder={`Message ${person.name.split(" ")[0]}`}
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