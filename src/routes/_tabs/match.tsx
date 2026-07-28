import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Avatar, ListGroup, Screen, ScreenHero, tapRow } from "@/components/app/Shell";
import { sendMessage, useApp } from "@/lib/store";

export const Route = createFileRoute("/_tabs/match")({
  head: () => ({
    meta: [
      { title: "Messages — Layofftivity" },
      {
        name: "description",
        content: "Chat 1:1 with matched people or in your crew chat, before your next volunteer day.",
      },
      { property: "og:title", content: "Messages — Layofftivity" },
      { property: "og:description", content: "Chat 1:1 and in your matched group." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Match,
});

function Match() {
  const { state, update, matches, thread } = useApp();
  const navigate = useNavigate();
  const groupMessages = thread("group");
  const groupLast = groupMessages[groupMessages.length - 1];

  const greet = (personId: string, name: string) => {
    update((s) => ({
      ...s,
      matchGreeted: [...new Set([...s.matchGreeted, personId])],
    }));
    sendMessage(update, personId, {
      personId: "you",
      text: "Hi! We got matched — are you going to the next volunteer day?",
      time: "Just now",
    });
    toast.success(`${name.split(" ")[0]} knows you said hello`);
    navigate({ to: "/chat/$personId", params: { personId } });
  };

  return (
    <Screen>
      <ScreenHero
        title="Messages"
        subtitle="Chat 1:1 or in your group"
        right={
          <Link
            to="/invite"
            className="rounded-lg bg-secondary px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-primary-soft active:bg-primary-soft"
          >
            Add person
          </Link>
        }
      />

      <ListGroup>
        <Link to="/cohort-chat" className={tapRow}>
          <Avatar name="Group" size={52} />
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-[15px] font-extrabold">Crew chat</p>
            <p className="mt-0.5 line-clamp-1 text-[13px] text-muted-foreground">
              {groupLast ? groupLast.text : "Start with an icebreaker below."}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>

        {matches.map((m) => {
          const greeted = state.matchGreeted.includes(m.id);
          const messages = thread(m.id);
          const last = messages[messages.length - 1];
          const preview = last
            ? last.text
            : greeted
              ? "Say hello to continue."
              : "Say hello to start.";
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                if (greeted) {
                  navigate({ to: "/chat/$personId", params: { personId: m.id } });
                  return;
                }
                greet(m.id, m.name);
              }}
              className={`${tapRow} cursor-default`}
            >
              <Avatar src={m.photo} name={m.name} size={52} />
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-[15px] font-extrabold">{m.name}</p>
                <p className="mt-0.5 line-clamp-1 text-[13px] text-muted-foreground">{preview}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </button>
          );
        })}
      </ListGroup>
    </Screen>
  );
}
