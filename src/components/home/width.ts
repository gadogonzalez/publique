/** Homepage-only width system (see PUBLIQUE_STYLE_GUIDE.md §8, corrected).
 * Kept separate from the sitewide `.container` utility (used by every
 * other route, incl. admin) so the homepage can run a wider grid without
 * changing layout anywhere else. Every major homepage section uses one of
 * these two so headings/content share the same left/right axis. */
const GUTTER = "px-[clamp(24px,3vw,48px)]";

export const CONTENT = `mx-auto w-full max-w-[1440px] ${GUTTER}`;
export const WIDE = `mx-auto w-full max-w-[1520px] ${GUTTER}`;

/** Gutter-only, no max-width -- for the full-bleed hero and the nav that
 * floats over it, where content should spread to the true viewport edges
 * (minus the gutter) rather than center inside a capped box. */
export const FULL_BLEED_GUTTER = "px-6 sm:px-8 lg:px-12 xl:px-16";
