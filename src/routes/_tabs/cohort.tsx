import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, Check, ChevronRight, MapPin, MessageCircle, Quote, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Card, Chip, Clamp, Deck, ListGroup, Meta, Screen, SectionTitle, TopBar, deckItem, tapCard, tapCardAccent, tapRow } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { byId, cohort, icebreakers, introductions, orgById, sharedWith, transportation } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_tabs/cohort")({
  head: () => ({
    meta: [
      { title: "Your volunteer group — Layofftivity" },
      {
        name: "description",
        content:
          "Your small volunteer group: members, guests, group chat, rides, and where to meet before the shift.",
      },
      { property: "og:title", content: "Your volunteer group" },
      { property: "og:description", content: "A few people, one cause, the same morning each week." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Group,
});

function Group() {
  const { state, update, matches, guests, primaryEvent, prefs, thread, isJoined } = useApp();
  const org = orgById(primaryEvent.orgId);
  const messages = thread("group");
  const lastMessage = messages[messages.length - 1];
  const joined = isJoined(primaryEvent.id);
  const memberIds = matches.map((m) => m.id);

  const claimRide = (driverId: string) => {
    const claiming = state.rideClaimed !== driverId;
    update((s) => ({ ...s, rideClaimed: claiming ? driverId : null }));
    toast[claiming ? "success" : "message"](claiming ? "Seat saved" : "Seat released", {
      description: `${byId(driverId).name.split(" ")[0]} will see the change in the car list.`,
    });
  };

  return (
    <Screen>
      <TopBar
        title={`${org.cause} group`}
        subtitle={`${matches.length + 1 + guests.length} people · ${state.onboarding.location || "Your area"}`}
      />

      <Link
        to="/events/$eventId"
        params={{ eventId: primaryEvent.id }}
        className={`${tapCard} flex items-center gap-3`}
      >
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-primary">
            {joined ? "Next together" : "Suggested for the group"}
          </p>
          <p className="mt-0.5 truncate text-[16px] font-bold">{primaryEvent.title}</p>
          <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
            {primaryEvent.date} · {primaryEvent.time}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>

      <SectionTitle>Members</SectionTitle>
      <ListGroup>
        {matches.map((m) => {
          const intro = introductions.find((i) => i.personId === m.id);
          return (
            <Link
              key={m.id}
              to="/chat/$personId"
              params={{ personId: m.id }}
              className={`${tapRow} items-start`}
            >
              <Avatar src={m.photo} name={m.name} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{m.name}</p>
                <Meta
                  items={[
                    m.formerRole,
                    (sharedWith(m, prefs).length ? sharedWith(m, prefs) : m.interests)[0],
                  ]}
                />
                {intro && (
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                    “{intro.text}”
                  </p>
                )}
              </div>
              <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}

        {guests.map((g) => (
          <div key={g.id} className="flex items-center gap-3 px-4 py-3.5">
            <Avatar name={g.name} size={48} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold">{g.name}</p>
              <Meta items={["Invited by you", g.relation]} />
            </div>
            <Chip tone="yellow">Guest</Chip>
          </div>
        ))}
      </ListGroup>

      {guests.length === 0 && (
        <Link
          to="/invite"
          className={`${tapCardAccent} mt-3 flex items-center gap-3`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent">
            <UserPlus className="h-5 w-5 text-accent-foreground" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold">Bring one guest</span>
            <span className="block text-[13px] text-muted-foreground">
              {state.invites.length
                ? `Invitation ${state.invites[state.invites.length - 1].status}`
                : "They RSVP with a link. No account needed."}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
      )}

      <SectionTitle action="Open chat" to="/cohort-chat">
        Group chat
      </SectionTitle>
      <Link
        to="/cohort-chat"
        className={`${tapCard} block`}
      >
        {lastMessage ? (
          <>
            <p className="text-[13px] font-bold text-primary">
              {lastMessage.personId === "you" ? "You" : byId(lastMessage.personId).name.split(" ")[0]}
            </p>
            <p className="mt-1 line-clamp-2 text-[15px]">{lastMessage.text}</p>
            <p className="mt-1 text-[12px] text-muted-foreground">{lastMessage.time}</p>
          </>
        ) : (
          <>
            <p className="text-[15px] font-bold">No messages yet</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Say hello — it's easier before the first shift than during it.
            </p>
          </>
        )}
      </Link>

      <SectionTitle>Rides</SectionTitle>
      <ListGroup>
        {transportation.map((t) => {
          const driver = byId(t.driverId);
          const claimed = state.rideClaimed === t.driverId;
          const taken = t.seatsTaken + (claimed ? 1 : 0);
          const full = taken >= t.seatsTotal && !claimed;
          return (
            <button
              key={t.driverId}
              type="button"
              onClick={() => !full && claimRide(t.driverId)}
              disabled={full}
              className={tapRow}
            >
              <Avatar src={driver.photo} name={driver.name} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{driver.name.split(" ")[0]} is driving</p>
                <Meta
                  items={[t.departs, `${t.seatsTotal - taken}/${t.seatsTotal} seats`, t.note]}
                />
              </div>
              {claimed ? (
                <Chip tone="green">
                  <Check className="h-3 w-3" /> Your seat
                </Chip>
              ) : full ? (
                <Chip>Full</Chip>
              ) : (
                <Chip tone="yellow">
                  <Car className="h-3 w-3" /> Claim
                </Chip>
              )}
            </button>
          );
        })}
      </ListGroup>
    </Screen>
  );
}
