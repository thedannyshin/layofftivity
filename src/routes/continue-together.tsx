import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarCheck, ChevronRight, Coffee, Footprints, Utensils } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Screen, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { cohortMembers, continueOptions } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const icons = {
  coffee: Coffee,
  utensils: Utensils,
  footprints: Footprints,
  calendarcheck: CalendarCheck,
};

export const Route = createFileRoute("/continue-together")({
  head: () => ({
    meta: [
      { title: "Continue together — Layofftivity" },
      {
        name: "description",
        content:
          "The shift is over. Keep the morning going with coffee, lunch, a walk, or book the next volunteer day.",
      },
      { property: "og:title", content: "Keep the morning going" },
      { property: "og:description", content: "Coffee, lunch, a walk, or next Saturday." },
    ],
  }),
  component: ContinueTogether,
});

function ContinueTogether() {
  const { state, update } = useStore();
  const navigate = useNavigate();
  const members = cohortMembers();

  const choose = (id: string, title: string) => {
    update((s) => ({ ...s, continueChoice: id }));
    if (id === "next") {
      update((s) => ({
        ...s,
        joinedEventIds: [...new Set([...s.joinedEventIds, "harvest-sat"])],
      }));
      toast.success("Booked for August 15", { description: "Same line, same crew." });
      navigate({ to: "/home" });
      return;
    }
    toast.success(`${title} suggested to the crew`, {
      description: "Priya and Tomás were notified in the group chat.",
    });
    navigate({ to: "/cohort-chat" });
  };

  return (
    <Screen>
      <TopBar title="That's a wrap" subtitle="184 boxes packed. Your fourth Saturday." back />

      <div className="rounded-2xl bg-accent-soft p-5 text-center">
        <div className="flex justify-center -space-x-2">
          {members.map((m) => (
            <Avatar key={m.id} src={m.photo} name={m.name} size={38} />
          ))}
        </div>
        <p className="mt-3 text-[17px] leading-snug font-bold text-accent-foreground">
          Nobody has to leave yet
        </p>
        <p className="mt-1 text-[14px] text-muted-foreground">
          The hour after a shift is where cohorts turn into friendships. Pick something small.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {continueOptions.map((o) => {
          const Icon = icons[o.icon as keyof typeof icons];
          const selected = state.continueChoice === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o.id, o.title)}
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
                <span className="block text-[16px] font-bold">{o.title}</span>
                <span className="block text-[13px] text-muted-foreground">{o.detail}</span>
                <span className="mt-1 block text-[12px] font-semibold text-primary">
                  {o.duration}
                </span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        <Button asChild variant="quiet" size="lg" className="w-full">
          <Link to="/profile">Head home — see my volunteer history</Link>
        </Button>
      </div>

      <p className="mt-4 text-center text-[13px] text-muted-foreground">
        Four Saturdays in a row with the same six people. That's how this works.
      </p>
    </Screen>
  );
}