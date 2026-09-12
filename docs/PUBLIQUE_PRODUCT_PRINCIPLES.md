# Publiqué Product Principles

Status: **source of truth**. This document defines what Publiqué is, what
it is not, and how the product should behave and be talked about. Every
future design, UX, copy, and product decision should be checked against
it. It does not change anything in the live application by itself.

Companion document: `docs/PUBLIQUE_STYLE_GUIDE.md` defines HOW Publiqué
looks. This document defines WHAT Publiqué is. See §18.

---

## 1. What Publiqué is

Publiqué is a **local discovery platform**. Its purpose is to help people
discover local businesses, shops, restaurants and food businesses,
professionals, trades, local services, neighborhood businesses, and useful
places around them.

Core idea: **TU BARRIO EN UN SOLO LUGAR.**

Publiqué takes the useful concept behind a traditional neighborhood
magazine / local directory and turns it into a modern digital discovery
experience. It should preserve the feeling of:

- "Let's see what's around me."
- "Who does this near my neighborhood?"
- "I didn't know this business existed."
- "Where can I find this nearby?"
- "What businesses are in my area?"
- "Who offers this service around here?"

**The main product value is local discovery.** Not transactions. Not
hiring. Not job matching. Not quote comparison.

## 2. The mental model

Closest mental model: **local magazine + neighborhood guide + modern
search + business directory + local discovery.**

Explicitly NOT the mental model: TaskRabbit, Thumbtack, Upwork, Fiverr,
Angi, a gig marketplace, a quote marketplace, a booking marketplace, a
professional hiring platform.

Publiqué should feel like browsing and searching a living digital guide to
your neighborhood.

## 3. Core product loop

```
DISCOVER → EXPLORE → LEARN → CONTACT
```

Example: a user searches *"arreglo de aire acondicionado"*. Publiqué shows
relevant local businesses/services. The user explores results, opens a
business profile, and learns about the business — what it offers, where
it is, what areas it serves, opening hours, photos, description,
reputation/reviews when available. If interested, they contact the
business directly (WhatsApp, directions, website/Instagram when
appropriate).

**Publiqué facilitates discovery. The relationship after discovery happens
primarily between the customer and the business.**

## 4. What Publiqué is NOT

This is the most important section in this document.

Publiqué is **not** a marketplace where users publish a problem and
professionals compete for the job. Do not design flows such as:

```
"Describe your problem" → "Receive professionals" → "Compare quotes"
→ "Choose a professional" → "Book a visit"
```

Publiqué should NOT:

- assign professionals
- match jobs to professionals
- manage job requests
- collect competing quotes
- negotiate prices
- coordinate appointments between both parties
- manage service fulfillment
- manage payments between customer and professional
- take commission from individual jobs
- create bidding systems
- create lead marketplaces
- create "professionals available now" mechanics
- create gig-worker behavior

Do not introduce any of these unless the product strategy is explicitly
changed in the future, deliberately and with full awareness of the shift.

## 5. Two primary business types

For product communication and discovery, Publiqué organizes around two
broad, complementary ways of exploring the same local ecosystem:

**Locales comerciales** — restaurants, cafés, veterinarias, ferreterías,
viveros, dietéticas, talleres, gomerías, peluquerías, tiendas, panaderías,
farmacias, pet shops, mueblerías, comercios especializados. These usually
have a physical location customers can visit.

**Servicios** — plomeros, electricistas, gasistas, jardineros, técnicos,
carpinteros, pintores, arquitectos, contadores, fotógrafos, kinesiólogos,
gestores, servicios de mantenimiento. These may or may not have a physical
storefront; instead they can have a service area, neighborhood coverage,
or a base location.

**Important**: "Servicios" does not mean "hire someone through Publiqué."
It is simply another type of local discovery.

## 6. Categories

Below the two high-level concepts, categories organize discovery further:

**Locales comerciales**: Gastronomía, Automotor, Salud, Belleza, Mascotas,
Hogar, Compras, Otros.

**Servicios**: Hogar, Construcción, Profesionales, Técnicos, Salud,
Belleza, Automotor, Otros.

The exact taxonomy may evolve — do not over-engineer it prematurely. Users
should also be able to discover businesses naturally through search
without needing to understand the category structure at all.

## 7. Search philosophy

Search is a core discovery mechanism. Users do not need to know the exact
business name or category — natural-language search should work:

*"se me rompió la bomba de agua"* · *"necesito arreglar el aire"* ·
*"lugares para comer cerca"* · *"veterinaria"* · *"arreglan celulares"* ·
*"necesito un electricista"* · *"viandas"* · *"gomería"*

Search results always return **businesses/services**, never a job-posting
workflow. *"Necesito un electricista"* means **show me local
electricians**. It does not mean **create a job request and find someone
to accept it**. This distinction must stay consistent throughout the
product.

## 8. Homepage philosophy

The homepage combines **search** and **discovery** — it is not a
utility-only search engine. Users should be able to browse and discover
what exists locally even before they search.

Possible homepage content: search; Locales comerciales; Servicios;
Negocios destacados; Nuevos en Publiqué; Cerca tuyo; Explorá por
categoría; Explorá por zona; curated local content/recommendations in the
future; popular searches; local businesses worth discovering.

The homepage should feel alive and local. There is value on it even before
the user types anything.

## 9. Editorial / magazine DNA

Publiqué originated conceptually from the neighborhood magazine. We should
not reproduce a printed magazine's *visual* style literally, but we should
preserve its *product* qualities: curation, discovery, local identity,
serendipity, browsing, community, local business visibility.

A traditional neighborhood magazine lets someone encounter a business they
weren't explicitly searching for. Publiqué should preserve this behavior
digitally — which is exactly why the product must not become purely
transactional.

## 10. Business profile philosophy

A business profile is primarily **a digital presence**. It helps a
business explain who they are, what they do, where they are, what they
offer, why someone should choose them, and how to contact them.

Possible information: business name, category, description, photos,
services/products, address, service area, opening hours, reviews,
WhatsApp, Instagram, website, directions.

The profile should feel like a mini digital storefront / presence — **not
a contractor marketplace profile.**

## 11. Contact philosophy

- **Homepage/search** → discovery.
- **Business profile** → contact/conversion.

Avoid filling discovery cards with actions. Do not place WhatsApp, Call,
Book, Hire, or "Request quote" on every homepage business card. The
primary interaction with a business card is **open business**.

Once inside the profile, higher-intent actions can appear. Primary contact
action: **WhatsApp**. Secondary actions may include Cómo llegar,
Instagram, Website, depending on the business. Do not prioritize direct
phone-call CTAs.

## 12. Business value proposition

For businesses, Publiqué is primarily **local visibility + digital
presence + discovery + customer acquisition**. A business pays to be
visible where local customers are looking. We are not primarily selling
leads — we are selling presence + discovery.

Possible value proposition: *"Que tu barrio te encuentre."* Other
exploratory directions: *"Estar cerca también es estar visible."* ·
*"Tu negocio, donde tu barrio busca."* · *"Más cerca de tus próximos
clientes."* These are exploratory, not replacements for the primary brand
tagline unless explicitly approved.

## 13. Monetization principle

Primary model: **business subscription / listing presence.**

Potential future monetization: featured placement, promoted businesses,
top-of-category visibility, premium business pages, enhanced photography,
copywriting, social content, Google Business optimization, marketing
services, analytics/reporting.

**Do not** default to transaction commissions. Do not design monetization
around taking a percentage of a plumber/electrician/etc. job.

## 14. Language principles

Prefer words that reinforce discovery: Descubrí, Encontrá, Explorá,
Conocé, Cerca tuyo, En tu zona, Tu barrio, Negocios locales, Locales
comerciales, Servicios, Lugares, Recomendados, Destacados, Nuevos, Cerca.

Avoid language that implies marketplace mechanics: Contratá, Publicá tu
trabajo, Recibí presupuestos, Elegí un profesional, Solicitá
profesionales, Encontramos alguien por vos, Reservá un profesional,
Profesionales disponibles, Ofertas para tu trabajo, Recibí propuestas,
Compará presupuestos.

Be especially careful with *"Necesito un profesional"* — valid as a
**search query** the user types, invalid as the **product's own
positioning**.

## 15. Tone of voice

Publiqué should sound: local, simple, direct, warm, modern, human, useful.
Spanish should feel natural for Argentina.

Avoid: corporate jargon, startup jargon, overly technical language, forced
slang, marketing clichés, AI-sounding language, overexplaining features.

Copy should generally be short. The brand should feel confident enough not
to explain everything.

## 16. Copy examples

**Good** — reinforces discovery:

- "Encontrá lo que necesitás, cerca tuyo."
- "Tu barrio en un solo lugar."
- "Descubrí negocios cerca tuyo."
- "Locales comerciales y servicios de tu zona."
- "Explorá tu barrio."
- "Negocios que quizás todavía no conocés."
- "Todo más cerca."
- "¿Qué necesitás?"

**Bad** — describes a different product (a hiring/quote marketplace):

- "Conectamos clientes con profesionales calificados."
- "Publicá tu necesidad y recibí propuestas."
- "Encontrá al profesional ideal."
- "Solicitá presupuestos gratis."
- "Compará profesionales."
- "Contratá de forma segura."
- "Te conectamos con expertos disponibles."

## 17. Product decision filter

For every future feature, ask:

- Does this improve local discovery?
- Does this improve a business's digital presence?
- Does this help someone understand what exists nearby?
- Does this help a local business get discovered?

If yes, it likely belongs in Publiqué.

If the primary value is job matching, gig fulfillment, quote competition,
booking orchestration, or transaction management — it probably does not
belong in Publiqué.

## 18. Relationship with the Style Guide

Publiqué has a separate visual style guide: `docs/PUBLIQUE_STYLE_GUIDE.md`.

| Document | Responsibility |
|---|---|
| `PUBLIQUE_PRODUCT_PRINCIPLES.md` (this file) | **WHAT** Publiqué is |
| `PUBLIQUE_STYLE_GUIDE.md` | **HOW** Publiqué looks |

Future UI work must respect both. A visually beautiful screen that
violates the product principles is not a valid Publiqué design. A
functionally correct screen that ignores the style guide is also not a
finished Publiqué design.

## 19. Working rule for future changes

For every future Publiqué UX/UI task, read `docs/PUBLIQUE_PRODUCT_PRINCIPLES.md`
and `docs/PUBLIQUE_STYLE_GUIDE.md` before proposing or implementing
significant user-facing changes.

When interpreting ambiguous product requirements: **default toward local
discovery. Do not default toward marketplace mechanics.**

If a requested feature could fundamentally change Publiqué from a
discovery platform into a transactional/service marketplace, flag the
strategic implication before implementing it, rather than building it
silently.

## 20. Core definition

Internal one-line definition:

> "Publiqué es una plataforma para descubrir negocios, locales comerciales
> y servicios de tu zona."

Core brand idea:

> "TU BARRIO EN UN SOLO LUGAR."

Essential product loop:

```
DESCUBRIR → CONOCER → CONTACTAR
```

Not:

```
PEDIR → COTIZAR → CONTRATAR → GESTIONAR
```
