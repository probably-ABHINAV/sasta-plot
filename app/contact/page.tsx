import InquiryForm from "@/components/inquiry-form"
import Image from "next/image"

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h1 className="font-heading text-3xl font-semibold md:text-4xl">Contact Us</h1>
          <p className="text-muted-foreground">
            Share your details and preferences. Our team will call you back and help plan a site visit.
          </p>
          <div className="overflow-hidden rounded-lg border">
            <Image
              src="/images/plots/plot-6.png"
              alt="Residential plots"
              width={900}
              height={600}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
        <InquiryForm />
      </div>
    </main>
  )
}
