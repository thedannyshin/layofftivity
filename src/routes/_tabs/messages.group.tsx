import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { CalendarDays, ChevronRight, MapPin, Send } from "lucide-react";
import { Avatar, Screen, ScreenHero, tapPill } from "@/components/app/Shell";
import { byId, icebreakers, orgById } from "@/lib/data";
import { sendMessage, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const icebreakerLabels: Record<string, string> = {
  "What's one thing you're doing with your week now that you couldn't before?": "Your week",
  "What did you think you'd miss about work, but don't?": "Work surprises",
  "What's the smallest good thing that happened to you this week?": "Small wins",
  "If Saturday mornings were yours forever, how would you spend them?": "Saturday mornings",
};

export const Route = createFileRoute("/_tabs/messages/group")({
  head: () => ({
    meta: [
      { title: "Crew messages — Layofftivity" },
      {
        name: "description",
        content:
          "Your volunteer crew messages: rides, timing, icebreakers, and the small talk that makes Saturday easier.",
      },
      { property: "og:title", content: "Your volunteer crew messages" },
      { property: "og:description", content: "Rides, timing, and the small talk in between." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GroupMessages,
});

function GroupMessages() {
  const { update, thread, matches, guests, profile, initials, fullName, primaryEvent, isJoined } =
    useApp();
  const messages = thread("group");
  const org = orgById(primaryEvent.orgId);
  const joined = isJoined(primaryEvent.id);
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
        <ScreenHero
          title="Crew messages"
          subtitle={`${matches.length + 1 + guests.length} people`}
          back
          right={
            <Link to="/invite" className={tapPill}>
              Add person
            </Link>
          }
        />

        <Link
          to={joined ? "/volunteer-day" : "/events/$eventId"}
          params={joined ? undefined : { eventId: primaryEvent.id }}
          className="mt-3 block rounded-2xl bg-primary p-5 transition-colors hover:bg-primary/95 active:bg-primary/90"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-primary-foreground/50 px-2.5 py-1 text-[12px] font-bold text-primary-foreground">
              {joined ? "You're going" : "See the details"}
            </span>
            <span className="text-[13px] font-semibold text-primary-foreground/80">{org.name}</span>
          </div>

          <h3 className="mt-3 text-[20px] leading-tight font-extrabold text-primary-foreground">
            {primaryEvent.title}
          </h3>
          <div className="mt-3 space-y-1 text-[14px] text-primary-foreground/90">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {primaryEvent.dateShort}, {primaryEvent.time}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{primaryEvent.location}</span>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between pt-4">
            <div className="flex -space-x-2">
              {matches.slice(0, 4).map((m) => (
                <Avatar key={m.id} src={m.photo} name={m.name} size={30} />
              ))}
              {guests.slice(0, 2).map((g) => (
                <Avatar key={g.id} name={g.name} size={30} />
              ))}
            </div>
            <span className="flex items-center gap-1 text-[14px] font-bold text-primary-foreground">
              {joined ? "Open the day" : "See the details"} <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        <div className="mt-4 space-y-3">
          {messages.length === 0 && (
            <div>
              <p className="text-[14px] font-semibold text-muted-foreground">Icebreaker</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {icebreakers.slice(0, 4).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setValue(q)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-muted-foreground/35 bg-transparent px-3.5 py-2 text-[13px] font-semibold text-foreground cursor-pointer transition-colors duration-[120ms] hover:bg-card active:bg-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft"
                  >
                    {icebreakerLabels[q] ?? q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => {
            const mine = m.personId === "you";
            const person = mine ? null : byId(m.personId);
            return (
              <div key={i} className={cn("flex gap-2", mine && "justify-end")}>
                {person && <Avatar src={person.photo} name={person.name} size={30} />}
                <div className="max-w-[76%] text-left">
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
                {mine && <Avatar src={profile.photo} name={fullName} initials={initials} size={30} />}
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
      </Screen>

      <div className="fixed inset-x-0 bottom-16 z-20 bg-card">
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
            placeholder="Message the crew"
            aria-label="Message the crew"
            className="h-12 flex-1 rounded-xl bg-card px-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/30"
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
