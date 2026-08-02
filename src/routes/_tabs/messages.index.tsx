import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Avatar, ListGroup, Screen, ScreenHero, tapPill, tapRow } from "@/components/app/Shell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_tabs/messages/")({
  head: () => ({
    meta: [
      { title: "Messages — Layofftivity" },
      {
        name: "description",
        content: "Message 1:1 with matched people or in your crew messages, before your next volunteer day.",
      },
      { property: "og:title", content: "Messages — Layofftivity" },
      { property: "og:description", content: "Message 1:1 and in your matched group." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MessagesHome,
});

function MessagesHome() {
  const navigate = useNavigate();
  const { matches, thread } = useApp();
  const groupMessages = thread("group");
  const groupLast = groupMessages[groupMessages.length - 1];
  const groupPeople = matches.slice(0, 3);
  const groupLabel = formatFirstNames(groupPeople.map((person) => person.name));

  return (
    <Screen>
      <ScreenHero
        title="Messages"
        right={
          <Link to="/invite" className={tapPill}>
            Add person
          </Link>
        }
      />

      <ListGroup>
        <button
          type="button"
          onClick={() => navigate({ to: "/messages/group" })}
          className={tapRow}
        >
          <div className="flex shrink-0 -space-x-3">
            {groupPeople.map((person, index) => (
              <Avatar
                key={person.id}
                src={person.photo}
                name={person.name}
                size={36}
                className={index > 0 ? "ring-2 ring-card" : undefined}
              />
            ))}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-[15px] font-extrabold">{groupLabel}</p>
            <p className="mt-0.5 line-clamp-1 text-[13px] text-muted-foreground">
              {groupLast ? groupLast.text : "No messages"}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </button>

        {matches.map((m) => {
          const messages = thread(m.id);
          const last = messages[messages.length - 1];
          const preview = last ? last.text : "No messages";
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => navigate({ to: "/messages/$personId", params: { personId: m.id } })}
              className={tapRow}
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

function formatFirstNames(names: string[]) {
  const firstNames = names
    .map((name) => name.split(" ")[0])
    .filter(Boolean);

  if (firstNames.length <= 1) return firstNames[0] ?? "Your group";
  if (firstNames.length === 2) return `${firstNames[0]} and ${firstNames[1]}`;
  return `${firstNames.slice(0, -1).join(", ")}, and ${firstNames[firstNames.length - 1]}`;
}
