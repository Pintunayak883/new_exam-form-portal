"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone } from "lucide-react";

// Define form data type
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add contact form submission logic here (e.g., API call)
    console.log("Contact Form Data:", formData);
    // Reset form after submission
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-12">
        <section className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Contact Us
          </h1>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {/* Name Field */}
            <div>
              <Label htmlFor="name" className="text-blue-600">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-blue-600">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Message Field */}
            <div>
              <Label htmlFor="message" className="text-blue-600">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message"
                className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                rows={5}
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Send Message
            </Button>
          </form>

          {/* Contact Details */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Get in Touch
            </h2>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center justify-center">
                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                <a
                  href="mailto:info@examportal.com"
                  className="text-blue-600 hover:underline"
                >
                  info@examportal.com
                </a>
              </p>
              <p className="flex items-center justify-center">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                <a
                  href="tel:+919664483337"
                  className="text-blue-600 hover:underline"
                >
                  9664483337
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
