import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_tabs/messages")({
  component: MessagesLayout,
});

function MessagesLayout() {
  return <Outlet />;
}
