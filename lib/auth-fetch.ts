import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "./supabase-browser";

export function storeClientSession(session: Session | null) {
  if (typeof window === "undefined" || !session) return;

  localStorage.setItem("sb_access_token", session.access_token);
  localStorage.setItem("sb_refresh_token", session.refresh_token);
  localStorage.setItem(
    "sb_user",
    JSON.stringify({ email: session.user.email, id: session.user.id })
  );
}

async function getClientToken() {
  if (typeof window === "undefined") return null;

  const storedToken = localStorage.getItem("sb_access_token");
  if (storedToken) return storedToken;

  const supabase = getSupabaseBrowser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  storeClientSession(session);
  return session?.access_token || null;
}

async function refreshClientToken() {
  if (typeof window === "undefined") return null;

  const supabase = getSupabaseBrowser();
  const {
    data: { session },
  } = await supabase.auth.refreshSession();

  storeClientSession(session);
  return session?.access_token || null;
}

export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);
  const token = await getClientToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });
  if (response.status !== 401) return response;

  const refreshedToken = await refreshClientToken();
  if (!refreshedToken || refreshedToken === token) return response;

  const retryHeaders = new Headers(options.headers);
  retryHeaders.set("Authorization", `Bearer ${refreshedToken}`);
  return fetch(url, { ...options, headers: retryHeaders });
}
