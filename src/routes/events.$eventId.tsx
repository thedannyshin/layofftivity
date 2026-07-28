import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CalendarDays, Check, Clock, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Card, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { OrgMark } from "@/components/app/OrgMark";
import { Button } from "@/components/ui/button";
import { cohortMembers, eventById, orgById } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/events/$eventId")({
  head: ({ params }) => {
    const event = eventById(params.eventId);
    return {
      meta: [
        { title: `${event.title} — Layofftivity` },
        { name: "description", content: event.description.slice(0, 155) },
        { property: "og:title", content: event.title },
        { property: "og:description", content: event.description.slice(0, 155) },
      ],
    };
  },
  component: EventDetail,
});

function EventDetail() {
  const { eventId } = Route.useParams();
  const event = eventById(eventId);
  const org = orgById(event.orgId);
  const { state, update } = useStore();
  const navigate = useNavigate();
  const joined = state.joinedEventIds.includes(event.id);
  const filled = event.spotsFilled + (joined ? 1 : 0);
  const attendees = cohortMembers().slice(0, Math.min(filled, 6));

  const join = () => {
    update((s) => ({ ...s, joinedEventIds: [...new Set([...s.joinedEventIds, event.id])] }));
    toast.success("You're in", { description: `${event.dateShort} · ${event.time}` });
    navigate({ to: "/cohort" });
  };

  const leave = () => {
    update((s) => ({ ...s, joinedEventIds: s.joinedEventIds.filter((id) => id !== event.id) }));
    toast("Spot released", { description: "You can rejoin any time before Friday." });
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <Screen>
        <TopBar title={event.title} subtitle={org.name} back />

        <Link
          to="/organizations/$orgId"
          params={{ orgId: org.id }}
          className="flex items-center gap-3 rounded-2xl bg-card p-4 transition-colors active:bg-secondary"
        >
          <OrgMark cover={org.cover} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold">{org.name}</p>
            <p className="truncate text-[13px] text-muted-foreground">
              {org.cause} · {org.neighborhood}
            </p>
          </div>
          <span className="text-[13px] font-bold text-primary">View</span>
        </Link>

        {event.cohortEvent && (
          <div className="mt-3 rounded-2xl bg-accent-soft p-4">
            <p className="text-[14px] font-bold text-accent-foreground">
              This is your cohort's standing shift
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              The same six people, the same packing line, every other Saturday.
            </p>
          </div>
        )}

        <SectionTitle>What you'll do</SectionTitle>
        <p className="text-[15px] leading-relaxed text-foreground">{event.description}</p>

        <SectionTitle>Details</SectionTitle>
        <Card className="space-y-3">
          <Detail icon={<CalendarDays className="h-5 w-5 text-primary" />} label="Date" value={event.date} />
          <Detail icon={<Clock className="h-5 w-5 text-primary" />} label="Time" value={event.time} />
          <Detail
            icon={<MapPin className="h-5 w-5 text-primary" />}
            label="Location"
            value={`${event.location}\n${event.address}`}
          />
          <Detail
            icon={<Users className="h-5 w-5 text-primary" />}
            label="Volunteers"
            value={`${filled} of ${event.spotsTotal} spots filled`}
          />
        </Card>

        <SectionTitle>Who's going</SectionTitle>
        <Card>
          <div className="flex flex-wrap gap-3">
            {attendees.map((m) => (
              <div key={m.id} className="w-14 text-center">
                <Avatar src={m.photo} name={m.name} size={48} className="mx-auto" />
                <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">
                  {m.name.split(" ")[0]}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-muted-foreground">
            {event.spotsTotal - filled > 0
              ? `${event.spotsTotal - filled} spots still open. Small teams on purpose.`
              : "This shift is full. You have a spot."}
          </p>
        </Card>

        <SectionTitle>What to bring</SectionTitle>
        <ul className="space-y-2">
          {event.bring.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-[15px]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                <Check className="h-3 w-3 text-primary" />
              </span>
              {b}
            </li>
          ))}
        </ul>

        {joined && (
          <div className="mt-6 space-y-3">
            <Chip tone="green">
              <Check className="h-3 w-3" /> You're going
            </Chip>
            <Button asChild variant="quiet" size="lg" className="w-full">
              <Link to="/cohort">Open your cohort</Link>
            </Button>
            <Button asChild variant="quiet" size="lg" className="w-full">
              <Link to="/invite">Invite someone to join you</Link>
            </Button>
            <button
              type="button"
              onClick={leave}
              className="w-full rounded-full bg-secondary py-3 text-[14px] font-semibold text-muted-foreground transition-colors hover:bg-muted active:bg-muted"
            >
              Can't make it — release my spot
            </button>
          </div>
        )}
      </Screen>

      {!joined && (
        <div className="fixed inset-x-0 bottom-0 bg-card">
          <div className="mx-auto w-full max-w-[430px] px-5 py-4">
            <Button size="lg" className="w-full" onClick={join}>
              Join this event
            </Button>
            <p className="mt-2 text-center text-[12px] text-muted-foreground">
              You can release your spot up until the day before.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-[12px] font-semibold text-muted-foreground uppercase">{label}</p>
        <p className="text-[15px] leading-snug font-semibold whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
}