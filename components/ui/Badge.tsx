import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "verified"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "forest";

const tones: Record<Tone, string> = {
  neutral: "bg-gray-100 text-gray-700",
  verified: "bg-gold-500 text-white",
  forest: "bg-forest-50 text-forest-700 ring-1 ring-forest-100",
  success: "bg-gold-50 text-gold-600 ring-1 ring-gold-100",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  danger: "bg-red-50 text-red-700 ring-1 ring-red-100",
  info: "bg-forest-50 text-forest-700",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
