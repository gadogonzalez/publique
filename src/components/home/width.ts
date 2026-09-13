/** Homepage-only width system (see PUBLIQUE_STYLE_GUIDE.md §8, corrected).
 * Kept separate from the sitewide `.container` utility (used by every
 * other route, incl. admin) so the homepage can run a wider grid without
 * changing layout anywhere else. Every major homepage section uses one of
 * these two so headings/content share the same left/right axis. */
const GUTTER = "px-[clamp(24px,3vw,48px)]";

export const CONTENT = `mx-auto w-full max-w-[1440px] ${GUTTER}`;
export const WIDE = `mx-auto w-full max-w-[1520px] ${GUTTER}`;

/** Shared inner grid for the nav + hero content that float over the
 * full-bleed hero image. The hero BACKGROUND stays 100% width; this is
 * the max-width that controls the nav and hero content so they don't
 * stretch indefinitely on large desktops. Tailwind's own breakpoints
 * only (max-w-screen-2xl = 1536px), no arbitrary custom breakpoints. */
export const HERO_GRID = "mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12";
