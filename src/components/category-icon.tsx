import { createElement } from "react";
import { getCategoryIcon } from "@/lib/category-icon";
import { cn } from "@/lib/utils";

/** Bare monochrome pictogram for a category -- no tile, no background.
 * Used in the category navigation row, directly on the page background. */
export function CategoryPictogram({
  icon,
  className,
}: {
  icon?: string | null;
  className?: string;
}) {
  return createElement(getCategoryIcon(icon), {
    className: cn("text-foreground", className ?? "h-6 w-6"),
    strokeWidth: 1.5,
  });
}

/**
 * Neutral tile wrapping a category pictogram -- the graceful fallback shown
 * in place of a business photo when none exists. Never a broken image, a
 * blank box, or a random avatar.
 */
export function CategoryIcon({
  icon,
  className,
  iconClassName,
}: {
  icon?: string | null;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center bg-secondary", className)}>
      <CategoryPictogram icon={icon} className={iconClassName} />
    </div>
  );
}
