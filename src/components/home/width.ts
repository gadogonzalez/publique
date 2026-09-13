/** Shared inner grid for the homepage: the nav, the hero content, and
 * every section below the hero all use this same container so their
 * left/right edges align. The hero image itself stays full-bleed (100%
 * width); this only controls the max-width of what sits on top of/below
 * it. Tailwind's own breakpoints only (max-w-screen-2xl = 1536px), no
 * arbitrary custom breakpoints -- see PUBLIQUE_STYLE_GUIDE.md §8. */
export const HERO_GRID = "mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12";
