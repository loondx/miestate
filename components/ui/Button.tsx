import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-ring disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-forest-700 text-white shadow-cta hover:-translate-y-0.5 hover:bg-forest-800",
  accent: "bg-gold-500 text-white shadow-cta hover:-translate-y-0.5 hover:bg-gold-600",
  outline: "border border-forest-100 text-forest-700 hover:border-forest-700 hover:bg-forest-50",
  ghost: "text-forest-700 hover:bg-forest-50",
  whatsapp: "bg-[#25D366] text-white shadow-cta hover:-translate-y-0.5 hover:bg-[#1ebe5b]",
};

// Mobile-first: every size meets the 48px touch-target standard.
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-[15px]",
  lg: "h-14 px-7 text-base sm:text-lg",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  href,
  external,
  ...props
}: ButtonLinkProps) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        {...props}
      />
    );
  }
  return <Link href={href} className={cls} {...props} />;
}
