import { EnquiryForm } from "@/components/enquiry-form"

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Contact Us</h1>
      <p className="mt-2 text-muted-foreground">Send us a message and we’ll get back within 24 hours.</p>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <EnquiryForm />
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Office</h2>
            <p className="text-sm text-muted-foreground">Coimbatore, Tamil Nadu</p>
            <p className="text-sm text-muted-foreground">Phone: +91-00000 00000</p>
            <p className="text-sm text-muted-foreground">Email: info@example.com</p>
          </div>
          <div className="aspect-[16/9] overflow-hidden rounded-lg border">
            <iframe
              src="https://maps.google.com/maps?q=Coimbatore&t=&z=12&ie=UTF8&iwloc=&output=embed"
              title="Office location"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
