import Image from "next/image";
import { CategoryIcon } from "@/components/category-icon";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types/database";

/**
 * Cover-image tile used across listings/profile. Businesses without
 * photography get their category's colored icon tile instead of a broken
 * image, a blank box, or a random avatar.
 */
export function BusinessThumb({
  src,
  name,
  category,
  className,
  sizes,
  priority,
}: {
  src?: string | null;
  name: string;
  category?: Category | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-secondary", className)}>
        <Image
          src={src}
          alt={name}
          fill
          priority={priority}
          sizes={sizes ?? "(max-width: 640px) 100vw, 33vw"}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <CategoryIcon
      icon={category?.icon}
      className={cn("rounded-none", className)}
      iconClassName="h-1/4 w-1/4 min-h-6 min-w-6"
    />
  );
}
