import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { Card, Screen, ScreenHero, SectionTitle, tapPill } from "@/components/app/Shell";
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
      <ScreenHero
        title="Reflect"
        right={
          <Link
            to="/reflection"
            className={tapPill}
          >
            Write
          </Link>
        }
      />

      {state.reflections.length === 0 ? (
        <Card>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            No reflections yet.
          </p>
        </Card>
      ) : (
        <>
          <SectionTitle>{state.reflections.length} entries</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {state.reflections.map((r) => (
              <Card key={r.id} className="min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-bold leading-snug">{r.date}</p>
                  <span className="shrink-0 rounded-lg border border-muted-foreground/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                    {r.mood}
                  </span>
                </div>
                <p className="mt-2 line-clamp-4 text-[14px] leading-relaxed">{r.note}</p>
                <p className="mt-2 line-clamp-2 text-[12px] text-muted-foreground">
                  Grateful for: {r.gratitude}
                </p>
                {r.photos > 0 && (
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
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
