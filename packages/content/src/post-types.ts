import { z } from "zod";
import { sanitizeUrl } from "@local-presence-ops/config";

export const localPostTypeSchema = z.enum(["update", "offer", "event"]);
export type LocalPostType = z.infer<typeof localPostTypeSchema>;

export const localPostStatusSchema = z.enum(["draft", "approved", "published"]);
export type LocalPostStatus = z.infer<typeof localPostStatusSchema>;

export const localPostSchema = z.object({
  id: z.string().uuid(),
  locationId: z.string().uuid(),

  type: localPostTypeSchema,

  title: z.string().min(1).max(120),
  body: z.string().min(1).max(1500),
  cta: z.string().max(60).nullable().default(null),
  link: z
    .string()
    .nullable()
    .optional()
    .default(null)
    .transform((value) => sanitizeUrl(value ?? null)),

  status: localPostStatusSchema.default("draft"),

  scheduledAt: z.coerce.date().nullable().default(null),
  publishedAt: z.coerce.date().nullable().default(null),
});

export type LocalPost = z.infer<typeof localPostSchema>;

export const newLocalPostSchema = localPostSchema.omit({ id: true });
export type NewLocalPost = z.infer<typeof newLocalPostSchema>;
