import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { Camera, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Card, Screen, ScreenHero, SectionTitle, tapPill, tapPillActive } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { moods } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/reflection")({
  head: () => ({
    meta: [
      { title: "Reflect on today — Layofftivity" },
      {
        name: "description",
        content:
          "A short private journal after your volunteer day: how it felt, what you're grateful for, and photos from the shift.",
      },
      { property: "og:title", content: "Reflect on your volunteer day" },
      { property: "og:description", content: "Mood, gratitude, and a few lines. Private to you." },
    ],
  }),
  component: ReflectionScreen,
});

function ReflectionScreen() {
  const { state, update, primaryEvent } = useApp();
  const navigate = useNavigate();
  const [mood, setMood] = React.useState("");
  const [note, setNote] = React.useState("");
  const [gratitude, setGratitude] = React.useState("");
  const [photos, setPhotos] = React.useState(0);

  const save = () => {
    update((s) => ({
      ...s,
      reflections: [
        {
          id: `r${Date.now()}`,
          eventId: primaryEvent.id,
          date: primaryEvent.date,
          mood,
          gratitude: gratitude || "—",
          note,
          photos,
        },
        ...s.reflections,
      ],
    }));
    toast.success("Reflection saved", { description: "Only you can see this." });
    navigate({ to: "/continue-together" });
  };

  return (
    <div className="min-h-screen bg-background pb-40">
      <Screen>
        <ScreenHero title="Reflection" back />

        <SectionTitle>Mood</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              aria-pressed={mood === m}
              className={
                mood === m
                  ? tapPillActive
                  : "inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-muted-foreground/35 bg-transparent px-3.5 py-2 text-[13px] font-semibold text-muted-foreground cursor-pointer transition-colors duration-[120ms] hover:bg-card active:bg-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft"
              }
            >
              {m}
            </button>
          ))}
        </div>

        <SectionTitle>Journal</SectionTitle>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={6}
          placeholder="Write about your shift"
          className="w-full resize-none rounded-2xl bg-card p-4 text-[16px] leading-relaxed outline-none focus:ring-2 focus:ring-primary/30"
        />

        <SectionTitle>Gratitude</SectionTitle>
        <input
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="Optional"
          className="h-12 w-full rounded-xl bg-card px-4 text-[16px] outline-none focus:ring-2 focus:ring-primary/30"
        />

        <SectionTitle>Photos</SectionTitle>
        <div className="flex gap-3">
          {Array.from({ length: photos }).map((_, i) => (
            <div
              key={i}
              className="relative flex h-20 w-20 items-center justify-center rounded-xl bg-primary-soft"
            >
              <Camera className="h-5 w-5 text-primary" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => setPhotos((p) => p - 1)}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-card"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photos < 3 && (
            <button
              type="button"
              onClick={() => setPhotos((p) => p + 1)}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl bg-primary text-primary-foreground"
            >
              <Camera className="h-5 w-5" />
              <span className="text-[11px] font-semibold">Add</span>
            </button>
          )}
        </div>

        {state.reflections.length > 0 && (
          <p className="mt-8 text-[13px] text-muted-foreground">
            <Link to="/profile/reflections" className="font-bold text-primary underline">
              View past reflections
            </Link>
          </p>
        )}
      </Screen>

      <div className="ios-chrome ios-hairline-t fixed inset-x-0 z-20"
        style={{ bottom: "max(calc(49px + env(safe-area-inset-bottom)), var(--ios-keyboard-inset, 0px))" }}>
        <div className="mx-auto w-full max-w-[430px] px-5 py-4">
          <Button size="lg" className="w-full" disabled={!mood || !note.trim()} onClick={save}>
            <Check />
            Save reflection
          </Button>
        </div>
      </div>
    </div>
  );
}