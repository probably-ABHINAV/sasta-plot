
"use client"
import { useUser } from "@stackframe/stack"

export function useIsAdmin() {
  const user = useUser();
  const loading = user === undefined;

  const ADMIN_EMAILS = ["admin@sastaplots.in", "xoxogroovy@gmail.com"];

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.primaryEmail || "");

  return { isAdmin, user, loading }
}
