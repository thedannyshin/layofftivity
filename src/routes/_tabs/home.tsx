import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, Clock, MapPin, Sparkles, Users } from "lucide-react";
import { Avatar, Card, Chip, Screen, SectionTitle } from "@/components/app/Shell";
import { OrgMark } from "@/components/app/OrgMark";
import { Button } from "@/components/ui/button";
import { cohort, cohortMembers, eventById, events, orgById, you } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/home")({
  head: () => ({
    meta: [
      { title: "Your week — Layofftivity" },
      {
        name: "description",
        content:
          "See your next volunteer day, your cohort, your weekly goal, and events recommended for you.",
      },
      { property: "og:title", content: "Your week on Layofftivity" },
      {
        property: "og:description",
        content: "Your cohort, your next volunteer day, and this week's goal in one place.",
      },
    ],
  }),
  component: Home,
});

const goals = [
  { id: "shift", label: "Show up for one volunteer shift" },
  { id: "message", label: "Say something in the cohort chat" },
  { id: "reflect", label: "Write one reflection" },
];

function Home() {
  const { state, update } = useStore();
  const upcoming = eventById(state.joinedEventIds[0] ?? "harvest-sat");
  const upcomingOrg = orgById(upcoming.orgId);
  const members = cohortMembers();
  const recommended = events.filter((e) => e.id !== upcoming.id).slice(0, 4);
  const doneCount = state.goalDone.length;

  const toggleGoal = (id: string) =>
    update((s) => ({
      ...s,
      goalDone: s.goalDone.includes(id) ? s.goalDone.filter((g) => g !== id) : [...s.goalDone, id],
    }));

  return (
    <Screen>
      <header className="pt-6 pb-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-semibold text-muted-foreground">Good morning, Alex</p>
            <h1 className="mt-1 text-[26px] leading-tight font-extrabold">
              Week 4 with the Saturday Crew
            </h1>
          </div>
          <Link to="/profile" aria-label="Open your profile">
            <Avatar src={you.photo} name={you.name} size={44} />
          </Link>
        </div>
      </header>

      {/* Upcoming volunteer day */}
      <SectionTitle>Your next volunteer day</SectionTitle>
      <Link
        to="/volunteer-day"
        className="block rounded-2xl border border-primary bg-primary p-5 transition-colors hover:bg-primary/95 active:bg-primary/90"
      >
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent px-2.5 py-1 text-[12px] font-bold text-accent-foreground">
            In 3 days
          </span>
          <span className="text-[13px] font-semibold text-primary-foreground/80">
            {upcomingOrg.name}
          </span>
        </div>
        <h3 className="mt-3 text-[20px] leading-tight font-bold text-primary-foreground">
          {upcoming.title}
        </h3>
        <div className="mt-3 space-y-1.5 text-[14px] text-primary-foreground/90">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> {upcoming.date}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> {upcoming.time}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {upcoming.location}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between pt-4">
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((m) => (
              <Avatar key={m.id} src={m.photo} name={m.name} size={30} />
            ))}
          </div>
          <span className="flex items-center gap-1 text-[14px] font-bold text-primary-foreground">
            Open the day <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </Link>

      {/* Weekly goal */}
      <SectionTitle>This week's goal</SectionTitle>
      <Card>
        <div className="flex items-baseline justify-between">
          <p className="text-[15px] font-semibold">{doneCount} of 3 done</p>
          <p className="text-[13px] text-muted-foreground">Resets Sunday night</p>
        </div>
        <div className="mt-3 flex gap-1.5">
          {goals.map((g) => (
            <div
              key={g.id}
              className={cn(
                "h-2 flex-1 rounded-full",
                state.goalDone.includes(g.id) ? "bg-accent" : "bg-secondary",
              )}
            />
          ))}
        </div>
        <ul className="mt-4 space-y-1">
          {goals.map((g) => {
            const done = state.goalDone.includes(g.id);
            return (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => toggleGoal(g.id)}
                  aria-pressed={done}
                  className="flex w-full items-center gap-3 rounded-xl py-2.5 text-left transition-colors hover:bg-secondary active:bg-secondary"
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                      done ? "bg-primary" : "bg-secondary",
                    )}
                  >
                    {done && (
                      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-primary-foreground">
                        <path d="M7.6 14.2 3.8 10.4l1.4-1.4 2.4 2.4 6.2-6.2 1.4 1.4z" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[15px]",
                      done ? "text-muted-foreground line-through" : "text-foreground",
                    )}
                  >
                    {g.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {doneCount === 3 && (
          <p className="mt-2 rounded-xl bg-accent-soft px-3 py-2.5 text-[13px] font-semibold text-accent-foreground">
            That's the whole week. Four Saturdays running now.
          </p>
        )}
      </Card>

      {/* Cohort */}
      <SectionTitle action="Open cohort" to="/cohort">
        Your cohort
      </SectionTitle>
      <Link
        to="/cohort"
        className="block rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 active:bg-secondary"
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-bold">{cohort.name}</h3>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {members.length} members · {cohort.daysTogether} days together
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {members.map((m) => (
            <div key={m.id} className="w-14 shrink-0 text-center">
              <Avatar src={m.photo} name={m.name} size={48} className="mx-auto" />
              <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">
                {m.name.split(" ")[0]}
              </p>
            </div>
          ))}
        </div>
      </Link>

      {/* Match nudge */}
      <Link
        to="/match"
        className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-accent-soft p-4 transition-colors hover:border-accent active:bg-accent-soft/70"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent">
          <Sparkles className="h-5 w-5 text-accent-foreground" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold">Meet Maya before Saturday</span>
          <span className="block text-[13px] text-muted-foreground">
            One new cohort member. Three things in common.
          </span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>

      {/* Recommended events */}
      <SectionTitle action="See all" to="/organizations">
        Recommended for you
      </SectionTitle>
      <div className="space-y-3">
        {recommended.map((e) => {
          const org = orgById(e.orgId);
          const joined = state.joinedEventIds.includes(e.id);
          return (
            <Link
              key={e.id}
              to="/events/$eventId"
              params={{ eventId: e.id }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 active:bg-secondary"
            >
              <OrgMark cover={org.cover} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{e.title}</p>
                <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                  {org.name} · {e.dateShort}
                </p>
                <div className="mt-2 flex gap-1.5">
                  <Chip tone="green">{org.cause}</Chip>
                  {joined ? (
                    <Chip tone="yellow">You're going</Chip>
                  ) : (
                    <Chip>
                      <Users className="h-3 w-3" />
                      {e.spotsTotal - e.spotsFilled} spots left
                    </Chip>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </div>

      <div className="mt-6">
        <Button asChild variant="quiet" size="lg" className="w-full">
          <Link to="/invite">Invite someone to volunteer with you</Link>
        </Button>
      </div>
    </Screen>
  );
}