import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Square, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import plot data
import plotsData from "@/data/plots.json";

interface Plot {
  id: number | string;
  title: string;
  location: string;
  price: number;
  size_sqyd: number;
  size_unit?: string;
  description: string;
  featured?: boolean;
  slug: string;
  image: string;
  mapUrl?: string;
  gallery?: string[];
  latitude?: number;
  longitude?: number;
  created_at: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all plots
export async function generateStaticParams() {
  return plotsData.map((plot) => ({
    slug: plot.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const plot = plotsData.find((p) => p.slug === params.slug);
  
  if (!plot) {
    return {
      title: "Plot Not Found - Sasta Plots",
    };
  }

  return {
    title: `${plot.title} - Sasta Plots`,
    description: plot.description,
  };
}

export default function PlotDetailPage({ params }: PageProps) {
  // Find the plot by slug
  const plot = plotsData.find((p) => p.slug === params.slug) as Plot | undefined;

  // If plot not found, show 404
  if (!plot) {
    notFound();
  }

  const pricePerUnit = plot.size_sqyd 
    ? (plot.price / plot.size_sqyd).toLocaleString('en-IN')
    : 'N/A';

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50/30 via-background to-red-50/30">
      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={plot.image}
                  alt={plot.title}
                  fill
                  className="object-cover"
                  priority
                />
                {plot.featured && (
                  <Badge className="absolute top-4 right-4 bg-orange-600">
                    Featured
                  </Badge>
                )}
              </div>
            </Card>

            {/* Title and Location */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                {plot.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{plot.location}</span>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">About This Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {plot.description}
                </p>
              </CardContent>
            </Card>

            {/* Gallery */}
            {plot.gallery && plot.gallery.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Photo Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {plot.gallery.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={img}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Card */}
            <Card className="sticky top-6">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Price</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ₹{plot.price.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plot Size</span>
                    <span className="font-semibold">
                      {plot.size_sqyd} {plot.size_unit || 'sq.yd'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per {plot.size_unit || 'sq.yd'}</span>
                    <span className="font-semibold">₹{pricePerUnit}</span>
                  </div>
                  {plot.latitude && plot.longitude && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coordinates</span>
                      <span className="font-semibold text-xs">
                        {plot.latitude.toFixed(4)}, {plot.longitude.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Map Button */}
                {(plot.mapUrl || (plot.latitude && plot.longitude)) && (
                  <a
                    href={
                      plot.mapUrl ||
                      `https://www.google.com/maps?q=${plot.latitude},${plot.longitude}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                      <MapPin className="h-4 w-4" />
                      View on Google Maps
                    </Button>
                  </a>
                )}

                {/* Contact Button */}
                <Link href="/#contact">
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                    Schedule a Visit
                  </Button>
                </Link>

                <p className="text-xs text-center text-muted-foreground">
                  Listed on {new Date(plot.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </CardContent>
            </Card>

            {/* Features Card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Property Features</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <Square className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Clear Title</p>
                      <p className="text-sm text-muted-foreground">
                        Verified documentation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Prime Location</p>
                      <p className="text-sm text-muted-foreground">
                        {plot.location}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
