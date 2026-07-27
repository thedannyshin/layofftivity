import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, MessageCircle, Quote, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Card, Chip, Screen, SectionTitle, TopBar } from "@/components/app/Shell";
import { Button } from "@/components/ui/button";
import { byId, conversationStarters, you } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_tabs/match")({
  head: () => ({
    meta: [
      { title: "Meet Maya — Layofftivity Match" },
      {
        name: "description",
        content:
          "Meet one future cohort member before your first volunteer day, with shared interests and conversation starters.",
      },
      { property: "og:title", content: "Meet one cohort member first" },
      {
        property: "og:description",
        content: "Arriving to a familiar face is easier than arriving to a room.",
      },
    ],
  }),
  component: Match;
});

function Match() {
  return null;
}