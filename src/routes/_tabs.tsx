import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav } from "@/components/app/BottomNav";

export const Route = createFileRoute("/_tabs")({
  component: TabsLayout,
});

function TabsLayout() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <Outlet />
      <BottomNav />
    </div>
  );
}