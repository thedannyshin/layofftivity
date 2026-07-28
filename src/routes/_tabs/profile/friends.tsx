import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Avatar, Card, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { sharedWith } from "@/lib/data";
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
  const { matches, guests, prefs, daysCompleted, thread } = useApp();

  return (
    <Screen>
      <TopBar
        title="People"
        subtitle={`${matches.length + guests.length} in your group`}
        back
      />

      <SectionTitle>Your matches</SectionTitle>
      <div className="space-y-3">
        {matches.map((m) => {
          const messages = thread(m.id).length;
          return (
            <Link
              key={m.id}
              to="/chat/$personId"
              params={{ personId: m.id }}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 transition-colors active:bg-secondary"
            >
              <Avatar src={m.photo} name={m.name} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{m.name}</p>
                <p className="truncate text-[13px] text-muted-foreground">
                  {daysCompleted} day{daysCompleted === 1 ? "" : "s"} together ·{" "}
                  {messages ? `${messages} messages` : "no messages yet"}
                </p>
                <p className="mt-1.5 truncate text-[12px] text-muted-foreground">
                  {(sharedWith(m, prefs).length ? sharedWith(m, prefs) : m.interests)
                    .slice(0, 3)
                    .join(" · ")}
                </p>
              </div>
              <MessageCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </div>

      <SectionTitle>Guests</SectionTitle>
      {guests.length ? (
        <div className="space-y-3">
          {guests.map((g) => (
            <div key={g.id} className="flex items-center gap-3 rounded-2xl bg-card p-4">
              <Avatar name={g.name} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{g.name}</p>
                <p className="truncate text-[13px] text-muted-foreground">
                  Invited by you · {g.relation}
                </p>
              </div>
              <Chip tone="yellow">Guest</Chip>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            No guests yet. You can bring one friend to any activity — they RSVP with a link.
          </p>
          <Button asChild className="mt-4 w-full">
            <Link to="/invite">Invite a friend</Link>
          </Button>
        </Card>
      )}
    </Screen>
  );
}
