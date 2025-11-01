import React from "react";
import Link from "next/link";
import { Instagram, Linkedin, Facebook, Twitter, Mail } from "lucide-react";
import { RiVisaLine } from "react-icons/ri"; // Using a placeholder icon for "livevisa" style

const footerSections = [
  {
    title: "PRODUCTS",
    links: [
      { label: "Get the app", href: "#" },
      { label: "Visa", href: "#" },
      { label: "Passport", href: "#" },
      { label: "Destination", href: "#" },
      { label: "Visa pricing", href: "#" },
      { label: "Account", href: "#" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About Livevisa", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Get in touch", href: "#" },
    ],
    partner: {
      title: "PARTNER",
      links: [
        { label: "For expert", href: "#" },
        { label: "For agency", href: "#" },
        { label: "For startup", href: "#" },
        { label: "For corporate", href: "#" },
      ],
    },
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Support", href: "#" },
      { label: "Help", href: "#" },
      { label: "Legals", href: "#" },
      { label: "Policies", href: "#" },
    ],
    explore: {
      title: "EXPLORE",
      links: [
        { label: "Compare", href: "#" },
        { label: "Community", href: "#" },
        { label: "Wishlist", href: "#" },
      ],
    },
  },
];

export default function FooterMinimal() {
  return (
    <footer className="bg-[#111111] text-white pt-16 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-8 pb-12">
          {/* Column 1: Logo and Tagline */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">Travel Nepal</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Livevisa is the world's leading visa application for travelers.
            </p>
          </div>

          {/* Columns 2, 3, 4: Link Sections */}
          {footerSections.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-8">
              {/* Primary Section */}
              <div>
                <h4 className="text-sm font-extrabold tracking-wider text-zinc-300 mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map(link => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-400 hover:text-[#FF4E58] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Secondary Section (PARTNER/EXPLORE) */}
              {(section.partner || section.explore) && (
                <div>
                  <h4 className="text-sm font-extrabold tracking-wider text-zinc-300 mb-4">
                    {section.partner
                      ? section.partner.title
                      : section.explore.title}
                  </h4>
                  <ul className="space-y-3">
                    {(section.partner || section.explore).links.map(link => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-zinc-400 hover:text-[#FF4E58] transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Column 5: Follow Us */}
          <div className="space-y-8">
            {/* Follow Us */}
            <div>
              <h4 className="text-sm font-extrabold tracking-wider text-zinc-300 mb-4">
                FOLLOW US
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  target="_blank"
                  className="text-zinc-400 hover:text-[#FF4E58] transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  className="text-zinc-400 hover:text-[#FF4E58] transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  className="text-zinc-400 hover:text-[#FF4E58] transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  className="text-zinc-400 hover:text-[#FF4E58] transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
            {/* Email Subscription Placeholder (Optional based on image) */}
          </div>
        </div>

        {/* Bottom Bar: Copyright and Policy Links */}
        <div className="border-t border-zinc-800 pt-6 pb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-xs text-zinc-500">
            Copyright &copy; {new Date().getFullYear()} Livevisa Inc. All rights
            reserved.
          </p>
          <div className="text-xs space-x-4">
            <Link
              href="#"
              className="text-zinc-400 hover:text-[#FF4E58] transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-zinc-500">& &nbsp;</span>
            <Link
              href="#"
              className="text-zinc-400 hover:text-[#FF4E58] transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
