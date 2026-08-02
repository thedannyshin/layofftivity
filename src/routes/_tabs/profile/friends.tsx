import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Avatar, Card, Chip, ListGroup, Screen, ScreenHero, SectionTitle, tapRow } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_tabs/profile/friends")({
  head: () => ({
    meta: [
      { title: "People — Layofftivity" },
      {
        name: "description",
        content: "The people in your volunteer group, your guests, and how many days you've shared.",
      },
      { property: "og:title", content: "People you volunteer beside" },
      { property: "og:description", content: "Your matches, your guests, your shared days." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Friends,
});

function Friends() {
  const { matches, guests } = useApp();

  return (
    <Screen>
      <ScreenHero title="People" back />

      <SectionTitle>Matches</SectionTitle>
      <ListGroup>
        {matches.map((m) => {
          return (
            <Link
              key={m.id}
              to="/messages/$personId"
              params={{ personId: m.id }}
              className={tapRow}
            >
              <Avatar src={m.photo} name={m.name} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{m.name}</p>
                <p className="truncate text-[13px] text-muted-foreground">
                  {m.formerRole}
                </p>
              </div>
              <MessageCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </ListGroup>

      <SectionTitle>Guests</SectionTitle>
      {guests.length ? (
        <ListGroup>
          {guests.map((g) => (
            <div key={g.id} className="flex items-center gap-3 px-4 py-3.5">
              <Avatar name={g.name} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{g.name}</p>
                <p className="truncate text-[13px] text-muted-foreground">
                  {g.relation}
                </p>
              </div>
              <Chip>Guest</Chip>
            </div>
          ))}
        </ListGroup>
      ) : (
        <Card>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            No guests yet.
          </p>
          <Button asChild className="mt-4 w-full">
            <Link to="/invite">Invite a friend</Link>
          </Button>
        </Card>
      )}
    </Screen>
  );
}
