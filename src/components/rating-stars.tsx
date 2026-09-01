import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reserved for the future reviews feature (not in MVP scope). Renders
 * nothing when no rating is present, so it's safe to drop into BusinessCard
 * / the profile page today and it will "light up" once review data exists,
 * with no layout changes needed later.
 */
export function RatingStars({
  rating,
  reviewCount,
  className,
}: {
  rating?: number | null;
  reviewCount?: number | null;
  className?: string;
}) {
  if (!rating) return null;

  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      <Star className="h-4 w-4 fill-accent text-accent" />
      <span className="font-medium">{rating.toFixed(1)}</span>
      {reviewCount ? (
        <span className="text-muted-foreground">({reviewCount})</span>
      ) : null}
    </div>
  );
}
