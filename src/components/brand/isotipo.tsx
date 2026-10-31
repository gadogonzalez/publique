import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Publiqué isotype -- cropped directly from the real logo file (the brand
 * manual's vector master, 03_Isotipo.svg, still isn't on hand), transparent
 * background, served through next/image like any other asset.
 * contentDispositionType is forced to "inline" sitewide (next.config.js),
 * which is what the previous hand-drawn-SVG version existed to work around
 * on Safari/iOS -- a raster PNG doesn't hit that quirk at all.
 */
export function PubliqueIsotipo({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-block", className)} aria-hidden="true">
      <Image src="/brand/isotipo.png" alt="" fill sizes="56px" className="object-contain" />
    </span>
  );
}
