import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/servicios' }),
  schema: z.object({
    titulo:         z.string(),
    descripcion:    z.string(),
    imagen:         z.string(),
    orden:          z.number().optional(),
    especialidades: z.array(z.string()).optional(),
  }),
});

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/proyectos' }),
  schema: z.object({
    titulo:    z.string(),
    ubicacion: z.string(),
    categoria: z.enum(['Obras Civiles', 'Infraestructura', 'Electromecánica', 'Paisajismo', 'Minería', 'Consultoría']),
    año:       z.number(),
    imagen:    z.string(),               // foto principal
    galeria:   z.array(z.string()).optional(), // fotos adicionales
    destacado: z.boolean().default(false),    // ¿aparece en el home?
    orden:     z.number().optional(),
  }),
});

export const collections = { servicios, proyectos };