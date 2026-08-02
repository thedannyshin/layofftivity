import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { byId, type Person } from "@/lib/data";

const messageSchema = z.object({
  personId: z.string(),
  text: z.string(),
});

const inputSchema = z.object({
  threadKey: z.string(),
  replyAsId: z.string(),
  userFirstName: z.string(),
  eventTitle: z.string().optional(),
  eventWhen: z.string().optional(),
  isGroup: z.boolean(),
  memberNames: z.array(z.string()).optional(),
  messages: z.array(messageSchema).max(20),
});

export type ChatReplyInput = z.infer<typeof inputSchema>;

export const generateChatReply = createServerFn({ method: "POST" })
  .validator(inputSchema)
  .handler(async ({ data }) => {
    const person = byId(data.replyAsId);
    const key = process.env.OPENAI_API_KEY;
    if (key) {
      try {
        const text = await callOpenAI(key, person, data);
        if (text) return { text, source: "openai" as const };
      } catch (error) {
        console.error("OpenAI chat reply failed", error);
      }
    }
    return {
      text: fallbackReply(person, data.messages, data.isGroup),
      source: "fallback" as const,
    };
  });

async function callOpenAI(apiKey: string, person: Person, data: ChatReplyInput) {
  const firstName = person.name.split(" ")[0] ?? person.name;
  const history = data.messages.slice(-12).map((m) => {
    const role = m.personId === "you" ? "user" : "assistant";
    const speaker =
      m.personId === "you"
        ? data.userFirstName || "You"
        : (byId(m.personId)?.name.split(" ")[0] ?? "Someone");
    return {
      role: role as "user" | "assistant",
      content: data.isGroup ? `${speaker}: ${m.text}` : m.text,
    };
  });

  const contextBits = [
    data.eventTitle && `Upcoming volunteer activity: ${data.eventTitle}`,
    data.eventWhen && `When: ${data.eventWhen}`,
    data.isGroup &&
      data.memberNames?.length &&
      `Group members: ${data.memberNames.join(", ")}`,
  ].filter(Boolean);

  const system = [
    `You are ${person.name} (go by ${firstName}), a real person in a volunteer cohort chat app called Layofftivity.`,
    `Background: ${person.formerRole}. ${person.bio}`,
    `City: ${person.city}. Causes: ${person.causes.join(", ")}. Interests: ${person.interests.join(", ")}.`,
    `Availability: ${person.availability.join(", ")}.`,
    contextBits.join(". "),
    data.isGroup
      ? "This is a small group chat. Reply as yourself only — one message from you."
      : "This is a 1:1 text thread with another cohort member.",
    "Write like a warm, grounded human texting on their phone after a layoff — brief, natural, imperfect.",
    "1–2 short sentences max. No lists, no markdown, no hashtags.",
    "Do not mention AI, being a bot, or Layofftivity as a product.",
    "Do not introduce yourself again if the thread already started.",
    "Occasionally ask a small follow-up question when it feels natural.",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.95,
      max_tokens: 100,
      messages: [{ role: "system", content: system }, ...history],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = json.choices?.[0]?.message?.content?.trim() ?? "";
  return cleanReply(raw, firstName);
}

function cleanReply(text: string, firstName: string) {
  let out = text
    .replace(/^["'\s]+|["'\s]+$/g, "")
    .replace(/^\*\*?|\*\*?$/g, "")
    .replace(new RegExp(`^${firstName}\\s*[:\\-]\\s*`, "i"), "")
    .trim();
  if (out.length > 280) out = out.slice(0, 277).trimEnd() + "…";
  return out;
}

export function pickReplier(candidates: Person[], messages: { personId: string }[]): Person {
  if (candidates.length === 1) return candidates[0];
  const recent = messages
    .filter((m) => m.personId !== "you")
    .slice(-4)
    .map((m) => m.personId);
  const fresh = candidates.filter((p) => !recent.includes(p.id));
  const pool = fresh.length ? fresh : candidates;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function fallbackReply(
  person: Person,
  messages: { personId: string; text: string }[],
  isGroup: boolean,
) {
  const first = person.name.split(" ")[0] ?? person.name;
  const lastUser = [...messages].reverse().find((m) => m.personId === "you")?.text ?? "";
  const lower = lastUser.toLowerCase();
  const cause = (person.causes[0] ?? "this").toLowerCase();

  if (/hi[!1.]?\s|hello|hey\b|matched|said hello/.test(lower)) {
    return pick([
      `Hey — yeah, I'm in for the next one. Looking forward to meeting you.`,
      `Hi! Same here. I'm glad we got matched.`,
      `Hey! I'll be there. Happy we overlapped on ${cause}.`,
    ]);
  }
  if (/drive|driving|ride|car|transit|bart|uber|lift/.test(lower)) {
    return pick([
      `I can do transit — want to sync closer to the morning?`,
      `I'm flexible. Happy to grab a seat if someone's driving.`,
      `I usually take BART. Could meet you at the lot if that helps.`,
    ]);
  }
  if (/early|coffee|meet|before/.test(lower)) {
    return pick([
      `Fifteen early works for me. Coffee sounds good.`,
      `I'm down to meet a little early — easier than rushing in.`,
      `Yes. Blue awning side is usually quiet before it starts.`,
    ]);
  }
  if (/saturday|weekend|shift|volunteer|going/.test(lower)) {
    return pick([
      `I'm planning on it. Feels good having something on the calendar again.`,
      `Yep — I'll be there. ${person.bio.split(".")[0]}.`,
      `Same. Showing up is the whole point for me right now.`,
    ]);
  }
  if (/\?/.test(lastUser)) {
    return pick([
      `Honestly, ${cause} felt like the most concrete thing I could do with my week.`,
      `Good question. For me it's mostly about having people to show up with.`,
      `Yeah — I needed something that wasn't networking. This fits.`,
    ]);
  }

  if (isGroup) {
    return pick([
      `Same. I'm glad we're all on this.`,
      `That tracks. See you Saturday.`,
      `${first} here — I'm in.`,
      `Love that. Count me in.`,
    ]);
  }

  return pick([
    `That makes sense. I'm glad you said it.`,
    `Yeah. I've been thinking about that too.`,
    `Appreciate you saying that. Looking forward to Saturday.`,
    `Same wavelength. See you soon.`,
    `True. ${person.interests[1] ?? "This"} has been keeping me sane lately.`,
  ]);
}

function pick(options: string[]) {
  return options[Math.floor(Math.random() * options.length)]!;
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
