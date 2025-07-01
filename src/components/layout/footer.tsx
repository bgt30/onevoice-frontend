import Link from "next/link"

const footerNavigation = {
  service: [
    { name: "Features", href: "/features" },
    { name: "How it Works", href: "/how-it-works" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-black">OneVoice</span>
              </Link>
              <p className="mt-4 text-sm text-gray-500 max-w-xs">
                Professional video dubbing service powered by AI.
              </p>
            </div>

            {/* Service Links */}
            <div>
              <h3 className="text-sm font-semibold text-black uppercase tracking-wider">
                Service
              </h3>
              <ul className="mt-4 space-y-3">
                {footerNavigation.service.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-500 hover:text-black transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-black uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-500 hover:text-black transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-sm font-semibold text-black uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                {footerNavigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-500 hover:text-black transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2025 OneVoice. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0">
                <p className="text-sm text-gray-500">
                  Contact us:{" "}
                  <a
                    href="mailto:support@onevoice.com"
                    className="text-black hover:underline"
                  >
                    support@onevoice.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
