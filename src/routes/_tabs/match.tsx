import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, MessageCircle, Quote } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Card, Chip, Clamp, Meta, Screen, SectionTitle, TopBar, staticCard, tapCard } from "@/components/app/Shell";
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
                  <Meta items={[m.formerRole, m.city]} />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(shared.length ? shared : m.causes).slice(0, 3).map((s) => (
                      <Chip key={s} tone="green">
                        <Check className="h-3 w-3" />
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Clamp lines={2}>{m.bio}</Clamp>
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
        className={`${tapCard} block`}
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

      <div className={`${staticCard} mt-8 flex gap-3`}>
        <Quote className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          Matched on causes, interests, and availability — nothing else.
        </p>
      </div>
    </Screen>
  );
}
