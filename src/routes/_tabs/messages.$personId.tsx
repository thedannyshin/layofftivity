import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Send } from "lucide-react";
import { Avatar, Screen, ScreenHero } from "@/components/app/Shell";
import { TypingBubble } from "@/components/app/TypingBubble";
import { useChatReply } from "@/hooks/useChatReply";
import { useScrollToLatest } from "@/hooks/useScrollToLatest";
import { byId } from "@/lib/data";
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
  const { update, thread, profile, initials, fullName, primaryEvent } = useApp();
  const messages = thread(personId);
  const [value, setValue] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);
  const { typingPerson } = useChatReply({
    threadKey: personId,
    messages,
    candidates: [person],
    userFirstName: profile.firstName,
    eventTitle: primaryEvent.title,
    eventWhen: `${primaryEvent.dateShort}, ${primaryEvent.time}`,
  });

  const suggestions = [
    `What pulled you toward ${(person.causes[0] ?? "volunteering").toLowerCase()}?`,
    "Are you driving or taking transit?",
    "Want to meet fifteen minutes early?",
  ].filter((s) => !messages.some((m) => m.text === s));

  useScrollToLatest(endRef, [messages.length, typingPerson?.id, suggestions.length]);

  const send = () => {
    const text = value.trim();
    if (!text) return;
    sendMessage(update, personId, { personId: "you", text, time: "Just now" });
    setValue("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-40">
      <Screen>
        <ScreenHero
          title={person.name}
          back
        />

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
          {typingPerson && <TypingBubble person={typingPerson} />}
        </div>
        <div ref={endRef} className="h-px w-full" aria-hidden />
      </Screen>

      <div
        className="ios-chrome ios-hairline-t fixed inset-x-0 z-20"
        style={{
          bottom: "max(calc(49px + env(safe-area-inset-bottom)), var(--ios-keyboard-inset, 0px))",
        }}
      >
        <div className="mx-auto w-full max-w-[430px]">
          {suggestions.length > 0 && (
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setValue(s)}
                  className="inline-flex shrink-0 items-center rounded-full border border-muted-foreground/35 bg-card px-3.5 py-2 text-[13px] font-semibold text-foreground transition-colors active:bg-background"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 px-5 py-3"
          >
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Message ${person.name.split(" ")[0]}`}
              aria-label="Message"
              className="h-12 flex-1 rounded-xl bg-card px-4 text-[16px] outline-none focus:ring-2 focus:ring-primary/30"
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
    </div>
  );
}
