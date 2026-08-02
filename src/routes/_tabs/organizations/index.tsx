import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { CoverPhoto } from "@/components/app/OrgMark";
import { Button } from "@/components/ui/button";
import { Screen, ScreenHero, staticCard } from "@/components/app/Shell";
import { events, orgById } from "@/lib/data";

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

  const filtered = events.filter((e) => {
    const org = orgById(e.orgId);
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      e.title.toLowerCase().includes(q) ||
      org.name.toLowerCase().includes(q) ||
      org.cause.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q);
    return matchesQuery;
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
          className="h-12 w-full bg-transparent text-[16px] outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="mt-6 grid grid-cols-1 gap-3">
        {filtered.map((e) => {
          const org = orgById(e.orgId);
          return (
            <Link
              key={e.id}
              to="/events/$eventId"
              params={{ eventId: e.id }}
              className="overflow-hidden rounded-2xl bg-card transition-colors hover:bg-card/90 active:bg-card/90"
            >
              <CoverPhoto cover={org.cover} alt={e.title} className="h-28 rounded-none" />
              <div className="p-3">
                <p className="line-clamp-2 text-[15px] font-bold leading-tight">{e.title}</p>
                <p className="mt-1 line-clamp-1 text-[13px] text-muted-foreground">{org.name}</p>
                <div className="mt-3 space-y-1.5 text-[12px] text-muted-foreground">
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
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className={`${staticCard} p-6 text-center`}>
            <p className="text-[15px] font-semibold">No results</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Try a different search.
            </p>
            <Button
              variant="quiet"
              className="mt-4"
              onClick={() => {
                setQuery("");
              }}
            >
              Clear search
            </Button>
          </div>
        )}
    </Screen>
  );
}