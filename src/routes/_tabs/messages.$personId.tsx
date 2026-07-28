import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Send } from "lucide-react";
import { Avatar, Screen, ScreenHero, tapPill } from "@/components/app/Shell";
import { byId, sharedWith } from "@/lib/data";
import { sendMessage, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/messages/$personId")({
  head: ({ params }) => {
    const person = byId(params.personId);
    return {
      meta: [
        { title: `Messages with ${person.name} — Layofftivity` },
        {
          name: "description",
          content: `Message ${person.name} before your volunteer day and figure out rides, timing, and who's bringing coffee.`,
        },
        { property: "og:title", content: `Messages with ${person.name}` },
        { property: "og:description", content: person.bio },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: DirectMessages,
});

function DirectMessages() {
  const { personId } = Route.useParams();
  const person = byId(personId);
  const { update, thread, prefs, profile, initials, fullName } = useApp();
  const messages = thread(personId);
  const [value, setValue] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = () => {
    const text = value.trim();
    if (!text) return;
    sendMessage(update, personId, { personId: "you", text, time: "Just now" });
    setValue("");
  };

  const shared = sharedWith(person, prefs);
  const suggestions = [
    `What pulled you toward ${(person.causes[0] ?? "volunteering").toLowerCase()}?`,
    "Are you driving or taking transit?",
    "Want to meet fifteen minutes early?",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background pb-32">
      <Screen>
        <ScreenHero
          title={person.name}
          subtitle={person.formerRole}
          back
          right={<Avatar src={person.photo} name={person.name} size={40} />}
        />

        <div className="rounded-2xl bg-primary-soft p-4 text-[13px] leading-relaxed">
          You were matched because you both chose{" "}
          <span className="font-bold">{(shared.length ? shared : person.causes).join(", ")}</span>.
        </div>

        <div className="mt-4 space-y-3">
          {messages.map((m, i) => {
            const mine = m.personId === "you";
            return (
              <div key={i} className={cn("flex gap-2", mine && "justify-end")}>
                {!mine && <Avatar src={person.photo} name={person.name} size={30} />}
                <div className="max-w-[76%] text-left">
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
          {messages.length === 0 && (
            <p className="py-6 text-center text-[14px] text-muted-foreground">
              No messages yet. One line is enough to start.
            </p>
          )}
          <div ref={endRef} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => setValue(s)} className={tapPill}>
              {s}
            </button>
          ))}
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
            placeholder={`Message ${person.name.split(" ")[0]}`}
            aria-label="Message"
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
