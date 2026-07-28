import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { Card, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_tabs/profile/reflections")({
  head: () => ({
    meta: [
      { title: "Reflection history — Layofftivity" },
      {
        name: "description",
        content: "Your private journal after each volunteer day: mood, gratitude, and what stayed with you.",
      },
      { property: "og:title", content: "Your reflection history" },
      { property: "og:description", content: "Private entries, only visible to you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reflections,
});

function Reflections() {
  const { state } = useApp();

  return (
    <Screen>
      <TopBar title="Reflection history" subtitle="Private to you" back />

      {state.reflections.length === 0 ? (
        <Card>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            No reflections yet. After your first shift, take two minutes to write down how it felt.
          </p>
          <Button asChild className="mt-4 w-full">
            <Link to="/reflection">Write a reflection</Link>
          </Button>
        </Card>
      ) : (
        <>
          <SectionTitle>{state.reflections.length} entries</SectionTitle>
          <div className="space-y-3">
            {state.reflections.map((r) => (
              <Card key={r.id}>
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-bold">{r.date}</p>
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent-foreground">
                    {r.mood}
                  </span>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed">{r.note}</p>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  Grateful for: {r.gratitude}
                </p>
                {r.photos > 0 && (
                  <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
                    <Camera className="h-3.5 w-3.5" />
                    {r.photos} photo{r.photos === 1 ? "" : "s"}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </Screen>
  );
}
