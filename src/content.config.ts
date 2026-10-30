import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

export const BandEnum = z.enum([
  'North Sea Echoes',
  'Kings of Mercia',
  'Tuesday The Sky',
  'Fates Warning',
  'Arch / Matheos',
  'Tim Bowness',
  'goestoeleven',
  'Headless',
  'Jim Matheos',
  'OSI',
  'Memories Of Machines',
  'Gordian Knot',
  'John Arch',
]);

export const GearStatusEnum = z.enum(['current', 'past']);

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

const discographyCollection = defineCollection({
  loader: file('src/content/discography.json'),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      year: z.number().int().min(1980).max(2035),
      band: BandEnum,
      album: z.string().min(1),
      comments: z.string().optional(),
      coverImage: image().optional(),
      links: z
        .array(
          z.object({
            label: z.string(),
            url: z.url(),
          })
        )
        .optional(),
    }),
});

const gearCollection = defineCollection({
  loader: file('src/content/gear.json'),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string().min(1),
      status: GearStatusEnum,
      caption: z.string().min(1),
      image: image(),
      details: z.string().optional(),
      order: z.number().int().default(99),
    }),
});

export const collections = {
  post: postCollection,
  discography: discographyCollection,
  gear: gearCollection,
};
