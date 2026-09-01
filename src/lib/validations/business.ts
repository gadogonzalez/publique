import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("URL inválida")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const businessHoursSchema = z.object({
  day_of_week: z.number().int().min(0).max(6),
  opens_at: z.string().nullable(),
  closes_at: z.string().nullable(),
  closed: z.boolean(),
});

export const businessFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Ingresá un nombre"),
  slug: z
    .string()
    .trim()
    .min(2, "Ingresá una URL")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  short_description: z.string().trim().max(200).optional(),
  long_description: z.string().trim().max(4000).optional(),
  logo_url: optionalUrl,
  cover_image_url: optionalUrl,
  whatsapp: z.string().trim().max(20).optional(),
  phone: z.string().trim().max(20).optional(),
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  website: optionalUrl,
  instagram: optionalUrl,
  address: z.string().trim().max(300).optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  location_id: z.string().uuid("Elegí una localidad"),
  status: z.enum(["draft", "active", "past_due", "suspended", "archived"]),
  plan_id: z.string().uuid().optional().nullable(),
  featured: z.boolean(),
  category_ids: z.array(z.string().uuid()).min(1, "Elegí al menos una categoría"),
  service_ids: z.array(z.string().uuid()).default([]),
  service_area_ids: z.array(z.string().uuid()).default([]),
  keywords: z.array(z.string().trim().min(1)).default([]),
  gallery_urls: z.array(z.string().url()).default([]),
  hours: z.array(businessHoursSchema).default([]),
});

export type BusinessFormValues = z.infer<typeof businessFormSchema>;
