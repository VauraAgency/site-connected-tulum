/**
 * Team log (Hector's portal) backend settings.
 * Both values are PUBLIC by design (they ship in the page); the data is protected by the login + row level security in portal/supabase.sql.
 * Leave empty and the portal runs in "preview mode" (data stays in the browser only).
 */
export const PORTAL = {
  url: "",     // e.g. "https://abcdxyz.supabase.co"
  anonKey: "", // the project's "anon public" key
};
