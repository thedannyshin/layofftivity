import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { CalendarDays, ChevronRight, MapPin, Search } from "lucide-react";
import { OrgMark } from "@/components/app/OrgMark";
import { Button } from "@/components/ui/button";
import { Chip, ListGroup, Screen, ScreenHero, SectionTitle, staticCard, tapPill, tapPillActive, tapRow } from "@/components/app/Shell";
import { causeOptions, events, orgById } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/organizations/")({
  head: () => ({
    meta: [
      { title: "Organizations near you — Layofftivity" },
      {
        name: "description",
        content:
          "Browse East Bay organizations hosting small-team volunteer shifts, from food banks to creek restoration.",
      },
      { property: "og:title", content: "Organizations on Layofftivity" },
      {
        property: "og:description",
        content: "Food security, environment, literacy, housing and more — all with small-team shifts.",
      },
    ],
  }),
  component: Organizations,
});

function Organizations() {
  const [query, setQuery] = React.useState("");
  const [cause, setCause] = React.useState<string | null>(null);

  const filtered = events.filter((e) => {
    const org = orgById(e.orgId);
    const matchesCause = !cause || org.cause === cause;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      e.title.toLowerCase().includes(q) ||
      org.name.toLowerCase().includes(q) ||
      org.cause.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q);
    return matchesCause && matchesQuery;
  });

  return (
    <Screen>
      <ScreenHero title="Explore" />

      <label className="flex items-center gap-2 rounded-xl bg-card px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search organizations or causes"
          className="h-12 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <FilterChip label="All" active={cause === null} onClick={() => setCause(null)} />
        {causeOptions.map((c) => (
          <FilterChip
            key={c}
            label={c}
            active={cause === c}
            onClick={() => setCause(cause === c ? null : c)}
          />
        ))}
      </div>

      <SectionTitle>
        {filtered.length} {filtered.length === 1 ? "event" : "events"}
      </SectionTitle>

      <ListGroup>
        {filtered.map((e) => {
          const org = orgById(e.orgId);
          return (
            <Link
              key={e.id}
              to="/events/$eventId"
              params={{ eventId: e.id }}
              className={tapRow}
            >
              <OrgMark cover={org.cover} alt={e.title} size={72} className="rounded-2xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{e.title}</p>
                <p className="mt-0.5 truncate text-[13px] text-muted-foreground">{org.name}</p>
                <div className="mt-2 space-y-1 text-[13px] text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {e.dateShort}, {e.time}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{e.location}</span>
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Chip tone="green">{org.cause}</Chip>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </ListGroup>

      {filtered.length === 0 && (
        <div className={`${staticCard} p-6 text-center`}>
            <p className="text-[15px] font-semibold">Nothing matches that yet</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Try a different cause, or clear the search to see all upcoming events.
            </p>
            <Button
              variant="quiet"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setCause(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
    </Screen>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={cn(active ? tapPillActive : tapPill)}>
      {label}
    </button>
  );
}