import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  import.meta.env?.VITE_SUPABASE_URL ||
  "https://qarenkabrvqcmpaojfwv.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcmVua2FicnZxY21wYW9qZnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzY4NDAsImV4cCI6MjEwMzMxMjg0MH0.k0H0v6tj7KLD8jLlI7p0PmlzmhIgVvqbRjgqxGwE7NM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
