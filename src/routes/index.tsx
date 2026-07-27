import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Screen } from "@/components/app/Shell";
import { LogoMark } from "@/components/app/LogoMark";
import { causeOptions, interestOptions } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome to Layofftivity — Find your volunteer cohort" },
      {
        name: "description",
        content:
          "Answer six short questions and get matched with a small volunteer cohort of former tech professionals near you.",
      },
      { property: "og:title", content: "Welcome to Layofftivity" },
      {
        property: "og:description",
        content: "Six short questions, then meet the small group you'll show up with every week.",
      },
    ],
  }),
  component: Onboarding,
});

const reasons = [
  { id: "routine", title: "I need structure in my week", detail: "Something to get up for on a set day." },
  { id: "people", title: "I want to be around people again", detail: "Not networking. Just company." },
  { id: "purpose", title: "I want my time to matter", detail: "Do something useful while I figure out what's next." },
  { id: "reset", title: "I need to get out of my head", detail: "The job search is loud. I want a break from it." },
];

const laidOffOptions = ["In the last month", "1–3 months ago", "3–6 months ago", "Over 6 months ago", "Not laid off, but searching"];
const availabilityOptions = ["Saturday mornings", "Saturday afternoons", "Sunday mornings", "Weekday mornings", "Weekday evenings"];
const cities = ["Oakland, CA", "Berkeley, CA", "Alameda, CA", "Emeryville, CA", "San Francisco, CA"];

const steps = ["Why", "Timing", "Interests", "Causes", "Availability", "Location"];

function Onboarding() {
  const navigate = useNavigate();
  const { state, hydrated, update } = useStore();
  const [step, setStep] = React.useState(-1);
  const [reason, setReason] = React.useState("");
  const [laidOff, setLaidOff] = React.useState("");
  const [interests, setInterests] = React.useState<string[]>([]);
  const [causes, setCauses] = React.useState<string[]>([]);
  const [availability, setAvailability] = React.useState<string[]>([]);
  const [location, setLocation] = React.useState("");

  React.useEffect(() => {
    if (hydrated && state.onboarding.complete) navigate({ to: "/home", replace: true });
  }, [hydrated, state.onboarding.complete, navigate]);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const canContinue = [
    !!reason,
    !!laidOff,
    interests.length > 0,
    causes.length > 0,
    availability.length > 0,
    !!location,
  ][step];

  const finish = () => {
    update((s) => ({
      ...s,
      onboarding: { complete: true, reason, laidOff, interests, causes, availability, location },
    }));
    navigate({ to: "/home" });
  };

  if (step === -1) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Screen className="flex flex-1 flex-col justify-between pt-16">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark size={56} />
              <span className="lo-display text-[32px] leading-none">Layofftivity</span>
            </div>
            <h1 className="lo-display mt-8 text-[34px] leading-[1.15]">
              Belonging comes from showing up with the same people.
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
              Layofftivity places you in a small cohort of former tech professionals who volunteer
              together, week after week. Not a job board. Not networking. Just a standing reason to
              be somewhere with people who get it.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Six people, one cause, the same morning each week",
                "Meet one cohort member before your first day",
                "No résumés, no pitches, no small talk about titles",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] text-foreground">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-12 pb-4">
            <Button size="lg" className="w-full" onClick={() => setStep(0)}>
              Get started
              <ArrowRight />
            </Button>
            <p className="mt-3 text-center text-[13px] text-muted-foreground">
              Six short questions. About two minutes.
            </p>
          </div>
        </Screen>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Screen className="flex flex-1 flex-col pt-4">
        <div className="flex items-center gap-2 pt-2">
          {steps.map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-secondary",
              )}
            />
          ))}
        </div>
        <p className="mt-4 text-[13px] font-semibold text-muted-foreground">
          Step {step + 1} of 6
        </p>

        <div className="flex-1 pb-32">
          {step === 0 && (
            <Question
              title="Why are you here?"
              hint="Pick the one that's most true today. You can change it later."
            >
              {reasons.map((r) => (
                <SelectRow
                  key={r.id}
                  selected={reason === r.id}
                  title={r.title}
                  detail={r.detail}
                  onClick={() => setReason(r.id)}
                />
              ))}
            </Question>
          )}

          {step === 1 && (
            <Question title="When were you laid off?" hint="This helps us group people at a similar point.">
              {laidOffOptions.map((o) => (
                <SelectRow key={o} selected={laidOff === o} title={o} onClick={() => setLaidOff(o)} />
              ))}
            </Question>
          )}

          {step === 2 && (
            <Question title="What do you enjoy?" hint="Choose a few. Shared interests make first conversations easier.">
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((o) => (
                  <TagButton
                    key={o}
                    label={o}
                    selected={interests.includes(o)}
                    onClick={() => toggle(interests, setInterests, o)}
                  />
                ))}
              </div>
            </Question>
          )}

          {step === 3 && (
            <Question title="What causes pull at you?" hint="Your cohort forms around one of these.">
              {causeOptions.map((o) => (
                <SelectRow
                  key={o}
                  selected={causes.includes(o)}
                  title={o}
                  onClick={() => toggle(causes, setCauses, o)}
                  multi
                />
              ))}
            </Question>
          )}

          {step === 4 && (
            <Question title="When can you show up?" hint="Consistency matters more than frequency. One slot is plenty.">
              {availabilityOptions.map((o) => (
                <SelectRow
                  key={o}
                  selected={availability.includes(o)}
                  title={o}
                  onClick={() => toggle(availability, setAvailability, o)}
                  multi
                />
              ))}
            </Question>
          )}

          {step === 5 && (
            <Question title="Where are you based?" hint="We only match cohorts within a short drive of each other.">
              {cities.map((o) => (
                <SelectRow
                  key={o}
                  selected={location === o}
                  title={o}
                  icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                  onClick={() => setLocation(o)}
                />
              ))}
            </Question>
          )}
        </div>
      </Screen>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-[430px] gap-3 px-5 py-4">
          <Button
            variant="quiet"
            size="lg"
            className="px-6"
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </Button>
          <Button
            size="lg"
            className="flex-1"
            disabled={!canContinue}
            onClick={() => (step === 5 ? finish() : setStep((s) => s + 1))}
          >
            {step === 5 ? "Find my cohort" : "Continue"}
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Question({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mt-3 text-[26px] leading-tight font-extrabold">{title}</h2>
      <p className="mt-2 text-[15px] text-muted-foreground">{hint}</p>
      <div className="mt-6 space-y-3">{children}</div>
    </div>
  );
}

function SelectRow({
  title,
  detail,
  selected,
  onClick,
  multi,
  icon,
}: {
  title: string;
  detail?: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
        selected
          ? "border-primary bg-primary-soft"
          : "border-border bg-card hover:border-primary/40 active:bg-secondary",
      )}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{title}</span>
        {detail && <span className="mt-0.5 block text-[13px] text-muted-foreground">{detail}</span>}
      </span>
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center border-2 transition-colors",
          multi ? "rounded-md" : "rounded-full",
          selected ? "border-primary bg-primary" : "border-border",
        )}
      >
        {selected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
      </span>
    </button>
  );
}

function TagButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2.5 text-[14px] font-semibold transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/40",
      )}
    >
      {label}
    </button>
  );
}