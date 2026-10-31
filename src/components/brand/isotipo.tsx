/**
 * Publiqué isotype, inlined directly (not served through next/image) --
 * it's a small, static, decorative mark, so there's no resizing/format
 * benefit to the image optimizer, and this sidesteps the content-
 * disposition/optimizer quirk that broke the file-based version on
 * Safari/iOS (it tried to download the SVG instead of rendering it).
 *
 * Hand-built recreation of the brand manual's isotype (gradient pin,
 * #7C42EF -> #2F8CFE, 135°) -- the real vector master (03_Isotipo.svg
 * per the manual's asset checklist) wasn't available. Swap for the
 * official file when it's on hand; this is a close approximation.
 */
export function PubliqueIsotipo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="publique-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C42EF" />
          <stop offset="100%" stopColor="#2F8CFE" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="98" fill="url(#publique-gradient)" />
      <circle cx="100" cy="94" r="36" fill="#FFFFFF" />
      <circle cx="100" cy="94" r="23" fill="url(#publique-gradient)" />
      <rect
        x="79.3"
        y="126.3"
        width="42.4"
        height="42.4"
        rx="9"
        fill="#FFFFFF"
        transform="rotate(45 100 147.5)"
      />
    </svg>
  );
}
