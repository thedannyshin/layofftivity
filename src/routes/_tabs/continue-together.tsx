import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarCheck, ChevronRight, Coffee, Footprints, Utensils } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Screen, ScreenHero, selectRow, staticCardAccent } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { continueOptions, events } from "@/lib/data";
import { sendMessage, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const icons = {
  coffee: Coffee,
  utensils: Utensils,
  footprints: Footprints,
  calendarcheck: CalendarCheck,
};

export const Route = createFileRoute("/_tabs/continue-together")({
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
  const { state, update, matches, guests, daysCompleted, primaryEvent } = useApp();
  const navigate = useNavigate();
  const nextEvent =
    events.find((e) => e.orgId === primaryEvent.orgId && e.id !== primaryEvent.id) ??
    events.find((e) => e.id !== primaryEvent.id)!;

  const choose = (id: string, title: string) => {
    update((s) => ({ ...s, continueChoice: id }));
    if (id === "next") {
      update((s) => ({
        ...s,
        joinedEventIds: [...new Set([...s.joinedEventIds, nextEvent.id])],
      }));
      toast.success(`Booked for ${nextEvent.dateShort}`, { description: nextEvent.title });
      navigate({ to: "/home" });
      return;
    }
    sendMessage(update, "group", {
      personId: "you",
      text: `${title} after the shift? ${continueOptions.find((o) => o.id === id)?.detail ?? ""}`,
      time: "Just now",
    });
    toast.success(`${title} suggested to the group`);
    navigate({ to: "/cohort-chat" });
  };

  return (
    <Screen>
      <ScreenHero title="That's a wrap" subtitle={`Day ${daysCompleted} logged`} back />

      <div className={`${staticCardAccent} p-5 text-center`}>
        <div className="flex justify-center -space-x-2">
          {matches.map((m) => (
            <Avatar key={m.id} src={m.photo} name={m.name} size={38} />
          ))}
          {guests.map((g) => (
            <Avatar key={g.id} name={g.name} size={38} />
          ))}
        </div>
        <p className="mt-3 text-[17px] leading-snug font-bold text-accent-foreground">
          Nobody has to leave yet
        </p>
        <p className="mt-1 text-[14px] text-muted-foreground">
          The hour after a shift is where a group turns into friendships. Pick something small.
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
              className={selectRow(selected)}
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
        {daysCompleted === 1
          ? "One day down. Showing up again next week is the whole idea."
          : `${daysCompleted} volunteer days with the same people. That's how this works.`}
      </p>
    </Screen>
  );
}