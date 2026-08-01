import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Building2, MessageCircle, BookHeart } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/organizations", label: "Explore", icon: Building2 },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profile/reflections", label: "Reflect", icon: BookHeart },
];

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="ios-chrome ios-hairline-t fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex h-[49px] w-full max-w-[430px] items-stretch">
        {items.map(({ to, label, icon: Icon }) => {
          const active =
            path === to ||
            path.startsWith(to + "/") ||
            (to === "/messages" && (path.startsWith("/message") || path.startsWith("/messages")));
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full min-h-[44px] flex-col items-center justify-center gap-0.5 transition-colors active:opacity-70",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("h-[22px] w-[22px]", active && "stroke-[2.4]")} aria-hidden />
                <span className={cn("text-[10px] leading-none", active ? "font-bold" : "font-semibold")}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
