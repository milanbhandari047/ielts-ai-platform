import { cn } from "@/lib/utils";

interface RadioDotProps {
  selected: boolean;
}

export function RadioDot({ selected }: RadioDotProps) {
  return (
    <span
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition",
        selected
          ? "border-indigo-600 bg-indigo-600"
          : "border-gray-400 bg-white"
      )}
    >
      {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
    </span>
  );
}
