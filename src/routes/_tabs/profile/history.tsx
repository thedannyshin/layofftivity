import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, Meta, Screen, ScreenHero, SectionTitle } from "@/components/app/Shell";
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
  const { state, daysCompleted } = useApp();
  const items = [...state.completed].reverse();

  return (
    <Screen>
      <ScreenHero title="Volunteer history" back />

      {daysCompleted === 0 ? (
        <Card>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            No volunteer history yet.
          </p>
          <Button asChild className="mt-4 w-full">
            <Link to="/organizations">Browse activities</Link>
          </Button>
        </Card>
      ) : (
        <>
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
                  <Meta items={[org.name, `${h.hours}h`, "With your group"]} />
                </li>
              );
            })}
          </ol>
        </>
      )}
    </Screen>
  );
}
