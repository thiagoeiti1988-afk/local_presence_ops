import { z } from "zod";

/**
 * Server-side environment schema. Google and OpenAI credentials are
 * intentionally optional — the MVP must run with mock/manual providers when
 * they are absent (see docs/GOOGLE_API.md).
 */
export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  GOOGLE_PLACES_API_KEY: z.string().min(1).optional(),
  APP_URL: z.string().url().default("http://localhost:3000"),
  USE_DEMO_DATA: z
    .string()
    .optional()
    .transform((v) => v !== "false"),
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  return envSchema.parse(source);
}

/** True when Supabase is fully configured and demo mode wasn't forced. */
export function hasSupabaseConfig(env: AppEnv): boolean {
  return (
    !env.USE_DEMO_DATA &&
    Boolean(env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}
