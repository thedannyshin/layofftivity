import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Award, BookHeart, ChevronRight, History, RotateCcw, UserRound } from "lucide-react";
import { Avatar, Card, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { orgById } from "@/lib/data";
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
  const { state, update, profile, initials, fullName, matches, guests, badges, hours, daysCompleted } =
    app;
  const navigate = useNavigate();
  const org = orgById(app.primaryEvent.orgId);
  const earned = badges.filter((b) => b.earned).length;

  const restart = () => {
    update((s) => ({ ...s, onboarding: { ...s.onboarding, complete: false } }));
    navigate({ to: "/" });
  };

  return (
    <Screen>
      <TopBar title="Profile" />

      <div className="flex items-center gap-4">
        <Avatar src={profile.photo} name={fullName} initials={initials} size={72} />
        <div className="min-w-0">
          <h2 className="text-[20px] font-extrabold">{fullName}</h2>
          <p className="text-[13px] text-muted-foreground">
            {state.onboarding.laidOff || "New here"}
          </p>
          <p className="text-[13px] text-muted-foreground">{state.onboarding.location}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat value={`${hours}`} label="Hours" />
        <Stat value={`${daysCompleted}`} label="Shifts" />
        <Stat value={`${state.reflections.length}`} label="Reflections" />
      </div>

      <SectionTitle>Your group</SectionTitle>
      <Link
        to="/cohort"
        className="flex items-center gap-3 rounded-2xl bg-card p-4 transition-colors active:bg-secondary"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold">{org.cause} group</p>
          <p className="text-[13px] text-muted-foreground">
            {matches.length + 1 + guests.length} people · {daysCompleted} day
            {daysCompleted === 1 ? "" : "s"} together
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>

      <SectionTitle>Everything else</SectionTitle>
      <div className="space-y-3">
        <Row
          to="/profile/friends"
          icon={<UserRound className="h-5 w-5 text-primary" />}
          title="People"
          detail={`${matches.length + guests.length} in your group`}
        />
        <Row
          to="/profile/history"
          icon={<History className="h-5 w-5 text-primary" />}
          title="Volunteer history"
          detail={`${daysCompleted} shift${daysCompleted === 1 ? "" : "s"} · ${hours} hours`}
        />
        <Row
          to="/profile/reflections"
          icon={<BookHeart className="h-5 w-5 text-primary" />}
          title="Reflection history"
          detail={`${state.reflections.length} private ${state.reflections.length === 1 ? "entry" : "entries"}`}
        />
        <Row
          to="/profile/badges"
          icon={<Award className="h-5 w-5 text-primary" />}
          title="Badges"
          detail={`${earned} of ${badges.length} earned`}
        />
      </div>

      <SectionTitle>What you told us</SectionTitle>
      <Card>
        <div className="flex flex-wrap gap-2">
          {state.onboarding.causes.map((c) => (
            <Chip key={c} tone="green">
              {c}
            </Chip>
          ))}
          {state.onboarding.availability.map((a) => (
            <Chip key={a} tone="yellow">
              {a}
            </Chip>
          ))}
          {state.onboarding.interests.map((i) => (
            <Chip key={i}>{i}</Chip>
          ))}
        </div>
        <Button variant="quiet" size="lg" className="mt-4 w-full" onClick={restart}>
          <RotateCcw />
          Redo my preferences
        </Button>
      </Card>

      <div className="mt-3">
        <Button asChild variant="quiet" size="lg" className="w-full">
          <Link to="/invite">
            {state.invites.length ? "Manage your invitation" : "Invite a friend"}
          </Link>
        </Button>
      </div>
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 text-center">
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
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl bg-card p-4 transition-colors active:bg-secondary"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold">{title}</span>
        <span className="block text-[13px] text-muted-foreground">{detail}</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
