import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Check, Copy, Heart, Users, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Card, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { eventById } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/invite")({
  head: () => ({
    meta: [
      { title: "Invite someone — Layofftivity" },
      {
        name: "description",
        content:
          "Invite a friend, a family member, or a former coworker to volunteer alongside you this Saturday.",
      },
      { property: "og:title", content: "Invite someone to volunteer with you" },
      { property: "og:description", content: "A friend, family, or a former coworker." },
    ],
  }),
  component: Invite,
});

const kinds = [
  {
    id: "friend",
    title: "A friend",
    detail: "Someone who'd say yes to a Saturday morning with you.",
    icon: Heart,
    message:
      "I've been volunteering with a small crew at a food bank on Saturdays. It's been the best part of my week. Want to come this Saturday, 9 to 11:30?",
  },
  {
    id: "family",
    title: "Family",
    detail: "Parents, siblings, partners. Kids over 12 are welcome too.",
    icon: Users,
    message:
      "Come see what I've been doing on Saturdays. Harvest Table Food Bank, 9 to 11:30, and we get lunch after.",
  },
  {
    id: "coworker",
    title: "A former coworker",
    detail: "Someone from the old team who's also figuring out their week.",
    icon: Briefcase,
    message:
      "Not a networking thing, promise. I'm in a volunteer cohort on Saturdays and there's a spot open. It helped me more than any coffee chat has.",
  },
];

function Invite() {
  const { state, update } = useStore();
  const [kind, setKind] = React.useState(kinds[0]);
  const [name, setName] = React.useState("");
  const event = eventById("harvest-sat");

  const send = () => {
    update((s) => ({
      ...s,
      invitesSent: [...s.invitesSent, `${name.trim()} (${kind.title.toLowerCase()})`],
    }));
    toast.success(`Invite sent to ${name.trim()}`, {
      description: "You'll get a note when they open it.",
    });
    setName("");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText("https://layofftivity.app/join/saturday-crew");
      toast.success("Link copied");
    } catch {
      toast("Copy this link", { description: "layofftivity.app/join/saturday-crew" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Screen>
        <TopBar title="Invite someone" subtitle={`${event.title} · ${event.dateShort}`} back />

        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Bringing one person doubles the odds you keep coming back. Pick who you have in mind and
          we'll draft the message.
        </p>

        <SectionTitle>Who are you inviting?</SectionTitle>
        <div className="space-y-3">
          {kinds.map((k) => {
            const Icon = k.icon;
            const selected = kind.id === k.id;
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => setKind(k)}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-colors",
                  selected
                    ? "bg-accent-soft"
                    : "bg-secondary hover:bg-primary-soft/70",
                )}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-bold">{k.title}</span>
                  <span className="block text-[13px] text-muted-foreground">{k.detail}</span>
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    selected ? "bg-primary" : "bg-secondary",
                  )}
                >
                  {selected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                </span>
              </button>
            );
          })}
        </div>

        <SectionTitle>Their name</SectionTitle>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          className="h-12 w-full rounded-xl bg-card px-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/30"
        />

        <SectionTitle>Message</SectionTitle>
        <Card>
          <p className="text-[15px] leading-relaxed">
            {name.trim() ? `Hey ${name.trim()} — ` : "Hey — "}
            {kind.message}
          </p>
        </Card>

        <div className="mt-5 space-y-3">
          <Button size="lg" className="w-full" disabled={!name.trim()} onClick={send}>
            Send the invite
          </Button>
          <Button variant="quiet" size="lg" className="w-full" onClick={copyLink}>
            <Copy />
            Copy a shareable link instead
          </Button>
        </div>

        {state.invitesSent.length > 0 && (
          <>
            <SectionTitle>Invites you've sent</SectionTitle>
            <div className="space-y-2">
              {state.invitesSent.map((i, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-xl bg-card px-4 py-3"
                >
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-[15px] font-semibold">{i}</span>
                  <span className="ml-auto text-[13px] text-muted-foreground">Pending</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 pb-8">
          <Button asChild variant="ghost" size="lg" className="w-full">
            <Link to="/home">Back to your week</Link>
          </Button>
        </div>
      </Screen>
    </div>
  );
}