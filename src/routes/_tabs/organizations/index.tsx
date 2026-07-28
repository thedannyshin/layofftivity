import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { ChevronRight, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip, Deck, Screen, ScreenHero, SectionTitle, deckCard, staticCard, tapPill, tapPillActive } from "@/components/app/Shell";
import { CoverPhoto } from "@/components/app/OrgMark";
import { causeOptions, events, organizations, orgById } from "@/lib/data";
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

  const filtered = organizations.filter((o) => {
    const matchesCause = !cause || o.cause === cause;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q || o.name.toLowerCase().includes(q) || o.cause.toLowerCase().includes(q) ||
      o.neighborhood.toLowerCase().includes(q);
    return matchesCause && matchesQuery;
  });

  const soon = events.slice(0, 6);

  return (
    <Screen>
      <ScreenHero title="Explore" subtitle="East Bay" />

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
        {filtered.length} {filtered.length === 1 ? "organization" : "organizations"}
      </SectionTitle>

      <Deck>
        {filtered.map((o) => (
          <Link
            key={o.id}
            to="/organizations/$orgId"
            params={{ orgId: o.id }}
            className={deckCard}
          >
            <CoverPhoto cover={o.cover} alt={o.name} />
            <div className="p-4">
              <p className="text-[16px] leading-tight font-bold">{o.name}</p>
              <p className="mt-1 text-[13px] text-muted-foreground">{o.cause}</p>
              <p className="text-[13px] text-muted-foreground">{o.neighborhood}</p>
              <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                {o.mission}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Chip tone="green">
                  <Users className="h-3 w-3" />
                  {o.volunteersThisMonth} this month
                </Chip>
                <Chip>{o.tags[0]}</Chip>
              </div>
            </div>
          </Link>
        ))}
      </Deck>
      {filtered.length === 0 && (
        <div className={`${staticCard} p-6 text-center`}>
            <p className="text-[15px] font-semibold">Nothing matches that yet</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Try a different cause, or clear the search to see all six organizations.
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

      <SectionTitle>Happening soon</SectionTitle>
      <Deck>
        {soon.map((e) => {
          const org = orgById(e.orgId);
          return (
            <Link
              key={e.id}
              to="/events/$eventId"
              params={{ eventId: e.id }}
              className={deckCard}
            >
              <CoverPhoto cover={org.cover} alt={org.name} className="h-28" />
              <div className="p-4">
                <p className="truncate text-[15px] font-bold">{e.title}</p>
                <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                  {e.dateShort}, {e.time}
                </p>
                <p className="truncate text-[13px] text-muted-foreground">{org.neighborhood}</p>
              </div>
            </Link>
          );
        })}
      </Deck>
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