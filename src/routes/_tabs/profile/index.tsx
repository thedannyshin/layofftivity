import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookHeart,
  ChevronRight,
  History,
  RotateCcw,
  UserRound,
} from "lucide-react";
import { Avatar, Card, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { badges, cohort, volunteerHistory, you } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_tabs/profile/")({
  head: () => ({
    meta: [
      { title: "Your profile — Layofftivity" },
      {
        name: "description",
        content:
          "Your friends, volunteer history, reflections, and badges from showing up with the same cohort.",
      },
      { property: "og:title", content: "Your Layofftivity profile" },
      { property: "og:description", content: "Hours volunteered, reflections written, people met." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { state, update } = useStore();
  const navigate = useNavigate();
  const hours = volunteerHistory.reduce((sum, h) => sum + h.hours, 0);
  const earned = badges.filter((b) => b.earned).length;

  const restart = () => {
    update((s) => ({ ...s, onboarding: { ...s.onboarding, complete: false } }));
    navigate({ to: "/" });
  };

  return (
    <Screen>
      <TopBar title="Profile" />

      <div className="flex items-center gap-4">
        <Avatar src={you.photo} name={you.name} size={72} />
        <div className="min-w-0">
          <h2 className="text-[20px] font-extrabold">{you.name}</h2>
          <p className="text-[13px] text-muted-foreground">{you.formerRole}</p>
          <p className="text-[13px] text-muted-foreground">{you.city}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat value={`${hours}`} label="Hours" />
        <Stat value={`${volunteerHistory.length}`} label="Shifts" />
        <Stat value={`${state.reflections.length}`} label="Reflections" />
      </div>

      <SectionTitle>Your cohort</SectionTitle>
      <Link
        to="/cohort"
        className="flex items-center gap-3 rounded-2xl bg-card p-4 transition-colors active:bg-secondary"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold">{cohort.name}</p>
          <p className="text-[13px] text-muted-foreground">{cohort.formed}</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>

      <SectionTitle>Everything else</SectionTitle>
      <div className="space-y-3">
        <Row to="/profile/friends" icon={<UserRound className="h-5 w-5 text-primary" />} title="Friends" detail="7 people you've volunteered beside" />
        <Row to="/profile/history" icon={<History className="h-5 w-5 text-primary" />} title="Volunteer history" detail={`${volunteerHistory.length} shifts · ${hours} hours`} />
        <Row to="/profile/reflections" icon={<BookHeart className="h-5 w-5 text-primary" />} title="Reflection history" detail={`${state.reflections.length} private entries`} />
        <Row to="/profile/badges" icon={<Award className="h-5 w-5 text-primary" />} title="Badges" detail={`${earned} of ${badges.length} earned`} />
      </div>

      <SectionTitle>What you told us</SectionTitle>
      <Card>
        <div className="flex flex-wrap gap-2">
          {(state.onboarding.causes.length ? state.onboarding.causes : ["Food security"]).map((c) => (
            <Chip key={c} tone="green">
              {c}
            </Chip>
          ))}
          {(state.onboarding.availability.length
            ? state.onboarding.availability
            : ["Saturday mornings"]
          ).map((a) => (
            <Chip key={a} tone="yellow">
              {a}
            </Chip>
          ))}
          {(state.onboarding.interests.length ? state.onboarding.interests : you.interests).map(
            (i) => (
              <Chip key={i}>{i}</Chip>
            ),
          )}
        </div>
        <Button variant="quiet" size="lg" className="mt-4 w-full" onClick={restart}>
          <RotateCcw />
          Redo my preferences
        </Button>
      </Card>

      <div className="mt-3">
        <Button asChild variant="quiet" size="lg" className="w-full">
          <Link to="/invite">Invite someone</Link>
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
  icon: React.ReactNode;
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