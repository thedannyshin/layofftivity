import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, MapPin, Users } from "lucide-react";
import { Card, Chip, Clamp, Deck, Meta, Screen, ScreenHero, SectionTitle, deckCard } from "@/components/app/Shell";
import { CoverPhoto } from "@/components/app/OrgMark";
import { Button } from "@/components/ui/button";
import { eventsForOrg, orgById, organizations } from "@/lib/data";

export const Route = createFileRoute("/_tabs/organizations/$orgId")({
  head: ({ params }) => {
    const org = orgById(params.orgId);
    return {
      meta: [
        { title: `${org.name} — Layofftivity` },
        { name: "description", content: org.mission },
        { property: "og:title", content: org.name },
        { property: "og:description", content: org.mission },
      ],
    };
  },
  component: OrgDetail,
});

function OrgDetail() {
  const { orgId } = Route.useParams();
  const org = orgById(orgId);
  const orgEvents = eventsForOrg(org.id);

  return (
    <Screen>
      <ScreenHero title={org.name} back />

      <CoverPhoto cover={org.cover} alt={org.name} className="h-44 rounded-2xl" />
      <div className="mt-3">
        <p className="text-[13px] font-semibold text-primary">{org.cause}</p>
        <p className="mt-1 text-[14px] text-muted-foreground">
          {org.volunteersThisMonth} volunteers this month
        </p>
      </div>

      <p className="mt-5 text-[17px] leading-snug font-bold">{org.mission}</p>
      <div className="mt-3 text-muted-foreground">
        <Clamp lines={2}>{org.about}</Clamp>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {org.tags.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>

      <SectionTitle>Volunteer opportunities</SectionTitle>
      {orgEvents.length > 0 ? (
        <Deck>
          {orgEvents.map((e) => (
            <Link
              key={e.id}
              to="/events/$eventId"
              params={{ eventId: e.id }}
              className={deckCard}
            >
              <CoverPhoto cover={org.cover} alt={e.title} className="h-28" />
              <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[16px] leading-tight font-bold">{e.title}</p>
                <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              </div>
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
              <div className="mt-3 flex items-center gap-1.5">
                <Chip tone={e.spotsTotal - e.spotsFilled <= 2 ? "neutral" : "green"}>
                  <Users className="h-3 w-3" />
                  {e.spotsFilled}/{e.spotsTotal} joined
                </Chip>
              </div>
              </div>
            </Link>
          ))}
        </Deck>
      ) : (
        <Card>
          <p className="text-[15px] font-semibold">No open shifts</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Check back later for new dates.</p>
          <Button asChild variant="quiet" className="mt-3">
            <Link to="/organizations">Browse other organizations</Link>
          </Button>
        </Card>
      )}

      <SectionTitle>Also working on {org.cause.toLowerCase()}</SectionTitle>
      <Deck>
        {organizations
          .filter((o) => o.id !== org.id)
          .slice(0, 4)
          .map((o) => (
            <Link
              key={o.id}
              to="/organizations/$orgId"
              params={{ orgId: o.id }}
              className={`${deckCard} w-[62%]`}
            >
              <CoverPhoto cover={o.cover} alt={o.name} className="h-24" />
              <div className="p-3.5">
                <p className="truncate text-[15px] font-bold">{o.name}</p>
                <Meta items={[o.cause, o.neighborhood]} />
              </div>
            </Link>
          ))}
      </Deck>
    </Screen>
  );
}