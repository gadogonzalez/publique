import { createElement } from "react";
import { getCategoryColor, getCategoryIcon } from "@/lib/category-icon";
import { cn } from "@/lib/utils";

/**
 * Reusable colored-tile + pictogram, used both as a standalone category
 * shortcut and as the fallback business "logo"/cover when no photo exists.
 * Never a broken image, never a blank box.
 */
export function CategoryIcon({
  icon,
  colorKey,
  className,
  iconClassName,
}: {
  icon?: string | null;
  colorKey: string;
  className?: string;
  iconClassName?: string;
}) {
  const { bg, fg } = getCategoryColor(colorKey);
  const iconElement = createElement(getCategoryIcon(icon), {
    className: cn(fg, iconClassName ?? "h-6 w-6"),
    strokeWidth: 1.75,
  });

  return (
    <div className={cn("flex items-center justify-center rounded-2xl", bg, className)}>
      {iconElement}
    </div>
  );
}
