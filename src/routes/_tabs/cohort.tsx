import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, ChevronRight, MapPin, MessageCircle, Quote, Clock } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Card, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import {
  byId,
  cohort,
  cohortMembers,
  eventById,
  icebreakers,
  introductions,
  transportation,
} from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_tabs/cohort")({
  head: () => ({
    meta: [
      { title: "Saturday Crew — Your Layofftivity cohort" },
      {
        name: "description",
        content:
          "Your six-person cohort: introductions, icebreakers, group chat, rides, and where to meet on Saturday.",
      },
      { property: "og:title", content: "Your volunteer cohort" },
      {
        property: "og:description",
        content: "Six people, one packing line, every other Saturday.",
      },
    ],
  }),
  component: Cohort,
});

function Cohort() {
  const members = cohortMembers();
  const { state, update } = useStore();
  const event = eventById("harvest-sat");
  const lastMessage = state.cohortMessages[state.cohortMessages.length - 1];

  const claimRide = (driverId: string) => {
    update((s) => ({ ...s, rideClaimed: s.rideClaimed === driverId ? null : driverId }));
    toast.success("Seat saved", {
      description: `${byId(driverId).name.split(" ")[0]} will see you in the car list.`,
    });
  };

  return (
    <Screen>
      <TopBar title={cohort.name} subtitle={`${cohort.formed} · ${cohort.daysTogether} days together`} />

      <Link
        to="/events/$eventId"
        params={{ eventId: event.id }}
        className="flex items-center gap-3 rounded-2xl bg-card p-4 transition-colors active:bg-secondary"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-primary">Next together</p>
          <p className="mt-0.5 truncate text-[16px] font-bold">{event.title}</p>
          <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
            {event.date} · {event.time}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>

      <SectionTitle>Members</SectionTitle>
      <div className="space-y-3">
        {members.map((m) => (
          <Link
            key={m.id}
            to="/chat/$personId"
            params={{ personId: m.id }}
            className="flex items-center gap-3 rounded-2xl bg-card p-4 transition-colors active:bg-secondary"
          >
            <Avatar src={m.photo} name={m.name} size={48} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold">{m.name}</p>
              <p className="truncate text-[13px] text-muted-foreground">{m.formerRole}</p>
              <p className="mt-1.5 truncate text-[12px] text-muted-foreground">
                {m.interests.slice(0, 3).join(" · ")}
              </p>
            </div>
            <MessageCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <SectionTitle>Introductions</SectionTitle>
      <div className="space-y-3">
        {introductions.map((intro) => {
          const p = byId(intro.personId);
          return (
            <Card key={intro.personId}>
              <div className="flex items-center gap-2.5">
                <Avatar src={p.photo} name={p.name} size={34} />
                <div>
                  <p className="text-[14px] font-bold">{p.name}</p>
                  <p className="text-[12px] text-muted-foreground">{intro.when}</p>
                </div>
              </div>
              <p className="mt-2.5 text-[15px] leading-relaxed">{intro.text}</p>
            </Card>
          );
        })}
      </div>

      <SectionTitle>Icebreakers for Saturday</SectionTitle>
      <div className="space-y-2.5">
        {icebreakers.map((q) => (
          <div key={q} className="flex gap-3 rounded-2xl bg-accent-soft p-4">
            <Quote className="h-4 w-4 shrink-0 text-accent-foreground" />
            <p className="text-[15px] leading-relaxed text-accent-foreground">{q}</p>
          </div>
        ))}
      </div>

      <SectionTitle>Group chat</SectionTitle>
      <Link
        to="/cohort-chat"
        className="flex items-center gap-3 rounded-2xl bg-card p-4 transition-colors active:bg-secondary"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
          <MessageCircle className="h-5 w-5 text-primary" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold">
            {byId(lastMessage.personId).name.split(" ")[0]}: {lastMessage.text}
          </span>
          <span className="mt-0.5 block text-[12px] text-muted-foreground">
            {lastMessage.time} · {state.cohortMessages.length} messages
          </span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>

      <SectionTitle>Getting there</SectionTitle>
      <div className="space-y-3">
        {transportation.map((t) => {
          const driver = byId(t.driverId);
          const claimed = state.rideClaimed === t.driverId;
          const taken = t.seatsTaken + (claimed ? 1 : 0);
          const full = taken >= t.seatsTotal && !claimed;
          return (
            <Card key={t.driverId}>
              <div className="flex items-center gap-3">
                <Avatar src={driver.photo} name={driver.name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold">{driver.name} is driving</p>
                  <p className="truncate text-[13px] text-muted-foreground">
                    {t.note} · leaves {t.departs}
                  </p>
                </div>
                <Car className="h-5 w-5 shrink-0 text-muted-foreground" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <Chip tone={full ? "neutral" : "green"}>
                  {t.seatsTotal - taken} of {t.seatsTotal} seats open
                </Chip>
                <Button
                  size="sm"
                  variant={claimed ? "soft" : "default"}
                  disabled={full}
                  onClick={() => claimRide(t.driverId)}
                >
                  {claimed ? "You have a seat — tap to cancel" : full ? "Car is full" : "Take a seat"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <SectionTitle>Where to meet</SectionTitle>
      <Card>
        <p className="flex items-start gap-2.5 text-[15px] font-semibold">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          {cohort.meetupSpot}
        </p>
        <p className="mt-2 flex items-start gap-2.5 text-[15px] text-muted-foreground">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          {cohort.meetupTime}
        </p>
        <Button asChild variant="quiet" size="lg" className="mt-4 w-full">
          <Link to="/volunteer-day">Open Saturday's plan</Link>
        </Button>
      </Card>

      <Button asChild variant="quiet" size="lg" className="mt-3 w-full">
        <Link to="/invite">Invite someone into the cohort</Link>
      </Button>
    </Screen>
  );
}