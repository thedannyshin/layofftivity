import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ArrowRight, Camera, Check, ImagePlus, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, BackButton, Screen, selectRow, staticCard, tapPill, tapPillActive } from "@/components/app/Shell";
import {
  availabilityOptions,
  causeOptions,
  cityOptions,
  interestOptions,
  laidOffOptions,
  matchPeople,
  reasonOptions,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Layofftivity" },
      {
        name: "description",
        content:
          "Answer a few short questions and get matched with a small volunteer group of former tech professionals near you.",
      },
      { property: "og:title", content: "Layofftivity" },
      {
        property: "og:description",
        content: "A few short questions, then meet the small group you'll show up with every week.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const steps = ["You", "Photo", "Why", "Timing", "Interests", "Causes", "Availability", "Location"];

function formatNamePart(value: string) {
  return value
    .toLowerCase()
    .replace(/(^|[\s'-])[a-z]/g, (match) => match.toUpperCase());
}

async function fileToSquareDataUrl(file: File, size = 256) {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size,
  );
  return canvas.toDataURL("image/jpeg", 0.82);
}

function Onboarding() {
  const navigate = useNavigate();
  const { state, hydrated, update } = useStore();
  const [step, setStep] = React.useState(-1);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [photo, setPhoto] = React.useState<string | null>(null);
  const [reasons, setReasons] = React.useState<string[]>([]);
  const [laidOff, setLaidOff] = React.useState("");
  const [interests, setInterests] = React.useState<string[]>([]);
  const [causes, setCauses] = React.useState<string[]>([]);
  const [availability, setAvailability] = React.useState<string[]>([]);
  const [location, setLocation] = React.useState("");

  const uploadRef = React.useRef<HTMLInputElement>(null);
  const cameraRef = React.useRef<HTMLInputElement>(null);

  const finishing = React.useRef(false);

  React.useEffect(() => {
    if (finishing.current) return;
    if (hydrated && state.onboarding.complete) navigate({ to: "/home", replace: true });
  }, [hydrated, state.onboarding.complete, navigate]);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const onPickPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const url = await fileToSquareDataUrl(file);
      if (url) setPhoto(url);
    } catch {
      /* ignore unreadable files */
    }
  };

  const canContinue = [
    firstName.trim().length > 0 && lastName.trim().length > 0,
    true,
    reasons.length > 0,
    !!laidOff,
    interests.length > 0,
    causes.length > 0,
    availability.length > 0,
    !!location,
  ][step];

  const finish = () => {
    finishing.current = true;
    const prefs = { interests, causes, availability };
    const normalizedFirstName = formatNamePart(firstName).trim();
    const normalizedLastName = formatNamePart(lastName).trim();
    update((s) => ({
      ...s,
      profile: { firstName: normalizedFirstName, lastName: normalizedLastName, photo },
      onboarding: { complete: true, reasons, laidOff, interests, causes, availability, location },
      matchIds: matchPeople(prefs).map((p) => p.id),
    }));
    navigate({ to: "/home" });
  };

  if (step === -1) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Screen className="flex flex-1 flex-col justify-between pt-16">
          <div>
            <div className="lo-wordmark text-[40px] text-primary">Layofftivity</div>
            <h1 className="lo-display mt-8 text-[34px] leading-[1.15]">
              Belonging comes from showing up with the same people.
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
              Layofftivity places you in a small group of former tech professionals who volunteer
              together, week after week. Not a job board. Not networking. Just a standing reason to
              be somewhere with people who get it.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "A small group, one cause, the same morning each week",
                "Meet your matches before your first volunteer day",
                "No résumés, no pitches, no small talk about titles",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
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
              Eight short questions. About two minutes.
            </p>
          </div>
        </Screen>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Screen className="flex flex-1 flex-col pt-4">
        <div className="pt-2">
          <BackButton onClick={() => setStep((s) => s - 1)} />
        </div>

        <div className="flex-1 pb-32">
          {step === 0 && (
            <Question title="What should we call you?" hint="Your group sees your first and last name.">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-bold text-muted-foreground">
                  First name
                </span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(formatNamePart(e.target.value))}
                  autoComplete="given-name"
                  placeholder="Alex"
                  className="h-12 w-full rounded-xl bg-card px-4 text-[16px] outline-none focus:ring-2 focus:ring-primary/40"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-bold text-muted-foreground">
                  Last name
                </span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(formatNamePart(e.target.value))}
                  autoComplete="family-name"
                  placeholder="Rivera"
                  className="h-12 w-full rounded-xl bg-card px-4 text-[16px] outline-none focus:ring-2 focus:ring-primary/40"
                />
              </label>
            </Question>
          )}

          {step === 1 && (
            <Question
              title="Add a profile photo"
              hint="A face makes the first Saturday easier. You can skip and use your initials."
            >
              <div className={`${staticCard} flex flex-col items-center gap-4 p-6`}>
                <Avatar
                  src={photo}
                  name={`${firstName} ${lastName}`.trim() || "You"}
                  size={112}
                  initials={
                    (firstName.trim()[0] ?? "") + (lastName.trim()[0] ?? "") || "?"
                  }
                />
                <p className="text-[13px] text-muted-foreground">
                  {photo ? "Looking good." : "Using your initials for now."}
                </p>
              </div>
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onPickPhoto}
              />
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="user"
                className="sr-only"
                onChange={onPickPhoto}
              />
              <Button size="lg" className="w-full" onClick={() => uploadRef.current?.click()}>
                <ImagePlus />
                Upload a photo
              </Button>
              <Button
                variant="soft"
                size="lg"
                className="w-full"
                onClick={() => cameraRef.current?.click()}
              >
                <Camera />
                Take a photo
              </Button>
              {photo && (
                <Button
                  variant="quiet"
                  size="lg"
                  className="w-full"
                  onClick={() => setPhoto(null)}
                >
                  <Trash2 />
                  Remove photo
                </Button>
              )}
            </Question>
          )}

          {step === 2 && (
            <Question
              title="Why are you here?"
              hint="Choose as many as you'd like. You can change this later."
            >
              {reasonOptions.map((r) => (
                <SelectRow
                  key={r.id}
                  selected={reasons.includes(r.id)}
                  title={r.title}
                  detail={r.detail}
                  multi
                  onClick={() => toggle(reasons, setReasons, r.id)}
                />
              ))}
            </Question>
          )}

          {step === 3 && (
            <Question
              title="When were you laid off?"
              hint="This helps us group people at a similar point."
            >
              {laidOffOptions.map((o) => (
                <SelectRow key={o} selected={laidOff === o} title={o} onClick={() => setLaidOff(o)} />
              ))}
            </Question>
          )}

          {step === 4 && (
            <Question
              title="What do you enjoy?"
              hint="Choose as many as you'd like. Shared interests make first conversations easier."
            >
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

          {step === 5 && (
            <Question title="Which causes matter to you?" hint="Choose as many as you'd like.">
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

          {step === 6 && (
            <Question
              title="When can you show up?"
              hint="Choose as many as you'd like. Consistency matters more than frequency."
            >
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

          {step === 7 && (
            <Question
              title="Where are you based?"
              hint="We only match groups within a short drive of each other."
            >
              {cityOptions.map((o) => (
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

      <div className="fixed inset-x-0 bottom-0 bg-card">
        <div className="mx-auto flex w-full max-w-[430px] gap-3 px-5 py-4">
          <Button
            size="lg"
            className="flex-1"
            disabled={!canContinue}
            onClick={() => (step === steps.length - 1 ? finish() : setStep((s) => s + 1))}
          >
            {step === steps.length - 1 ? "Find my group" : step === 1 && !photo ? "Skip for now" : "Continue"}
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
      className={selectRow(selected)}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{title}</span>
        {detail && <span className="mt-0.5 block text-[13px] text-muted-foreground">{detail}</span>}
      </span>
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center transition-colors",
          multi ? "rounded-md" : "rounded-xl",
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
      className={
        selected
          ? tapPillActive
          : "inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-muted-foreground/35 bg-transparent px-3.5 py-2 text-[13px] font-semibold text-muted-foreground cursor-pointer transition-colors duration-[120ms] hover:bg-card active:bg-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft"
      }
    >
      {label}
    </button>
  );
}
