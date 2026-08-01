import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Check, ChevronDown, ChevronUp, Clock, MapPin, Users } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Avatar, Card, Chip, FactGrid, Screen, ScreenHero, SectionTitle } from "@/components/app/Shell";
import { CoverPhoto } from "@/components/app/OrgMark";
import { Button } from "@/components/ui/button";
import { eventById, orgById } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

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
  const { update, matches, guests, isJoined } = useApp();
  const navigate = useNavigate();
  const [descriptionOpen, setDescriptionOpen] = React.useState(false);
  const joined = isJoined(event.id);
  const attending = joined ? [...matches] : [];
  const attendingGuests = joined ? guests.filter((g) => g.eventId === event.id) : [];
  const filled = event.spotsFilled + (joined ? 1 + attendingGuests.length : 0);
  const longDescription = event.description.length > 95;
  const join = () => {
    update((s) => ({ ...s, joinedEventIds: [...new Set([...s.joinedEventIds, event.id])] }));
    toast.success("You're in", { description: `${event.dateShort}, ${event.time}` });
    navigate({ to: "/messages" });
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
        <ScreenHero title={event.title} subtitle={event.dateShort} back />

        <CoverPhoto cover={org.cover} alt={org.name} className="h-44 rounded-2xl" />

        <div className="mt-8 mb-3 flex items-center justify-between gap-3">
          <h2 className="lo-display text-[18px]">What you'll do</h2>
          {longDescription && (
            <button
              type="button"
              aria-label={descriptionOpen ? "Show less" : "Show more"}
              onClick={() => setDescriptionOpen((open) => !open)}
              className="inline-flex shrink-0 items-center rounded-full border border-muted-foreground/35 bg-transparent p-1 text-foreground transition-colors hover:bg-card active:bg-card"
            >
              {descriptionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
        <p
          className={cn(
            "text-[15px] leading-relaxed",
            !descriptionOpen && "line-clamp-2",
          )}
        >
          {event.description}
        </p>

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
          <div className="mt-8 space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link to="/volunteer-day">Open the volunteer day</Link>
            </Button>
            <Button variant="quiet" size="lg" className="w-full" onClick={leave}>
              Can't make it — release my spot
            </Button>
          </div>
        )}
      </Screen>

      {!joined && (
        <div className="ios-chrome ios-hairline-t fixed inset-x-0 z-20"
        style={{ bottom: "max(calc(49px + env(safe-area-inset-bottom)), var(--ios-keyboard-inset, 0px))" }}>
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

