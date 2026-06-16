import { cn } from "@/lib/utils";

interface CheckBoxProps {
  selected: boolean;
}

export function CheckBox({ selected }: CheckBoxProps) {
  return (
    <span
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition",
        selected
          ? "border-indigo-600 bg-indigo-600"
          : "border-gray-400 bg-white"
      )}
    >
      {selected && (
        <svg
          className="h-2.5 w-2.5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </span>
  );
}
