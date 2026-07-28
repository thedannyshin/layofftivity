import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, MapPin, Sparkles, Users } from "lucide-react";
import { Avatar, Chip, Deck, ListGroup, Ring, Screen, SectionTitle, deckCard, tapCard, tapCardAccent, tapRow } from "@/components/app/Shell";
import { CoverPhoto } from "@/components/app/OrgMark";
import { Button } from "@/components/ui/button";
import { events, orgById } from "@/lib/data";
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
  const { state, profile, initials, matches, guests, primaryEvent, week, thread, isJoined } = app;
  const org = orgById(primaryEvent.orgId);
  const joined = isJoined(primaryEvent.id);
  const recommended = events.filter((e) => e.id !== primaryEvent.id).slice(0, 4);

  const goals = [
    {
      id: "join",
      label: "Join a volunteer activity",
      done: state.joinedEventIds.length > 0,
      to: "/organizations" as const,
    },
    {
      id: "message",
      label: "Say something in the group chat",
      done: thread("group").some((m) => m.personId === "you"),
      to: "/cohort-chat" as const,
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
      <header className="pt-6 pb-1">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-muted-foreground">
              Hi{profile.firstName ? `, ${profile.firstName}` : ""}
            </p>
            <h1 className="mt-1 text-[26px] leading-tight font-extrabold">
              Week {week} with your {org.cause.toLowerCase()} group
            </h1>
          </div>
          <Link to="/profile" aria-label="Open your profile">
            <Avatar src={profile.photo} name={app.fullName} initials={initials} size={44} />
          </Link>
        </div>
      </header>

      <SectionTitle>{joined ? "Your next volunteer day" : "Your first volunteer day"}</SectionTitle>
      <Link
        to={joined ? "/volunteer-day" : "/events/$eventId"}
        params={joined ? undefined : { eventId: primaryEvent.id }}
        className="block rounded-2xl bg-primary p-5 transition-colors hover:bg-primary/95 active:bg-primary/90"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg border border-primary-foreground/50 px-2.5 py-1 text-[12px] font-bold text-primary-foreground">
            {joined ? "You're going" : "Matched to you"}
          </span>
          <span className="text-[13px] font-semibold text-primary-foreground/80">{org.name}</span>
        </div>
        <h3 className="mt-3 text-[20px] leading-tight font-bold text-primary-foreground">
          {primaryEvent.title}
        </h3>
        <div className="mt-3 space-y-1 text-[14px] text-primary-foreground/90">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {primaryEvent.dateShort} · {primaryEvent.time}
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

      <SectionTitle action="Open group" to="/cohort">
        Your group
      </SectionTitle>
      <Link
        to="/cohort"
        className={`${tapCard} block`}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-bold">{org.cause} group</h3>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {state.matchGreeted.length
                ? `${matches.length + 1 + guests.length} people · ${app.daysCompleted} day${app.daysCompleted === 1 ? "" : "s"} together`
                : `Say hello to ${matches.map((m) => m.name.split(" ")[0]).join(" and ")}`}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {matches.map((m) => (
            <div key={m.id} className="w-14 shrink-0 text-center">
              <Avatar src={m.photo} name={m.name} size={48} className="mx-auto" />
              <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">
                {m.name.split(" ")[0]}
              </p>
            </div>
          ))}
          {guests.map((g) => (
            <div key={g.id} className="w-14 shrink-0 text-center">
              <Avatar name={g.name} size={48} className="mx-auto" />
              <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">Guest</p>
            </div>
          ))}
        </div>
      </Link>
    </Screen>
  );
}
