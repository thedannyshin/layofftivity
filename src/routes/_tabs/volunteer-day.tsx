import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, MapPin, Navigation, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Card, Chip, Screen, ScreenHero, SectionTitle } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { cohort, orgById, timeline } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/volunteer-day")({
  head: () => ({
    meta: [
      { title: "Volunteer day — Layofftivity" },
      {
        name: "description",
        content:
          "Check in, find the meetup spot, and follow the hour-by-hour plan for your group's volunteer day.",
      },
      { property: "og:title", content: "Your volunteer day" },
      { property: "og:description", content: "Check in, navigate, and follow the shift timeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VolunteerDay,
});

function estimateHours(time: string) {
  const m = time.match(/(\d+):(\d+)\s*(?:–|-)\s*(\d+):(\d+)/);
  if (!m) return 2.5;
  const start = Number(m[1]) % 12 + Number(m[2]) / 60;
  const end = Number(m[3]) % 12 + Number(m[4]) / 60;
  const diff = end - start;
  return Math.round((diff > 0 ? diff : diff + 12) * 2) / 2;
}

function VolunteerDay() {
  const { state, update, matches, guests, primaryEvent, isJoined, isCheckedIn } = useApp();
  const event = primaryEvent;
  const org = orgById(event.orgId);
  const navigate = useNavigate();
  const joined = isJoined(event.id);
  const checkedIn = isCheckedIn(event.id);
  const completed = state.completed.some((c) => c.eventId === event.id);

  const checkIn = () => {
    update((s) => ({
      ...s,
      checkedInEventIds: [...new Set([...s.checkedInEventIds, event.id])],
    }));
    toast.success("Checked in", { description: "Your group can see you made it." });
  };

  const finish = () => {
    update((s) => ({
      ...s,
      completed: s.completed.some((c) => c.eventId === event.id)
        ? s.completed
        : [
            ...s.completed,
            {
              id: `c${Date.now()}`,
              eventId: event.id,
              date: event.date,
              hours: estimateHours(event.time),
            },
          ],
    }));
    navigate({ to: "/reflection" });
  };

  return (
    <div className="min-h-screen bg-background pb-40">
      <Screen>
        <ScreenHero
          title={event.title}
          subtitle={`${event.dateShort}, ${event.time}`}
          back
        />

        {!joined ? (
          <Card variant="accent">
            <p className="text-[16px] font-bold text-accent-foreground">
              You haven't joined this activity yet
            </p>
            <p className="mt-1 text-[14px] text-accent-foreground">
              Grab a spot and this page turns into your day-of guide.
            </p>
            <Button asChild size="lg" className="mt-4 w-full">
              <Link to="/events/$eventId" params={{ eventId: event.id }}>
                See the details and join
              </Link>
            </Button>
          </Card>
        ) : (
          <Card className={cn(checkedIn && "bg-primary-soft")}>
            {checkedIn ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </span>
                  <p className="text-[16px] font-bold text-primary">You're checked in</p>
                </div>
                <p className="mt-2 text-[14px] text-muted-foreground">
                  Your group knows you're here. Find them at {cohort.meetupSpot.split(",")[0]}.
                </p>
              </>
            ) : (
              <>
                <p className="text-[16px] font-bold">Check in when you arrive</p>
                <p className="mt-1 text-[14px] text-muted-foreground">
                  Checking in lets your group know you made it, so nobody stands around wondering.
                </p>
                <Button size="lg" className="mt-4 w-full" onClick={checkIn}>
                  Check in at {org.name.split(" ")[0]}
                </Button>
              </>
            )}
          </Card>
        )}

        <SectionTitle>Getting there</SectionTitle>
        <Card>
          <p className="flex items-start gap-2 text-[14px] font-semibold">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {event.address}
          </p>
          <p className="mt-3 text-[14px] font-semibold">{cohort.meetupSpot}</p>
          <p className="text-[13px] text-muted-foreground">{cohort.meetupTime}</p>
          <div className="mt-3 flex gap-2">
            <Button
              className="flex-1"
              onClick={() =>
                window.open(
                  `https://maps.google.com/?q=${encodeURIComponent(event.address)}`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              <Navigation />
              Directions
            </Button>
            <Button asChild variant="quiet" className="flex-1">
              <Link to="/messages">Open messages</Link>
            </Button>
          </div>
        </Card>

        <SectionTitle>Your line today</SectionTitle>
        <Card>
          <div className="flex flex-wrap gap-3">
            {matches.map((m) => (
              <div key={m.id} className="w-14 text-center">
                <Avatar src={m.photo} name={m.name} size={48} className="mx-auto" />
                <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">
                  {m.name.split(" ")[0]}
                </p>
              </div>
            ))}
            {guests.map((g) => (
              <div key={g.id} className="w-14 text-center">
                <Avatar name={g.name} size={48} className="mx-auto" />
                <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">
                  Guest
                </p>
              </div>
            ))}
          </div>
          <Chip tone="green">
            <Users className="h-3 w-3" />
            {event.spotsTotal} volunteers on this shift
          </Chip>
        </Card>

        <SectionTitle>Timeline</SectionTitle>
        <ol className="relative space-y-5 pl-6 before:absolute before:top-2 before:bottom-2 before:left-0 before:w-px before:bg-secondary">
          {timeline.map((t, i) => (
            <li key={t.time} className="relative">
              <span
                className={cn(
                  "absolute top-1 -left-[31px] h-3 w-3 rounded-full",
                  checkedIn && i < 2 ? "bg-primary" : "bg-secondary",
                )}
              />
              <p className="text-[12px] font-bold text-muted-foreground uppercase">{t.time}</p>
              <p className="text-[15px] font-bold">{t.title}</p>
              <p className="text-[13px] text-muted-foreground">{t.detail}</p>
            </li>
          ))}
        </ol>
      </Screen>

      {joined && (
        <div className="fixed inset-x-0 bottom-16 z-20 bg-card">
          <div className="mx-auto w-full max-w-[430px] px-5 py-4">
            <Button
              size="lg"
              className="w-full"
              variant={checkedIn ? "default" : "quiet"}
              disabled={!checkedIn && !completed}
              onClick={finish}
            >
              {completed ? "Write another reflection" : "Finish the shift and reflect"}
            </Button>
            {!checkedIn && !completed && (
              <p className="mt-2 text-center text-[12px] text-muted-foreground">
                Check in first — the shift closes out from there.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
