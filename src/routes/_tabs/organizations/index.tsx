import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { ChevronRight, Search, Users } from "lucide-react";
import { Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { OrgMark } from "@/components/app/OrgMark";
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

  const soon = events.slice(0, 3);

  return (
    <Screen>
      <TopBar title="Explore" subtitle="Organizations in the East Bay" />

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

      <div className="space-y-3">
        {filtered.map((o) => (
          <Link
            key={o.id}
            to="/organizations/$orgId"
            params={{ orgId: o.id }}
            className="flex items-start gap-3 rounded-2xl bg-card p-4 transition-colors active:bg-secondary"
          >
            <OrgMark cover={o.cover} size={52} />
            <div className="min-w-0 flex-1">
              <p className="text-[16px] leading-tight font-bold">{o.name}</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {o.cause} · {o.neighborhood}
              </p>
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
            <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-card p-6 text-center">
            <p className="text-[15px] font-semibold">Nothing matches that yet</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Try a different cause, or clear the search to see all six organizations.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCause(null);
              }}
              className="mt-4 rounded-full bg-secondary px-4 py-2.5 text-[14px] font-bold text-primary transition-colors hover:bg-primary-soft active:bg-primary-soft"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <SectionTitle>Happening soon</SectionTitle>
      <div className="space-y-3">
        {soon.map((e) => {
          const org = orgById(e.orgId);
          return (
            <Link
              key={e.id}
              to="/events/$eventId"
              params={{ eventId: e.id }}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 transition-colors active:bg-secondary"
            >
              <div className="w-14 shrink-0 rounded-xl bg-secondary py-2 text-center">
                <p className="text-[11px] font-bold text-muted-foreground uppercase">
                  {e.dateShort.split(" ")[1]}
                </p>
                <p className="text-[18px] leading-tight font-extrabold">
                  {e.dateShort.split(" ")[2]}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{e.title}</p>
                <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                  {e.time} · {org.neighborhood}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
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
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-foreground hover:bg-primary-soft/70",
      )}
    >
      {label}
    </button>
  );
}