import { z } from "zod";

export const clientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
  timezone: z.string().min(1),
  industry: z.string().min(1),
  website: z.string().url().nullable().default(null),
  contactEmail: z.string().email(),
  createdAt: z.coerce.date(),
});

export type Client = z.infer<typeof clientSchema>;

export const newClientSchema = clientSchema.omit({
  id: true,
  createdAt: true,
});

export type NewClient = z.infer<typeof newClientSchema>;
