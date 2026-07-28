import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Car, Medal, Repeat, Sunrise, UserPlus } from "lucide-react";
import { Ring, Screen, SectionTitle, TopBar, staticCard, staticCardAccent } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const icons = {
  sunrise: Sunrise,
  repeat: Repeat,
  car: Car,
  book: BookOpen,
  userplus: UserPlus,
  medal: Medal,
};

export const Route = createFileRoute("/_tabs/profile/badges")({
  head: () => ({
    meta: [
      { title: "Badges — Layofftivity" },
      {
        name: "description",
        content: "Quiet milestones for consistency: first Saturday, three in a row, ride giver, and more.",
      },
      { property: "og:title", content: "Your Layofftivity badges" },
      { property: "og:description", content: "Milestones for showing up, not for showing off." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Badges,
});

function Badges() {
  const { badges } = useApp();
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <Screen>
      <TopBar title="Badges" back />
      <div className="-mt-2 mb-2">
        <Ring value={earned.length} total={badges.length} size={48} label="earned" />
      </div>

      {earned.length > 0 && <SectionTitle>Earned</SectionTitle>}
      <div className="grid grid-cols-2 gap-3">
        {earned.map((b) => {
          const Icon = icons[b.icon as keyof typeof icons];
          return (
            <div key={b.id} className={staticCardAccent}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                <Icon className="h-5 w-5 text-accent-foreground" />
              </span>
              <p className="mt-3 text-[15px] leading-tight font-bold">{b.name}</p>
            </div>
          );
        })}
      </div>

      <SectionTitle>Still ahead</SectionTitle>
      <div className="grid grid-cols-3 gap-x-3 gap-y-5">
        {locked.map((b) => {
          const Icon = icons[b.icon as keyof typeof icons];
          return (
            <div key={b.id} className={cn(staticCard, "text-center opacity-70")} title={b.detail}>
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </span>
              <p className="mt-2 text-[12px] leading-tight font-bold">{b.name}</p>
            </div>
          );
        })}
      </div>

      <Button asChild size="lg" className="mt-6 w-full">
        <Link to="/invite">Invite someone and earn Brought Someone</Link>
      </Button>
    </Screen>
  );
}