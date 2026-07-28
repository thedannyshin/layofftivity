import { createFileRoute, Link } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { Card, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { eventById, orgById } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_tabs/profile/history")({
  head: () => ({
    meta: [
      { title: "Volunteer history — Layofftivity" },
      {
        name: "description",
        content: "Every shift you've volunteered, the organization, and who was there with you.",
      },
      { property: "og:title", content: "Your volunteer history" },
      { property: "og:description", content: "Shifts, hours, and the group you showed up with." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryScreen,
});

function HistoryScreen() {
  const { state, hours, daysCompleted } = useApp();
  const items = [...state.completed].reverse();

  return (
    <Screen>
      <TopBar
        title="Volunteer history"
        subtitle={`${daysCompleted} shift${daysCompleted === 1 ? "" : "s"} · ${hours} hours`}
        back
      />

      {daysCompleted === 0 ? (
        <Card>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Nothing here yet. Once you check in and finish a shift, it lands on this timeline.
          </p>
          <Button asChild className="mt-4 w-full">
            <Link to="/organizations">Find your first activity</Link>
          </Button>
        </Card>
      ) : (
        <>
          <Card className="bg-primary-soft">
            <p className="text-[15px] leading-relaxed font-semibold text-primary">
              {daysCompleted === 1
                ? "One shift down. The second one is the one that builds the habit."
                : `${daysCompleted} shifts with the same people. That's the pattern that builds belonging.`}
            </p>
          </Card>

          <SectionTitle>All shifts</SectionTitle>
          <ol className="relative space-y-4 pl-6 before:absolute before:top-2 before:bottom-2 before:left-0 before:w-px before:bg-secondary">
            {items.map((h) => {
              const event = eventById(h.eventId);
              const org = orgById(event.orgId);
              return (
                <li key={h.id} className="relative">
                  <span className="absolute top-1.5 -left-[31px] h-3 w-3 rounded-full bg-primary" />
                  <p className="text-[12px] font-bold text-muted-foreground uppercase">{h.date}</p>
                  <p className="text-[15px] font-bold">{event.title}</p>
                  <p className="text-[13px] text-muted-foreground">{org.name}</p>
                  <div className="mt-1.5 flex gap-2">
                    <Chip>{h.hours} hours</Chip>
                    <Chip tone="green">
                      <Users className="h-3 w-3" /> With your group
                    </Chip>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </Screen>
  );
}
