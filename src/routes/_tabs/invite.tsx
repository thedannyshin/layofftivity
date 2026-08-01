import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Briefcase, Check, Copy, Heart, Mail, MessageSquare, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Card, Chip, Screen, ScreenHero, SectionTitle, selectRow } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { orgById } from "@/lib/data";
import { useApp, type Invite as InviteType, type InviteStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/invite")({
  head: () => ({
    meta: [
      { title: "Invite a friend — Layofftivity" },
      {
        name: "description",
        content:
          "Invite one friend, family member, or former coworker to join your volunteer day as a guest. No account needed.",
      },
      { property: "og:title", content: "Invite one friend to volunteer with you" },
      { property: "og:description", content: "They RSVP as a guest. No account required." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InviteScreen,
});

const kinds = [
  {
    id: "friend",
    title: "A friend",
    detail: "Someone who'd say yes to a Saturday morning with you.",
    icon: Heart,
    message:
      "I've joined a small volunteer group and we're doing a shift together. Want to come with me?",
  },
  {
    id: "family",
    title: "Family",
    detail: "Parents, siblings, partners. Kids over 12 are welcome too.",
    icon: Users,
    message: "Come see what I've been doing on my volunteer mornings — and we get lunch after.",
  },
  {
    id: "coworker",
    title: "A former coworker",
    detail: "Someone from the old team who's also figuring out their week.",
    icon: Briefcase,
    message:
      "Not a networking thing, promise. I'm in a volunteer group and there's a guest spot open.",
  },
];

const channels = [
  { id: "text", label: "Text", icon: MessageSquare, placeholder: "Phone number" },
  { id: "email", label: "Email", icon: Mail, placeholder: "Email address" },
  { id: "link", label: "Link", icon: Copy, placeholder: "No contact needed" },
] as const;

export const statusLabel: Record<InviteStatus, string> = {
  sent: "Sent",
  opened: "Opened",
  accepted: "Accepted",
  declined: "Declined",
};

export function StatusChip({ status }: { status: InviteStatus }) {
  return (
    <Chip tone={status === "accepted" ? "green" : status === "declined" ? "neutral" : "neutral"}>
      {statusLabel[status]}
    </Chip>
  );
}

function InviteScreen() {
  const { state, update, primaryEvent } = useApp();
  const [kind, setKind] = React.useState(kinds[0]);
  const [channel, setChannel] = React.useState<(typeof channels)[number]["id"]>("text");
  const [name, setName] = React.useState("");
  const [contact, setContact] = React.useState("");
  const org = orgById(primaryEvent.orgId);

  const myInvites = state.invites.filter((i) => i.hostId === "you");
  const active = myInvites.find((i) => i.status !== "declined");
  const canInvite = !active;

  const linkFor = (id: string) =>
    `${typeof window === "undefined" ? "https://layofftivity.app" : window.location.origin}/rsvp/${id}`;

  const send = () => {
    const id = `inv${Date.now()}`;
    const invite: InviteType = {
      id,
      name: name.trim(),
      relation: kind.title.toLowerCase(),
      channel,
      contact: contact.trim(),
      eventId: primaryEvent.id,
      hostId: "you",
      status: "sent",
    };
    update((s) => ({ ...s, invites: [...s.invites, invite] }));
    setName("");
    setContact("");
    toast.success(`Invitation sent to ${invite.name}`, {
      description: "You'll see the status change once they open it.",
    });
  };

  const cancel = (id: string) => {
    update((s) => ({ ...s, invites: s.invites.filter((i) => i.id !== id) }));
    toast("Invitation cancelled");
  };

  const copyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(linkFor(id));
      toast.success("Invitation link copied");
    } catch {
      toast("Copy this link", { description: linkFor(id) });
    }
  };

  return (
    <Screen>
      <ScreenHero
        title="Invite a friend"
        subtitle={primaryEvent.title}
        back
      />

      <p className="text-[15px] leading-relaxed text-muted-foreground">
        Everyone in the group can bring one guest. They RSVP with a link — no account, no signup.
      </p>

      {myInvites.length > 0 && (
        <>
          <SectionTitle>Your invitation</SectionTitle>
          <div className="space-y-3">
            {myInvites.map((i) => (
              <Card key={i.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-bold">{i.name}</p>
                    <p className="truncate text-[13px] text-muted-foreground">
                      {i.relation}, {i.channel === "link" ? "shared link" : i.contact}
                    </p>
                  </div>
                  <StatusChip status={i.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="soft" onClick={() => copyLink(i.id)}>
                    <Copy />
                    Copy link
                  </Button>
                  <Button asChild variant="quiet">
                    <Link to="/rsvp/$inviteId" params={{ inviteId: i.id }}>
                      Preview RSVP page
                    </Link>
                  </Button>
                  {i.status !== "accepted" && (
                    <Button variant="quiet" onClick={() => cancel(i.id)}>
                      <X />
                      Cancel
                    </Button>
                  )}
                </div>
                {i.status === "accepted" && (
                  <p className="mt-3 flex items-center gap-2 rounded-xl bg-primary-soft px-3 py-2.5 text-[13px] font-semibold">
                    <Check className="h-4 w-4 text-primary" />
                    {i.name.split(" ")[0]} is coming as your guest.
                  </p>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {canInvite ? (
        <>
          <SectionTitle>Who are you bringing?</SectionTitle>
          <div className="space-y-3">
            {kinds.map((k) => {
              const Icon = k.icon;
              const selected = kind.id === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(k)}
                  aria-pressed={selected}
                  className={selectRow(selected)}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold">{k.title}</span>
                    <span className="block text-[13px] text-muted-foreground">{k.detail}</span>
                  </span>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      selected ? "bg-primary" : "bg-transparent border border-muted-foreground/35",
                    )}
                  >
                    <Check
                      className={cn(
                        "h-3.5 w-3.5",
                        selected ? "text-primary-foreground" : "text-muted-foreground",
                      )}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <SectionTitle>How should we send it?</SectionTitle>
          <div className="flex gap-2">
            {channels.map((c) => {
              const Icon = c.icon;
              const selected = channel === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChannel(c.id)}
                  aria-pressed={selected}
                  className={cn(
                    "flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-2xl py-3 text-[13px] font-bold transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {c.label}
                </button>
              );
            })}
          </div>

          <SectionTitle>Their details</SectionTitle>
          <div className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Their name"
              className="h-12 w-full rounded-xl bg-card px-4 text-[16px] outline-none focus:ring-2 focus:ring-primary/30"
            />
            {channel !== "link" && (
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                inputMode={channel === "text" ? "tel" : "email"}
                placeholder={channels.find((c) => c.id === channel)!.placeholder}
                className="h-12 w-full rounded-xl bg-card px-4 text-[16px] outline-none focus:ring-2 focus:ring-primary/30"
              />
            )}
            <Card variant="accent">
              <p className="text-[12px] font-bold text-accent-foreground uppercase">Message</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-accent-foreground">
                {kind.message} {org.name}, {primaryEvent.date}, {primaryEvent.time}.
              </p>
            </Card>
            <Button
              size="lg"
              className="w-full"
              disabled={!name.trim() || (channel !== "link" && !contact.trim())}
              onClick={send}
            >
              Send the invitation
            </Button>
          </div>
        </>
      ) : (
        <p className="mt-6 text-center text-[13px] text-muted-foreground">
          One guest per person keeps the group small. Cancel your invitation to invite someone else.
        </p>
      )}
    </Screen>
  );
}
