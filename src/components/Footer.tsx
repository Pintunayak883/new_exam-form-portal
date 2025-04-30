"use client";
import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

// Define types for footer links
interface FooterLink {
  name: string;
  href: string;
}

// Define types for social media links
interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Footer links data (Useful Links)
const footerLinks: FooterLink[] = [
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

// Candidate links (from Navbar)
const candidateLinks: FooterLink[] = [
  { name: "Home", href: "/" },
  { name: "Apply", href: "/apply" },
  { name: "My Submissions", href: "/submissions" },
];

// Social media links data
const socialLinks: SocialLink[] = [
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { name: "GitHub", href: "https://github.com", icon: Github },
];

export default function Footer() {
  // Get current year for copyright notice
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="bg-blue-800 text-white py-8 footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Candidate Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-200">
              Candidate Portal
            </h3>
            <ul className="space-y-2">
              {candidateLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-blue-300 hover:text-blue-100 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-200">
              Useful Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-blue-300 hover:text-blue-100 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-200">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-100 transition-colors"
                  >
                    <Icon className="h-6 w-6" />
                    <span className="sr-only">{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Copyright Section */}
          <div className="flex items-center justify-center md:justify-end">
            <p className="text-sm text-blue-300">
              © {currentYear} Exam Form Portal. All rights reserved.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-700 mt-8 pt-4 text-center">
          <p className="text-xs text-blue-400">
            Built with ❤️ by [NetParm.pvt.ltd]
          </p>
        </div>
      </div>
    </footer>
  );
}
