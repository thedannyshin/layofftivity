import * as React from "react";
import { fallbackReply, generateChatReply, pickReplier, sleep } from "@/lib/chat-reply";
import type { Person } from "@/lib/data";
import { sendMessage, useStore, type Message } from "@/lib/store";

type Options = {
  threadKey: string;
  messages: Message[];
  candidates: Person[];
  userFirstName: string;
  isGroup?: boolean;
  eventTitle?: string;
  eventWhen?: string;
};

/**
 * After the user sends, show a typing indicator then deliver a peer reply.
 * Uses OpenAI when OPENAI_API_KEY is set; otherwise a persona-aware fallback.
 */
export function useChatReply({
  threadKey,
  messages,
  candidates,
  userFirstName,
  isGroup = false,
  eventTitle,
  eventWhen,
}: Options) {
  const { update } = useStore();
  const [typingPersonId, setTypingPersonId] = React.useState<string | null>(null);
  const handledRef = React.useRef<string>("");
  const candidatesRef = React.useRef(candidates);
  candidatesRef.current = candidates;

  const last = messages[messages.length - 1];
  const turnKey =
    last?.personId === "you" ? `${threadKey}:${messages.length}:${last.text}` : "";

  React.useEffect(() => {
    if (!turnKey) return;
    const people = candidatesRef.current;
    if (!people.length) return;
    if (handledRef.current === turnKey) return;

    let cancelled = false;
    const snapshot = messages;

    const run = async () => {
      const person = isGroup ? pickReplier(people, snapshot) : people[0]!;

      // Pause like someone read the message before typing.
      await sleep(650 + Math.random() * 1100);
      if (cancelled) return;

      setTypingPersonId(person.id);
      const typingStarted = Date.now();

      let text = "";
      try {
        const result = await generateChatReply({
          data: {
            threadKey,
            replyAsId: person.id,
            userFirstName: userFirstName || "there",
            eventTitle,
            eventWhen,
            isGroup,
            memberNames: people.map((c) => c.name.split(" ")[0] ?? c.name),
            messages: snapshot.slice(-12).map((m) => ({
              personId: m.personId,
              text: m.text,
            })),
          },
        });
        text = result.text;
      } catch {
        text = fallbackReply(person, snapshot, isGroup);
      }

      if (!text?.trim()) {
        text = fallbackReply(person, snapshot, isGroup);
      }

      // Keep the dots up long enough to feel like typing.
      const minTyping = 1100 + Math.min(text.length * 28, 2200);
      const wait = minTyping - (Date.now() - typingStarted);
      if (wait > 0) await sleep(wait);
      if (cancelled) return;

      handledRef.current = turnKey;
      setTypingPersonId(null);
      sendMessage(update, threadKey, {
        personId: person.id,
        text: text.trim(),
        time: "Just now",
      });
    };

    void run();

    return () => {
      cancelled = true;
      setTypingPersonId(null);
    };
    // `messages` is captured for this turnKey; turnKey already encodes the user turn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnKey, threadKey, userFirstName, isGroup, eventTitle, eventWhen, update]);

  const typingPerson = typingPersonId
    ? (candidates.find((c) => c.id === typingPersonId) ?? null)
    : null;

  return { typingPerson };
}
