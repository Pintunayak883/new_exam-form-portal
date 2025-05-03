"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Define props type for HeroSection
interface HeroSectionProps {
  title?: string;
  tagline?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function HeroSection({
  title = "Welcome to Exam Form Portal",
  tagline = "Apply for System Support Administrator Role with Ease",
  ctaText = "Apply Now",
  ctaLink = "/user/apply",
}: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white min-h-[calc(100vh-64px-96px)] flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        {/* Welcome Message */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl mb-8">{tagline}</p>

        {/* Call-to-Action Button */}
        <Link href={ctaLink}>
          <Button
            variant="default"
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {ctaText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
