import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Send } from "lucide-react";
import { Avatar, Screen, TopBar } from "@/components/app/Shell";
import { byId, icebreakers, orgById } from "@/lib/data";
import { sendMessage, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/cohort-chat")({
  head: () => ({
    meta: [
      { title: "Group chat — Layofftivity" },
      {
        name: "description",
        content:
          "Your volunteer group chat: rides, timing, icebreakers, and the small talk that makes Saturday easier.",
      },
      { property: "og:title", content: "Your volunteer group chat" },
      { property: "og:description", content: "Rides, timing, and the small talk in between." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GroupChat,
});

function GroupChat() {
  const { update, thread, matches, guests, primaryEvent, profile, initials, fullName } = useApp();
  const org = orgById(primaryEvent.orgId);
  const messages = thread("group");
  const [value, setValue] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = () => {
    const text = value.trim();
    if (!text) return;
    sendMessage(update, "group", { personId: "you", text, time: "Just now" });
    setValue("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-32">
      <Screen>
        <TopBar
          title={`${org.cause} group`}
          subtitle={`${matches.length + 1 + guests.length} people`}
          back
        />

        <div className="flex justify-center gap-2">
          {matches.map((m) => (
            <Avatar key={m.id} src={m.photo} name={m.name} size={36} />
          ))}
          {guests.map((g) => (
            <Avatar key={g.id} name={g.name} size={36} />
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {messages.map((m, i) => {
            const mine = m.personId === "you";
            const person = mine ? null : byId(m.personId);
            return (
              <div key={i} className={cn("flex gap-2", mine && "justify-end")}>
                {person && <Avatar src={person.photo} name={person.name} size={30} />}
                <div className={cn("max-w-[76%]", mine && "text-right")}>
                  {person && (
                    <p className="mb-0.5 text-[12px] font-bold text-muted-foreground">
                      {person.name.split(" ")[0]}
                    </p>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
                      mine ? "bg-primary text-primary-foreground" : "bg-card",
                    )}
                  >
                    {m.text}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{m.time}</p>
                </div>
                {mine && (
                  <Avatar src={profile.photo} name={fullName} initials={initials} size={30} />
                )}
              </div>
            );
          })}
          {messages.length === 0 && (
            <p className="py-6 text-center text-[14px] text-muted-foreground">
              Nobody has spoken yet. Start with an icebreaker below.
            </p>
          )}
          <div ref={endRef} />
        </div>

      </Screen>

      <div className="fixed inset-x-0 bottom-16 z-20 bg-card">
        <div className="no-scrollbar mx-auto flex w-full max-w-[430px] gap-2 overflow-x-auto px-5 pt-3">
          {icebreakers.slice(0, 4).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setValue(q)}
              className="shrink-0 rounded-lg bg-secondary px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-primary-soft active:bg-primary-soft"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mx-auto flex w-full max-w-[430px] items-center gap-2 px-5 py-3"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Message the group"
            aria-label="Message the group"
            className="h-12 flex-1 rounded-xl bg-secondary px-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!value.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-100 disabled:bg-muted disabled:text-[var(--lo-green-faint)]"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
