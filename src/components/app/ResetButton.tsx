import { useNavigate } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export function ResetButton() {
  const { reset } = useStore();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-label="Reset app and start from the beginning"
      title="Start from the beginning"
      onClick={() => {
        reset();
        navigate({ to: "/" });
        toast.success("Reset — starting from the beginning");
      }}
      className="fixed top-[max(0.5rem,env(safe-area-inset-top))] right-2 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground opacity-80 shadow-sm backdrop-blur transition hover:opacity-100 active:scale-95"
    >
      <RotateCcw className="h-3.5 w-3.5" />
    </button>
  );
}
