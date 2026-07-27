import { Apple, Trees, BookOpen, Sprout, PawPrint, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

const marks: Record<string, { icon: typeof Apple; tone: string }> = {
  harvest: { icon: Apple, tone: "bg-primary-soft text-primary" },
  creek: { icon: Trees, tone: "bg-primary-soft text-primary" },
  books: { icon: BookOpen, tone: "bg-accent-soft text-accent-foreground" },
  garden: { icon: Sprout, tone: "bg-primary-soft text-primary" },
  paws: { icon: PawPrint, tone: "bg-accent-soft text-accent-foreground" },
  keys: { icon: KeyRound, tone: "bg-secondary text-foreground" },
};

export function OrgMark({ cover, size = 48 }: { cover: string; size?: number }) {
  const mark = marks[cover] ?? marks.harvest;
  const Icon = mark.icon;
  return (
    <div
      style={{ width: size, height: size }}
      className={cn("flex shrink-0 items-center justify-center rounded-xl", mark.tone)}
    >
      <Icon style={{ width: size * 0.46, height: size * 0.46 }} />
    </div>
  );
}