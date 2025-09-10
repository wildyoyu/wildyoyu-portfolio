import { defineCollection, z } from 'astro:content';

const shots = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    src: z.string().startsWith('/'),                  // portada de la baldosa
    srcs: z.array(z.string().startsWith('/')).default([]), // fotos extra del carrusel (opcional)
    alt: z.string(),
    w: z.number().int().positive(),
    h: z.number().int().positive(),
    date: z.coerce.date().optional(),
    category: z.string().default('macro'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { shots };
