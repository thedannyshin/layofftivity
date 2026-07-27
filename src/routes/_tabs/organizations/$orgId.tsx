import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, Clock, MapPin, Users } from "lucide-react";
import { Card, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { OrgMark } from "@/components/app/OrgMark";
import { eventsForOrg, organizations } from "@/lib/data";

export const Route = createFileRoute("/_tabs/organizations/$orgId")({
  loader: ({ params }) => {
    const org = organizations.find((o) => o.id === params.orgId);
    if (!org) throw notFound();
    return { org };
  },
  head: ({ loaderData }) => {
    const org = loaderData?.org;
    return {
      meta: [
        { title: `${org?.name ?? "Organization"} — Layofftivity` },
        { name: "description", content: org?.mission ?? "Volunteer with a small team." },
        { property: "og:title", content: org?.name ?? "Organization" },
        { property: "og:description", content: org?.mission ?? "Volunteer with a small team." },
      ],
    };
  },
  component: OrgDetail,
});

function OrgDetail() {
  const { org } = Route.useLoaderData();
  const orgEvents = eventsForOrg(org.id);

  return (
    <Screen>
      <TopBar title={org.name} subtitle={org.neighborhood} back />

      <div className="flex items-center gap-4">
        <OrgMark cover={org.cover} size={64} />
        <div>
          <p className="text-[13px] font-semibold text-primary">{org.cause}</p>
          <p className="mt-1 text-[14px] text-muted-foreground">
            {org.volunteersThisMonth} volunteers this month
          </p>
        </div>
      </div>

      <p className="mt-5 text-[17px] leading-snug font-bold">{org.mission}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{org.about}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {org.tags.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>

      <SectionTitle>Volunteer opportunities</SectionTitle>
      {orgEvents.length > 0 ? (
        <div className="space-y-3">
          {orgEvents.map((e) => (
            <Link
              key={e.id}
              to="/events/$eventId"
              params={{ eventId: e.id }}
              className="block rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 active:bg-secondary"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[16px] leading-tight font-bold">{e.title}</p>
                <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              </div>
              <div className="mt-2.5 space-y-1.5 text-[13px] text-muted-foreground">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> {e.date}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {e.time}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {e.location}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <Chip tone={e.spotsTotal - e.spotsFilled <= 2 ? "yellow" : "green"}>
                  <Users className="h-3 w-3" />
                  {e.spotsFilled} of {e.spotsTotal} joined
                </Chip>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-[15px] font-semibold">No open shifts right now</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            New dates post on Mondays. In the meantime, other organizations have space this week.
          </p>
          <Link
            to="/organizations"
            className="mt-3 inline-block text-[14px] font-bold text-primary hover:underline"
          >
            Browse other organizations
          </Link>
        </Card>
      )}

      <SectionTitle>Also working on {org.cause.toLowerCase()}</SectionTitle>
      <div className="space-y-3">
        {organizations
          .filter((o) => o.id !== org.id)
          .slice(0, 2)
          .map((o) => (
            <Link
              key={o.id}
              to="/organizations/$orgId"
              params={{ orgId: o.id }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 active:bg-secondary"
            >
              <OrgMark cover={o.cover} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{o.name}</p>
                <p className="truncate text-[13px] text-muted-foreground">
                  {o.cause} · {o.neighborhood}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          ))}
      </div>
    </Screen>
  );
}