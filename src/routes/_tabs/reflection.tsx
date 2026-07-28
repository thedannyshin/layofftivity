import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { Camera, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Card, Screen, SectionTitle, TopBar, tapPill, tapPillActive } from "@/components/app/Shell";
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
        <TopBar title="How was today?" subtitle="Private. Nobody in your group sees this." back />

        <SectionTitle>Mood</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              aria-pressed={mood === m}
              className={mood === m ? tapPillActive : tapPill}
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
          placeholder="What stayed with you from this morning?"
          className="w-full resize-none rounded-2xl bg-card p-4 text-[15px] leading-relaxed outline-none focus:ring-2 focus:ring-primary/30"
        />

        <SectionTitle>One thing you're grateful for</SectionTitle>
        <input
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="Someone, something small, anything"
          className="h-12 w-full rounded-xl bg-card px-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/30"
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
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl bg-secondary text-muted-foreground"
            >
              <Camera className="h-5 w-5" />
              <span className="text-[11px] font-semibold">Add</span>
            </button>
          )}
        </div>

        <SectionTitle>Your recent reflections</SectionTitle>
        <div className="space-y-3">
          {state.reflections.slice(0, 2).map((r) => (
            <Card key={r.id}>
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold">{r.date}</p>
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent-foreground">
                  {r.mood}
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{r.note}</p>
            </Card>
          ))}
        </div>
      </Screen>

      <div className="fixed inset-x-0 bottom-16 z-20 bg-card">
        <div className="mx-auto w-full max-w-[430px] px-5 py-4">
          <Button size="lg" className="w-full" disabled={!mood || !note.trim()} onClick={save}>
            <Check />
            Save reflection
          </Button>
          {(!mood || !note.trim()) && (
            <p className="mt-2 text-center text-[12px] text-muted-foreground">
              Pick a mood and write a line or two to save.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}