"use client";
import Link from "next/link";

// Define team member type
interface TeamMember {
  name: string;
  role: string;
}

export default function AboutPage() {
  // Team members data
  const teamMembers: TeamMember[] = [
    { name: "Pintu Nayak", role: "Full Stack Developer" },
    { name: "Kirti", role: "HR Manager" },
    { name: "Aman", role: "Backend Developer" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* About Us Section */}
        <section className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
            About Us
          </h1>

          {/* Who We Are */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Who We Are
            </h2>
            <p className="text-gray-700">
              We are a team of passionate developers building solutions that
              make life easier.
            </p>
          </div>

          {/* Our Team */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Our Team
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {teamMembers.map((member) => (
                <li key={member.name}>
                  <span className="font-medium">{member.name}</span> -{" "}
                  {member.role}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Contact Us
            </h2>
            <p className="text-gray-700">
              Email:{" "}
              <a
                href="mailto:info@examportal.com"
                className="text-blue-600 hover:underline"
              >
                info@examportal.com
              </a>
            </p>
            <p className="text-gray-700">
              Phone:{" "}
              <a
                href="tel:+919664483337"
                className="text-blue-600 hover:underline"
              >
                9664483337
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
