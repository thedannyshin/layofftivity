import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, MapPin, Navigation, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Card, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { cohort, cohortMembers, eventById, orgById, timeline } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/volunteer-day")({
  head: () => ({
    meta: [
      { title: "Volunteer day — Layofftivity" },
      {
        name: "description",
        content:
          "Check in, find the meetup spot, and follow the hour-by-hour plan for your cohort's volunteer day.",
      },
      { property: "og:title", content: "Your volunteer day" },
      { property: "og:description", content: "Check in, navigate, and follow the shift timeline." },
    ],
  }),
  component: VolunteerDay,
});

function VolunteerDay() {
  const event = eventById("harvest-sat");
  const org = orgById(event.orgId);
  const { state, update } = useStore();
  const navigate = useNavigate();
  const members = cohortMembers();

  const checkIn = () => {
    update((s) => ({ ...s, checkedIn: true }));
    toast.success("Checked in", { description: "Sofia and Daniel are already here." });
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <Screen>
        <TopBar title="Saturday, August 8" subtitle={`${org.name} · ${event.time}`} back />

        {/* Check in */}
        <Card className={cn(state.checkedIn && "bg-primary-soft")}>
          {state.checkedIn ? (
            <>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </span>
                <p className="text-[16px] font-bold text-primary">You're checked in</p>
              </div>
              <p className="mt-2 text-[14px] text-muted-foreground">
                Line 2, next to Tomás. Your cohort is packing produce boxes first.
              </p>
            </>
          ) : (
            <>
              <p className="text-[16px] font-bold">Check in when you arrive</p>
              <p className="mt-1 text-[14px] text-muted-foreground">
                Checking in lets your cohort know you made it, so nobody stands around wondering.
              </p>
              <Button size="lg" className="mt-4 w-full" onClick={checkIn}>
                Check in at Harvest Table
              </Button>
            </>
          )}
        </Card>

        {/* Navigation */}
        <SectionTitle>Getting there</SectionTitle>
        <Card>
          <div className="flex h-32 items-center justify-center rounded-xl border border-border bg-secondary">
            <div className="text-center">
              <MapPin className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-1 text-[13px] font-semibold">{event.address}</p>
              <p className="text-[12px] text-muted-foreground">12 min drive · 24 min by BART + walk</p>
            </div>
          </div>
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
              <Link to="/cohort">Find a ride</Link>
            </Button>
          </div>
        </Card>

        {/* Who's here */}
        <SectionTitle>Your line today</SectionTitle>
        <Card>
          <div className="flex flex-wrap gap-3">
            {members.map((m, i) => (
              <div key={m.id} className="w-14 text-center">
                <Avatar src={m.photo} name={m.name} size={48} className="mx-auto" />
                <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">
                  {m.name.split(" ")[0]}
                </p>
                {i < 2 && <span className="text-[10px] font-bold text-primary">here</span>}
              </div>
            ))}
          </div>
          <Chip tone="green">
            <Users className="h-3 w-3" />
            Goal today: 180 boxes
          </Chip>
        </Card>

        {/* Timeline */}
        <SectionTitle>Timeline</SectionTitle>
        <ol className="relative space-y-5 border-l border-border pl-6">
          {timeline.map((t, i) => (
            <li key={t.time} className="relative">
              <span
                className={cn(
                  "absolute top-1 -left-[31px] h-3 w-3 rounded-full border-2 border-background",
                  state.checkedIn && i < 2 ? "bg-primary" : "bg-border",
                )}
              />
              <p className="text-[12px] font-bold text-muted-foreground uppercase">{t.time}</p>
              <p className="text-[15px] font-bold">{t.title}</p>
              <p className="text-[13px] text-muted-foreground">{t.detail}</p>
            </li>
          ))}
        </ol>
      </Screen>

      <div className="fixed inset-x-0 bottom-0 bg-card">
        <div className="mx-auto w-full max-w-[430px] px-5 py-4">
          <Button
            size="lg"
            className="w-full"
            variant={state.checkedIn ? "default" : "quiet"}
            onClick={() => navigate({ to: "/reflection" })}
          >
            {state.checkedIn ? "Finish the shift and reflect" : "Skip ahead to reflection"}
          </Button>
        </div>
      </div>
    </div>
  );
}