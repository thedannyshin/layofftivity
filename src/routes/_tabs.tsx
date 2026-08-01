import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav } from "@/components/app/BottomNav";

export const Route = createFileRoute("/_tabs")({
  component: TabsLayout,
});

function TabsLayout() {
  return (
    <div className="min-h-dvh bg-background pb-[calc(49px+env(safe-area-inset-bottom))]">
      <Outlet />
      <BottomNav />
    </div>
  );
}