import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, MessageCircle, Quote, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Card, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { orgById, sharedWith } from "@/lib/data";
import { sendMessage, useApp } from "@/lib/store";

export const Route = createFileRoute("/_tabs/match")({
  head: () => ({
    meta: [
      { title: "You've been matched — Layofftivity" },
      {
        name: "description",
        content:
          "Meet the small volunteer group matched to your causes, interests, and availability, and join your first activity together.",
      },
      { property: "og:title", content: "Meet your volunteer group" },
      {
        property: "og:description",
        content: "Arriving to a familiar face is easier than arriving to a room.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Match,
});

function Match() {
  const { state, update, matches, prefs, primaryEvent, guests, isJoined } = useApp();
  const navigate = useNavigate();
  const org = orgById(primaryEvent.orgId);
  const joined = isJoined(primaryEvent.id);

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
      <TopBar title="You've been matched" subtitle="Meet your volunteer group" />

      <Card variant="accent">
        <p className="text-[15px] leading-relaxed text-accent-foreground">
          {matches.length === 1 ? "One person" : `${matches.length} people`} near{" "}
          {state.onboarding.location || "you"} chose the same causes and the same time slot. Say
          hello, then join your first activity together.
        </p>
      </Card>

      <SectionTitle>Your matches</SectionTitle>
      <div className="space-y-4">
        {matches.map((m) => {
          const shared = sharedWith(m, prefs);
          const greeted = state.matchGreeted.includes(m.id);
          return (
            <Card key={m.id}>
              <div className="flex items-center gap-3">
                <Avatar src={m.photo} name={m.name} size={64} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[17px] font-extrabold">{m.name}</p>
                  <p className="truncate text-[13px] text-muted-foreground">{m.formerRole}</p>
                  <p className="truncate text-[13px] text-muted-foreground">{m.city}</p>
                </div>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed">{m.bio}</p>

              <p className="mt-4 text-[12px] font-bold text-muted-foreground uppercase">
                What you share
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(shared.length ? shared : m.causes).map((s) => (
                  <Chip key={s} tone="green">
                    <Check className="h-3 w-3" />
                    {s}
                  </Chip>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                {greeted ? (
                  <Button asChild className="flex-1">
                    <Link to="/chat/$personId" params={{ personId: m.id }}>
                      <MessageCircle />
                      Continue chat
                    </Link>
                  </Button>
                ) : (
                  <Button className="flex-1" onClick={() => greet(m.id, m.name)}>
                    <MessageCircle />
                    Say hello
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <SectionTitle>Your first activity together</SectionTitle>
      <Link
        to="/events/$eventId"
        params={{ eventId: primaryEvent.id }}
        className="block rounded-2xl bg-card p-4 transition-colors active:bg-secondary"
      >
        <p className="text-[13px] font-bold text-primary">{org.name}</p>
        <p className="mt-1 text-[17px] font-extrabold">{primaryEvent.title}</p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {primaryEvent.date} · {primaryEvent.time}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip tone="green">{org.cause}</Chip>
          {joined ? <Chip tone="yellow">You're going</Chip> : <Chip>Tap to see details</Chip>}
        </div>
      </Link>

      <SectionTitle>Bring one friend</SectionTitle>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        Everyone in the group can invite one friend as a guest. No account needed — they just RSVP.
      </p>
      <div className="mt-3 space-y-3">
        <Button asChild variant="soft" size="lg" className="w-full">
          <Link to="/invite">
            <UserPlus />
            {state.invites.length ? "Manage your invitation" : "Invite a friend"}
          </Link>
        </Button>
        <Button asChild variant="quiet" size="lg" className="w-full">
          <Link to="/cohort">Open your group</Link>
        </Button>
      </div>

      {guests.length > 0 && (
        <p className="mt-4 text-center text-[13px] text-muted-foreground">
          {guests.map((g) => g.name).join(", ")} accepted and will join you as{" "}
          {guests.length === 1 ? "a guest" : "guests"}.
        </p>
      )}

      <div className="mt-6 flex gap-3 rounded-2xl bg-card p-4">
        <Quote className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-[15px] leading-relaxed">
          Matches are based on causes, interests, and when you can show up — nothing else. We'd
          rather you know a few people well than scroll past hundreds.
        </p>
      </div>
    </Screen>
  );
}
