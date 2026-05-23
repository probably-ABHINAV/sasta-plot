import { useUser } from "@stackframe/stack"
import Link from "next/link"

export default function AuthLinks({ mobile = false }: { mobile?: boolean }) {
  const user = useUser()

  const linkBase = mobile ? "block rounded-md px-3 py-2 text-sm" : "text-sm font-medium"
  const primaryBtn = mobile
    ? "block rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
    : "inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"

  // Stack Auth handles the "loading" state internally mostly, 
  // but if we want to show a loader, useUser returns undefined explicitly when loading?
  // Actually useUser returns null | User | undefined (loading).
  if (user === undefined) {
      return (
        <span className={mobile ? "px-3 py-2 text-sm text-muted-foreground" : "text-sm text-muted-foreground"}>…</span>
      )
  }

  if (!user) {
    return (
      <div className={mobile ? "grid gap-1" : "flex items-center gap-3"}>
        <Link href="/handler/sign-in" className={`${linkBase} ${mobile ? "hover:bg-secondary" : "hover:opacity-80"}`}>
          Sign in
        </Link>
        <Link href="/handler/sign-up" className={primaryBtn}>
          Create account
        </Link>
      </div>
    )
  }

  // Check if admin
  const ADMIN_EMAILS = ["admin@sastaplots.in"]; 
  const isAdmin = user.primaryEmail && ADMIN_EMAILS.includes(user.primaryEmail);

  return (
    <div className={mobile ? "grid gap-1" : "flex items-center gap-3"}>
      {!mobile && <span className="hidden sm:inline text-xs text-muted-foreground">{user.primaryEmail}</span>}
      
      {isAdmin && (
        <Link
            href="/dashboard-admin-2024"
            className={`${linkBase} ${mobile ? "hover:bg-secondary" : "hover:opacity-80"} text-blue-600 font-bold`}
        >
            Admin Dashboard
        </Link>
      )}

      {/* Basic User Dashboard or Profile Link could go here if needed */}
      
      <Link
        href="/handler/sign-out"
        className={`${linkBase} ${mobile ? "hover:bg-secondary" : "text-muted-foreground hover:text-foreground"}`}
      >
        Logout
      </Link>
    </div>
  )
}
