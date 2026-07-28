import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Check, Clock, MapPin, Users, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Card, Chip, Clamp, FactGrid, Meta, Screen, SectionTitle, TopBar, tapCard } from "@/components/app/Shell";
import { OrgMark } from "@/components/app/OrgMark";
import { Button } from "@/components/ui/button";
import { eventById, orgById } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_tabs/events/$eventId")({
  head: ({ params }) => {
    const event = eventById(params.eventId);
    return {
      meta: [
        { title: `${event.title} — Layofftivity` },
        { name: "description", content: event.description.slice(0, 155) },
        { property: "og:title", content: event.title },
        { property: "og:description", content: event.description.slice(0, 155) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: EventDetail,
});

function EventDetail() {
  const { eventId } = Route.useParams();
  const event = eventById(eventId);
  const org = orgById(event.orgId);
  const { state, update, matches, guests, isJoined, primaryEvent } = useApp();
  const navigate = useNavigate();
  const joined = isJoined(event.id);
  const attending = joined ? [...matches] : [];
  const attendingGuests = joined ? guests.filter((g) => g.eventId === event.id) : [];
  const filled = event.spotsFilled + (joined ? 1 + attendingGuests.length : 0);
  const isPrimary = primaryEvent.id === event.id;

  const join = () => {
    update((s) => ({ ...s, joinedEventIds: [...new Set([...s.joinedEventIds, event.id])] }));
    toast.success("You're in", { description: `${event.dateShort} · ${event.time}` });
    navigate({ to: "/cohort" });
  };

  const leave = () => {
    update((s) => ({
      ...s,
      joinedEventIds: s.joinedEventIds.filter((id) => id !== event.id),
      checkedInEventIds: s.checkedInEventIds.filter((id) => id !== event.id),
    }));
    toast("Spot released", { description: "You can rejoin any time before the day." });
  };

  return (
    <div className="min-h-screen bg-background pb-40">
      <Screen>
        <TopBar title={event.title} subtitle={org.name} back />

        <CoverPhoto cover={org.cover} alt={org.name} className="h-44 rounded-2xl" />

        <Link
          to="/organizations/$orgId"
          params={{ orgId: org.id }}
          className={`${tapCard} mt-3 flex items-center gap-3`}
        >
          <OrgMark cover={org.cover} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold">{org.name}</p>
            <Meta items={[org.cause, org.neighborhood]} />
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>

        {isPrimary && (
          <div className="mt-3 rounded-2xl bg-accent-soft p-4">
            <p className="text-[14px] font-bold text-accent-foreground">
              {joined ? "Your group's shift" : "Matched to your causes and availability"}
            </p>
            <Meta
              className="mt-1"
              items={[`${matches.map((m) => m.name.split(" ")[0]).join(" and ")} going`]}
            />
          </div>
        )}

        <SectionTitle>What you'll do</SectionTitle>
        <Clamp lines={2}>{event.description}</Clamp>

        <SectionTitle>Details</SectionTitle>
        <FactGrid
          facts={[
            { icon: <CalendarDays className="h-5 w-5" />, value: event.dateShort },
            { icon: <Clock className="h-5 w-5" />, value: event.time },
            {
              icon: <MapPin className="h-5 w-5" />,
              value: event.location,
              hint: event.address,
            },
            {
              icon: <Users className="h-5 w-5" />,
              value: `${filled}/${event.spotsTotal} spots`,
              hint: event.spotsTotal - filled > 0 ? `${event.spotsTotal - filled} open` : "Full",
            },
          ]}
        />

        <SectionTitle>Who's going</SectionTitle>
        <Card>
          {joined ? (
            <div className="flex flex-wrap gap-3">
              {attending.map((m) => (
                <div key={m.id} className="w-14 text-center">
                  <Avatar src={m.photo} name={m.name} size={48} className="mx-auto" />
                  <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">
                    {m.name.split(" ")[0]}
                  </p>
                </div>
              ))}
              {attendingGuests.map((g) => (
                <div key={g.id} className="w-14 text-center">
                  <Avatar name={g.name} size={48} className="mx-auto" />
                  <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">
                    Guest
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[15px] text-muted-foreground">
              {event.spotsFilled} signed up. Join to see your line.
            </p>
          )}
        </Card>

        <SectionTitle>What to bring</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {event.bring.map((b) => (
            <Chip key={b} tone="green">
              <Check className="h-3 w-3" />
              {b}
            </Chip>
          ))}
        </div>

        {joined && (
          <div className="mt-6 space-y-3">
            <Chip tone="green">
              <Check className="h-3 w-3" /> You're going
            </Chip>
            <Button asChild size="lg" className="w-full">
              <Link to="/volunteer-day">Open the volunteer day</Link>
            </Button>
            <Button asChild variant="soft" size="lg" className="w-full">
              <Link to="/cohort">Open your group</Link>
            </Button>
            <Button asChild variant="quiet" size="lg" className="w-full">
              <Link to="/invite">
                {state.invites.length ? "Manage your invitation" : "Invite a friend to join you"}
              </Link>
            </Button>
            <Button variant="quiet" size="lg" className="w-full" onClick={leave}>
              Can't make it — release my spot
            </Button>
          </div>
        )}
      </Screen>

      {!joined && (
        <div className="fixed inset-x-0 bottom-16 z-20 bg-card">
          <div className="mx-auto w-full max-w-[430px] px-5 py-4">
            <Button size="lg" className="w-full" onClick={join}>
              Join this activity
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

