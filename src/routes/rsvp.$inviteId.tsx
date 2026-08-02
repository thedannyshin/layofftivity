import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { CalendarDays, Check, Clock, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import { Card, Screen } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { eventById, orgById } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/rsvp/$inviteId")({
  head: () => ({
    meta: [
      { title: "You're invited to volunteer — Layofftivity" },
      {
        name: "description",
        content:
          "A friend invited you to join their volunteer day as a guest. RSVP in one tap — no account needed.",
      },
      { property: "og:title", content: "You're invited to volunteer" },
      { property: "og:description", content: "RSVP as a guest. No account needed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Rsvp,
});

function Rsvp() {
  const { inviteId } = Route.useParams();
  const { state, update, hydrated, fullName } = useApp();
  const navigate = useNavigate();
  const invite = state.invites.find((i) => i.id === inviteId);

  React.useEffect(() => {
    if (invite && invite.status === "sent") {
      update((s) => ({
        ...s,
        invites: s.invites.map((i) => (i.id === inviteId ? { ...i, status: "opened" } : i)),
      }));
    }
  }, [invite, inviteId, update]);

  const respond = (status: "accepted" | "declined") => {
    update((s) => ({
      ...s,
      invites: s.invites.map((i) => (i.id === inviteId ? { ...i, status } : i)),
    }));
    toast[status === "accepted" ? "success" : "message"](
      status === "accepted" ? "You're on the guest list" : "Reply sent",
    );
  };

  if (!hydrated) return null;

  if (!invite) {
    return (
      <Screen className="pt-20 text-center">
        <h1 className="lo-display text-[26px]">This invitation isn't available</h1>
        <p className="mt-3 text-[15px] text-muted-foreground">
          The link may have been cancelled or opened on a different device.
        </p>
        <Button className="mt-6" onClick={() => navigate({ to: "/" })}>
          Learn about Layofftivity
        </Button>
      </Screen>
    );
  }

  const event = eventById(invite.eventId);
  const org = orgById(event.orgId);
  const host = fullName === "Your profile" ? "A friend" : fullName;

  return (
    <div className="min-h-screen bg-background">
      <Screen className="pt-10">
        <div className="lo-wordmark text-[32px] text-primary">Layofftivity</div>

        <h1 className="lo-display mt-8 text-[30px] leading-tight">
          {invite.name.split(" ")[0] || "Hi"}, {host} invited you to volunteer.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          No account required.
        </p>

        <Card className="mt-6 space-y-2">
          <p className="text-[13px] font-bold text-primary">{org.name}</p>
          <p className="text-[19px] leading-tight font-extrabold">{event.title}</p>
          <p className="flex items-center gap-2 text-[14px] text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> {event.date}
          </p>
          <p className="flex items-center gap-2 text-[14px] text-muted-foreground">
            <Clock className="h-4 w-4" /> {event.time}
          </p>
          <p className="flex items-center gap-2 text-[14px] text-muted-foreground">
            <MapPin className="h-4 w-4" /> {event.address}
          </p>
          <p className="pt-2 text-[15px] leading-relaxed">{event.description}</p>
        </Card>

        {invite.status === "accepted" ? (
          <Card variant="accent" className="mt-6">
            <p className="flex items-center gap-2 text-[16px] font-bold text-accent-foreground">
              <Check className="h-5 w-5" /> You're on the guest list
            </p>
            <p className="mt-1.5 text-[14px] text-accent-foreground">
              Meet at {event.location}, {event.time}. Wear closed-toe shoes.
            </p>
            <Button variant="quiet" className="mt-4 w-full" onClick={() => respond("declined")}>
              Decline
            </Button>
          </Card>
        ) : invite.status === "declined" ? (
          <Card className="mt-6">
            <p className="text-[16px] font-bold">You declined this invitation</p>
            <p className="mt-1 text-[14px] text-muted-foreground">
              You can change your response anytime.
            </p>
            <Button className="mt-4 w-full" onClick={() => respond("accepted")}>
              Accept invitation
            </Button>
          </Card>
        ) : (
          <div className="mt-6 space-y-3">
            <Button size="lg" className="w-full" onClick={() => respond("accepted")}>
              <Check />
              Accept
            </Button>
            <Button variant="quiet" size="lg" className="w-full" onClick={() => respond("declined")}>
              <X />
              Decline
            </Button>
          </div>
        )}
      </Screen>
    </div>
  );
}
