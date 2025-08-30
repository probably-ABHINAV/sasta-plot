export default function NotFound() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-semibold mb-4 text-balance">Page not found</h1>
      <p className="text-muted-foreground mb-6">The page you’re looking for doesn’t exist or may have moved.</p>
      <a
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:opacity-90"
      >
        Go home
      </a>
    </main>
  )
}
