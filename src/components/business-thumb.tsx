import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Cover-image tile used across listings/profile. Businesses without
 * photography get an intentional monogram tile instead of a broken image
 * or a generic icon.
 */
export function BusinessThumb({
  src,
  name,
  className,
  sizes,
  priority,
}: {
  src?: string | null;
  name: string;
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
    <div
      className={cn(
        "flex items-center justify-center bg-secondary",
        className
      )}
    >
      <span className="font-serif text-3xl text-secondary-foreground/40">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
