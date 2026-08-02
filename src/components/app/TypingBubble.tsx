import type { Person } from "@/lib/data";
import { Avatar } from "@/components/app/Shell";
import { cn } from "@/lib/utils";

export function TypingBubble({
  person,
  showName = false,
}: {
  person: Person;
  showName?: boolean;
}) {
  return (
    <div className="flex gap-2" aria-live="polite" aria-label={`${person.name} is typing`}>
      <Avatar src={person.photo} name={person.name} size={30} />
      <div className="max-w-[76%] text-left">
        {showName && (
          <p className="mb-0.5 text-[12px] font-bold text-muted-foreground">
            {person.name.split(" ")[0]}
          </p>
        )}
        <div className="inline-flex items-center gap-1.5 rounded-2xl bg-card px-4 py-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-muted-foreground/55",
                "animate-[typing-dot_1.05s_ease-in-out_infinite]",
              )}
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
