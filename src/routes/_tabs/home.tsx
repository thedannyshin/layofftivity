import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CalendarDays, ChevronRight, MapPin } from "lucide-react";
import { Avatar, Card, Chip, ListGroup, Ring, Screen, ScreenHero, SectionTitle, tapCard, tapRow } from "@/components/app/Shell";
import { orgById } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/home")({
  head: () => ({
    meta: [
      { title: "Your week — Layofftivity" },
      {
        name: "description",
        content:
          "See your next volunteer day, your group, this week's goals, and activities recommended for you.",
      },
      { property: "og:title", content: "Your week on Layofftivity" },
      {
        property: "og:description",
        content: "Your group, your next volunteer day, and this week's goals in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const app = useApp();
  const {
    state,
    badges,
    profile,
    matches,
    guests,
    primaryEvent,
    isJoined,
  } = app;
  const org = orgById(primaryEvent.orgId);
  const joined = isJoined(primaryEvent.id);
  const earnedBadges = badges.filter((b) => b.earned);

  const goals = [
    {
      id: "join",
      label: "Join a volunteer activity",
      done: state.joinedEventIds.length > 0,
      to: "/organizations" as const,
    },
    {
      id: "shift",
      label: "Show up for one shift",
      done: state.checkedInEventIds.length > 0,
      to: "/volunteer-day" as const,
    },
    {
      id: "reflect",
      label: "Write one reflection",
      done: state.reflections.length > 0,
      to: "/reflection" as const,
    },
  ];
  const doneCount = goals.filter((g) => g.done).length;

  return (
    <Screen>
      <ScreenHero title={`Hello${profile.firstName ? `, ${profile.firstName}` : ""}`} />

      <SectionTitle>Upcoming volunteer day</SectionTitle>
      <Link
        to={joined ? "/volunteer-day" : "/events/$eventId"}
        params={joined ? undefined : { eventId: primaryEvent.id }}
        className="block rounded-2xl bg-primary p-5 transition-colors hover:bg-primary/95 active:bg-primary/90"
      >
        <div className="flex flex-wrap items-center gap-2">
          {joined && (
            <span className="rounded-lg border border-primary-foreground/50 px-2.5 py-1 text-[12px] font-bold text-primary-foreground">
              You're going
            </span>
          )}
          <span className="text-[13px] font-semibold text-primary-foreground/80">{org.name}</span>
        </div>
        <h3 className="mt-3 text-[20px] leading-tight font-bold text-primary-foreground">
          {primaryEvent.title}
        </h3>
        <div className="mt-3 space-y-1 text-[14px] text-primary-foreground/90">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {primaryEvent.dateShort}, {primaryEvent.time}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{primaryEvent.location}</span>
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between pt-4">
          <div className="flex -space-x-2">
            {matches.map((m) => (
              <Avatar key={m.id} src={m.photo} name={m.name} size={30} />
            ))}
            {guests.map((g) => (
              <Avatar key={g.id} name={g.name} size={30} />
            ))}
          </div>
          <span className="flex items-center gap-1 text-[14px] font-bold text-primary-foreground">
            {joined ? "Open the day" : "See the details"} <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </Link>

      <div className="mt-8 mb-3 flex items-center justify-between gap-3">
        <h2 className="lo-display text-[18px]">This week</h2>
        <Ring value={doneCount} total={goals.length} size={44} />
      </div>
      <ListGroup>
        {goals.map((g) => (
              <Link
                key={g.id}
                to={g.to}
                className={tapRow}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                    g.done ? "bg-primary" : "bg-secondary",
                  )}
                >
                  {g.done && (
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-primary-foreground">
                      <path d="M7.6 14.2 3.8 10.4l1.4-1.4 2.4 2.4 6.2-6.2 1.4 1.4z" />
                    </svg>
                  )}
                </span>
                <span
                  className={cn(
                    "flex-1 text-[15px]",
                    g.done ? "text-muted-foreground line-through" : "text-foreground",
                  )}
                >
                  {g.label}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
        ))}
      </ListGroup>
        {doneCount === goals.length && (
          <p className="mt-3 rounded-xl bg-accent-soft px-3 py-2.5 text-[13px] font-semibold text-accent-foreground">
            That's the whole week. {app.daysCompleted} volunteer{" "}
            {app.daysCompleted === 1 ? "day" : "days"} in.
          </p>
        )}

      <SectionTitle>Badges</SectionTitle>
      <Link to="/profile/badges" className={`${tapCard} block`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
              <Award className="h-5 w-5 text-primary" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold">
                {earnedBadges.length} of {badges.length} earned
              </p>
              <p className="truncate text-[13px] text-muted-foreground">
                {earnedBadges.length
                  ? earnedBadges
                      .slice(0, 2)
                      .map((badge) => badge.name)
                      .join(", ")
                  : "Your volunteer milestones live here."}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </div>
      </Link>

      <SectionTitle>Preferences</SectionTitle>
      <Card>
        <div className="flex flex-wrap gap-2">
          {state.onboarding.causes.map((cause) => (
            <Chip key={cause}>{cause}</Chip>
          ))}
          {state.onboarding.availability.map((availability) => (
            <Chip key={availability}>{availability}</Chip>
          ))}
          {state.onboarding.interests.map((interest) => (
            <Chip key={interest}>{interest}</Chip>
          ))}
        </div>
      </Card>
    </Screen>
  );
}
