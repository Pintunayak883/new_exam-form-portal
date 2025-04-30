"use client";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">Last Updated: April 2, 2025</p>
        </header>

        {/* Main Content */}
        <main className="bg-white p-8 rounded-lg shadow-lg">
          <section className="space-y-6 text-gray-700">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                Introduction
              </h2>
              <p>
                Welcome to the Exam Form Portal ("we," "us," or "our"). We are
                committed to protecting your privacy and ensuring that your
                personal information is handled in a safe and responsible
                manner. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                website and services.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                Information We Collect
              </h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  phone number, and other details you provide when registering
                  or applying as a Chief Invigilator.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you use our
                  website, such as IP address, browser type, and pages visited.
                </li>
                <li>
                  <strong>Cookies:</strong> We use cookies to enhance your
                  experience. You can manage your cookie preferences in your
                  browser settings.
                </li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                How We Use Your Information
              </h2>
              <p>
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To process your applications and manage your account.</li>
                <li>
                  To communicate with you, including sending updates and
                  notifications.
                </li>
                <li>
                  To improve our website and services based on user feedback and
                  usage patterns.
                </li>
                <li>
                  To comply with legal obligations and protect our rights.
                </li>
              </ul>
            </div>

            {/* How We Share Your Information */}
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                How We Share Your Information
              </h2>
              <p>
                We do not sell or rent your personal information to third
                parties. We may share your information in the following cases:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  With service providers who assist us in operating our website
                  and services (e.g., hosting providers, payment processors).
                </li>
                <li>When required by law or to respond to legal processes.</li>
                <li>
                  To protect the rights, property, or safety of our users or the
                  public.
                </li>
              </ul>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                Data Security
              </h2>
              <p>
                We implement reasonable security measures to protect your
                information from unauthorized access, use, or disclosure.
                However, no method of transmission over the internet or
                electronic storage is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                Your Rights
              </h2>
              <p>
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The right to access the personal information we hold about
                  you.
                </li>
                <li>
                  The right to request correction or deletion of your personal
                  information.
                </li>
                <li>
                  The right to object to or restrict certain types of
                  processing.
                </li>
                <li>
                  The right to withdraw consent at any time, where applicable.
                </li>
              </ul>
              <p>
                To exercise these rights, please contact us at{" "}
                <a
                  href="mailto:support@examportal.com"
                  className="text-blue-600 hover:underline"
                >
                  support@examportal.com
                </a>
                .
              </p>
            </div>

            {/* Changes to This Privacy Policy */}
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. We will notify
                you of any significant changes by posting the updated policy on
                this page with a revised "Last Updated" date.
              </p>
            </div>

            {/* Contact Us */}
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                Contact Us
              </h2>
              <p>
                If you have any questions or concerns about this Privacy Policy,
                please contact us at:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:support@examportal.com"
                    className="text-blue-600 hover:underline"
                  >
                    support@examportal.com
                  </a>
                </li>
                <li>Phone: +91 123-456-7890</li>
                <li>Address: 123 Exam Street, Education City, India</li>
              </ul>
            </div>
          </section>
        </main>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-blue-600 hover:underline text-lg">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
