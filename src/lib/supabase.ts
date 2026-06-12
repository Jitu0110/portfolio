// Re-exports the browser client for any client-side direct Supabase usage.
// API routes should use @/utils/supabase/server instead.
export { createClient } from "@/utils/supabase/client";
