import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, MessageCircle, Quote } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Card, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { byId, conversationStarters, you } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_tabs/match")({
  head: () => ({
    meta: [
      { title: "Meet Maya — Layofftivity Match" },
      {
        name: "description",
        content:
          "Meet one future cohort member before your first volunteer day, with shared interests and conversation starters.",
      },
      { property: "og:title", content: "Meet one cohort member first" },
      {
        property: "og:description",
        content: "Arriving to a familiar face is easier than arriving to a room.",
      },
    ],
  }),
  component: Match,
});

function Match() {
  const maya = byId("maya");
  const { state, update } = useStore();
  const navigate = useNavigate();
  const shared = maya.interests.filter((i) => you.interests.includes(i));

  const connect = () => {
    update((s) => ({ ...s, matchConnected: true }));
    toast.success("Maya knows you said hello", {
      description: "She usually replies within a day.",
    });
    navigate({ to: "/chat/$personId", params: { personId: "maya" } });
  };

  return (
    <Screen>
      <TopBar title="Your match this week" subtitle="One person, not a feed" />

      <Card className="text-center">
        <Avatar src={maya.photo} name={maya.name} size={96} className="mx-auto" />
        <h2 className="mt-3 text-[22px] font-extrabold">{maya.name}</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">{maya.formerRole}</p>
        <p className="text-[14px] text-muted-foreground">{maya.city}</p>
        <p className="mt-3 text-[15px] leading-relaxed">{maya.bio}</p>
      </Card>

      <div className="mt-3 rounded-2xl bg-accent-soft p-4 text-center">
        <p className="text-[28px] leading-none font-extrabold text-accent-foreground">87%</p>
        <p className="mt-1 text-[14px] font-semibold text-accent-foreground">
          Compatibility with your cohort rhythm
        </p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Same cause, same Saturday slot, laid off within a month of each other.
        </p>
      </div>

      <SectionTitle>What you have in common</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {shared.map((s) => (
          <Chip key={s} tone="green">
            <Check className="h-3 w-3" />
            {s}
          </Chip>
        ))}
        <Chip tone="green">
          <Check className="h-3 w-3" />
          Saturday mornings
        </Chip>
        <Chip tone="green">
          <Check className="h-3 w-3" />
          Harvest Table
        </Chip>
      </div>

      <SectionTitle>Conversation starters</SectionTitle>
      <div className="space-y-3">
        {conversationStarters.map((c) => (
          <div key={c} className="flex gap-3 rounded-2xl bg-card p-4">
            <Quote className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-[15px] leading-relaxed">{c}</p>
          </div>
        ))}
      </div>

      <SectionTitle>Also in your rotation</SectionTitle>
      <div className="space-y-3">
        {["tomas", "sofia"].map((id) => {
          const p = byId(id);
          return (
            <Link
              key={id}
              to="/chat/$personId"
              params={{ personId: id }}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 transition-colors active:bg-secondary"
            >
              <Avatar src={p.photo} name={p.name} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{p.name}</p>
                <p className="truncate text-[13px] text-muted-foreground">{p.formerRole}</p>
              </div>
              <MessageCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        {state.matchConnected ? (
          <Button asChild size="lg" className="w-full">
            <Link to="/chat/$personId" params={{ personId: "maya" }}>
              <MessageCircle />
              Continue your chat with Maya
            </Link>
          </Button>
        ) : (
          <Button size="lg" className="w-full" onClick={connect}>
            <MessageCircle />
            Say hello to Maya
          </Button>
        )}
        <Button asChild variant="quiet" size="lg" className="w-full">
          <Link to="/cohort">See the rest of your cohort</Link>
        </Button>
      </div>

      <p className="mt-4 text-center text-[13px] text-muted-foreground">
        One match a week. We'd rather you know six people well than sixty barely at all.
      </p>
    </Screen>
  );
}