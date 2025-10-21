import { defineCollection, z } from 'astro:content';

const dateField = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // "YYYY-MM-DD"
  z.date()                                 // YAML sin comillas -> Date
]).optional();

const shots = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    src: z.string().startsWith('/photos/'),
    srcs: z.array(z.string().startsWith('/photos/')).optional(),
    alt: z.string(),
    w: z.number().int().positive(),
    h: z.number().int().positive(),
    date: dateField,
    category: z.enum(['wildlife','macro','night']),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional()
  })
});

/** Fondos de pantalla (imágenes en /public/wallpapers/) */
const walls = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    src: z.string().startsWith('/wallpapers/'),
    alt: z.string().default('Fondo de pantalla'),
    w: z.number().int().positive(),
    h: z.number().int().positive(),
    date: dateField,
    orientation: z.enum(['portrait','landscape','square']).optional(),
    tags: z.array(z.string()).optional()
  })
});

export const collections = { shots, walls };
