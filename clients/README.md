# clients/

Reserved for per-client configuration overrides that don't belong in the
database (e.g. a client-specific report template tweak, a naming
convention). Empty for the MVP — the one demo client
("Clínica Odonto Vale") lives entirely in `apps/web/lib/demo-repository.ts`
and `scripts/demo.ts`, and real clients live in Supabase (see
[docs/ADDING_CLIENT.md](../docs/ADDING_CLIENT.md)). Add a file here only
when a client needs something that config/database fields can't express.
