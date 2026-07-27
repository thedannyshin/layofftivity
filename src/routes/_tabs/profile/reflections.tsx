import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Heart } from "lucide-react";
import { Card, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_tabs/profile/reflections")({
  head: () => ({
    meta: [
      { title: "Reflection history — Layofftivity" },
      {
        name: "description",
        content: "Your private journal entries after each volunteer day: mood, gratitude, and notes.",
      },
      { property: "og:title", content: "Your reflection history" },
      { property: "og:description", content: "A private record of how the weeks have felt." },
    ],
  }),
  component: Reflections,
});

function Reflections() {
  const { state } = useStore();

  return (
    <Screen>
      <TopBar title="Reflection history" subtitle="Private to you" back />

      <SectionTitle>Entries</SectionTitle>
      <div className="space-y-3">
        {state.reflections.map((r) => (
          <Card key={r.id}>
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-bold">{r.date}</p>
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent-foreground">
                {r.mood}
              </span>
            </div>
            <p className="mt-2.5 text-[15px] leading-relaxed">{r.note}</p>
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary p-3">
              <Heart className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-[13px] text-muted-foreground">{r.gratitude}</p>
            </div>
            {r.photos > 0 && (
              <div className="mt-3 flex gap-2">
                {Array.from({ length: r.photos }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-soft"
                  >
                    <Camera className="h-4 w-4 text-primary" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Button asChild size="lg" className="mt-6 w-full">
        <Link to="/reflection">Write a new reflection</Link>
      </Button>
    </Screen>
  );
}