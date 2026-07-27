import { createFileRoute, Link } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { Card, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { volunteerHistory } from "@/lib/data";

export const Route = createFileRoute("/_tabs/profile/history")({
  head: () => ({
    meta: [
      { title: "Volunteer history — Layofftivity" },
      {
        name: "description",
        content: "Every shift you've volunteered, the organization, and whether your cohort was there.",
      },
      { property: "og:title", content: "Your volunteer history" },
      { property: "og:description", content: "Five shifts, twelve hours, one steady crew." },
    ],
  }),
  component: HistoryScreen,
});

function HistoryScreen() {
  const hours = volunteerHistory.reduce((s, h) => s + h.hours, 0);

  return (
    <Screen>
      <TopBar title="Volunteer history" subtitle={`${volunteerHistory.length} shifts · ${hours} hours`} back />

      <Card className="bg-primary-soft">
        <p className="text-[15px] leading-relaxed font-semibold text-primary">
          You've volunteered four Saturdays in a row with the same cohort. That's the pattern that
          builds belonging.
        </p>
      </Card>

      <SectionTitle>All shifts</SectionTitle>
      <ol className="relative space-y-4 pl-6 before:absolute before:top-2 before:bottom-2 before:left-0 before:w-px before:bg-secondary">
        {volunteerHistory.map((h) => (
          <li key={h.id} className="relative">
            <span className="absolute top-1.5 -left-[31px] h-3 w-3 rounded-full bg-primary" />
            <p className="text-[12px] font-bold text-muted-foreground uppercase">{h.date}</p>
            <p className="text-[15px] font-bold">{h.title}</p>
            <p className="text-[13px] text-muted-foreground">{h.org}</p>
            <div className="mt-1.5 flex gap-1.5">
              <Chip>{h.hours} hours</Chip>
              {h.withCohort && (
                <Chip tone="green">
                  <Users className="h-3 w-3" />
                  With your cohort
                </Chip>
              )}
            </div>
          </li>
        ))}
      </ol>

      <Button asChild size="lg" className="mt-6 w-full">
        <Link to="/organizations">Find your next shift</Link>
      </Button>
    </Screen>
  );
}