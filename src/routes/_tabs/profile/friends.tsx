import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Avatar, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { cohort, people } from "@/lib/data";

export const Route = createFileRoute("/_tabs/profile/friends")({
  head: () => ({
    meta: [
      { title: "Friends — Layofftivity" },
      {
        name: "description",
        content: "The people you've volunteered beside, and how many days you've shared with each.",
      },
      { property: "og:title", content: "People you've volunteered beside" },
      { property: "og:description", content: "Belonging, counted in shared mornings." },
    ],
  }),
  component: Friends,
});

const daysTogether: Record<string, number> = {
  maya: 4,
  daniel: 4,
  priya: 3,
  james: 3,
  sofia: 4,
  tomas: 2,
  nina: 1,
};

function Friends() {
  const friends = people.filter((p) => p.id in daysTogether);

  return (
    <Screen>
      <TopBar title="Friends" subtitle={`${friends.length} people you've shown up with`} back />

      <SectionTitle>Your cohort</SectionTitle>
      <div className="space-y-3">
        {friends
          .filter((f) => cohort.memberIds.includes(f.id))
          .map((f) => (
            <FriendRow key={f.id} id={f.id} days={daysTogether[f.id]} />
          ))}
      </div>

      <SectionTitle>From other shifts</SectionTitle>
      <div className="space-y-3">
        {friends
          .filter((f) => !cohort.memberIds.includes(f.id))
          .map((f) => (
            <FriendRow key={f.id} id={f.id} days={daysTogether[f.id]} />
          ))}
      </div>

      <Button asChild variant="quiet" size="lg" className="mt-6 w-full">
        <Link to="/match">Meet someone new this week</Link>
      </Button>
    </Screen>
  );
}

function FriendRow({ id, days }: { id: string; days: number }) {
  const p = people.find((x) => x.id === id)!;
  return (
    <Link
      to="/chat/$personId"
      params={{ personId: id }}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 active:bg-secondary"
    >
      <Avatar src={p.photo} name={p.name} size={48} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold">{p.name}</p>
        <p className="truncate text-[13px] text-muted-foreground">{p.city}</p>
        <div className="mt-1.5">
          <Chip tone="green">
            {days} {days === 1 ? "day" : "days"} together
          </Chip>
        </div>
      </div>
      <MessageCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}