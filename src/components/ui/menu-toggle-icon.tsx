import { cn } from "@/lib/utils";

interface MenuToggleIconProps extends React.SVGProps<SVGSVGElement> {
  open: boolean;
  duration?: number;
}

/** Animated hamburger <-> close icon, morphing over `duration` ms. */
export function MenuToggleIcon({
  open,
  duration = 300,
  className,
  ...props
}: MenuToggleIconProps) {
  const transitionDuration = `${duration}ms`;

  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("overflow-visible", className)} {...props}>
      <line
        x1="3"
        y1="7"
        x2="21"
        y2="7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="origin-center transition-transform ease-out"
        style={{ transitionDuration, transform: open ? "translateY(5px) rotate(45deg)" : "none" }}
      />
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="origin-center transition-opacity ease-out"
        style={{ transitionDuration, opacity: open ? 0 : 1 }}
      />
      <line
        x1="3"
        y1="17"
        x2="21"
        y2="17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="origin-center transition-transform ease-out"
        style={{
          transitionDuration,
          transform: open ? "translateY(-5px) rotate(-45deg)" : "none",
        }}
      />
    </svg>
  );
}
