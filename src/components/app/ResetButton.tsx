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
      className="fixed top-2 right-2 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-card/80 text-muted-foreground opacity-50 backdrop-blur transition hover:opacity-100 hover:text-foreground active:scale-95"
    >
      <RotateCcw className="h-3.5 w-3.5" />
    </button>
  );
}
