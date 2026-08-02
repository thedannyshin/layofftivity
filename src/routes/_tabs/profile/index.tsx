import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Award, BookHeart, ChevronRight, History, UserRound } from "lucide-react";
import { Avatar, Card, Chip, ListGroup, Screen, ScreenHero, SectionTitle, staticCard, tapCard, tapRow } from "@/components/app/Shell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_tabs/profile/")({
  head: () => ({
    meta: [
      { title: "Your profile — Layofftivity" },
      {
        name: "description",
        content:
          "Your group, volunteer history, reflections, and badges from showing up with the same people.",
      },
      { property: "og:title", content: "Your Layofftivity profile" },
      { property: "og:description", content: "Hours volunteered, reflections written, people met." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const app = useApp();
  const { state, profile, initials, fullName, matches, guests, badges, hours, daysCompleted } =
    app;
  const earned = badges.filter((b) => b.earned).length;

  return (
    <Screen>
      <ScreenHero
        title={fullName}
        right={<Avatar src={profile.photo} name={fullName} initials={initials} size={56} />}
      />

      <div className="mt-2 grid grid-cols-3 gap-3">
        <Stat value={`${hours}`} label="Hours" />
        <Stat value={`${daysCompleted}`} label="Shifts" />
        <Stat value={`${state.reflections.length}`} label="Reflections" />
      </div>

      <SectionTitle>Everything else</SectionTitle>
      <ListGroup>
        <Row
          to="/profile/friends"
          icon={<UserRound className="h-5 w-5 text-primary" />}
          title="People"
          detail={`${matches.length + guests.length}`}
        />
        <Row
          to="/profile/history"
          icon={<History className="h-5 w-5 text-primary" />}
          title="Volunteer history"
          detail={`${daysCompleted} shifts, ${hours}h`}
        />
        <Row
          to="/profile/reflections"
          icon={<BookHeart className="h-5 w-5 text-primary" />}
          title="Reflection history"
          detail={`${state.reflections.length}`}
        />
        <Row
          to="/profile/badges"
          icon={<Award className="h-5 w-5 text-primary" />}
          title="Badges"
          detail={`${earned}/${badges.length}`}
        />
      </ListGroup>

      <SectionTitle>What you told us</SectionTitle>
      <Card>
        <div className="flex flex-wrap gap-2">
          {state.onboarding.causes.map((c) => (
            <Chip key={c} tone="green">
              {c}
            </Chip>
          ))}
          {state.onboarding.availability.map((a) => (
            <Chip key={a}>
              {a}
            </Chip>
          ))}
          {state.onboarding.interests.map((i) => (
            <Chip key={i}>{i}</Chip>
          ))}
        </div>
      </Card>
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className={`${staticCard} p-3 text-center`}>
      <p className="text-[22px] leading-none font-extrabold">{value}</p>
      <p className="mt-1 text-[12px] font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({
  to,
  icon,
  title,
  detail,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <Link to={to} className={tapRow}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-[15px] font-bold">{title}</span>
      <span className="shrink-0 text-[14px] font-bold text-muted-foreground tabular-nums">
        {detail}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
