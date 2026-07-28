import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Building2, MessageCircle, BookHeart } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/organizations", label: "Explore", icon: Building2 },
  { to: "/match", label: "Chat", icon: MessageCircle },
  { to: "/profile/reflections", label: "Reflect", icon: BookHeart },
];

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 bg-card">
      <ul className="mx-auto flex w-full max-w-[430px] items-stretch">
        {items.map(({ to, label, icon: Icon }, i) => {
          const active =
            path === to ||
            path.startsWith(to + "/") ||
            (to === "/match" && (path.startsWith("/chat") || path.startsWith("/cohort-chat")));
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 transition-colors",
                  i > 0 && "",
                  active
                    ? "bg-secondary font-bold text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-[22px] w-[22px]", active && "stroke-[2.4] text-primary")} />
                <span className="text-[12px] font-semibold">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}