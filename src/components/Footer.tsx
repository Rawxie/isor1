'use client';

import Link from 'next/link';

const footerLinks = {
  ether: [
    { name: 'Grants', href: '#' },
    { name: 'Generator', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Disclaimer', href: '#' },
  ],
  connect: [
    { name: 'Services', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Newsletter', href: '#' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: '#' },
  { name: 'Discord', href: '#' },
  { name: 'GitHub', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="mb-8 md:mb-0">
              <Link href="/" className="text-2xl font-bold text-white font-display">
                IsO3
              </Link>
              <p className="mt-4 text-gray-400 max-w-xs font-sans">
                Transform your ideas into stunning isometric art with our AI-powered platform
              </p>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          
          {/* ETHER */}
          <div>
            <h4 className="text-lg font-semibold mb-4">ETHER</h4>
            <ul className="space-y-2">
              {footerLinks.ether.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors font-sans"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* GET CONNECTED */}
          <div>
            <h4 className="text-lg font-semibold mb-4">GET CONNECTED</h4>
            <ul className="space-y-2">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors font-sans"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-full bg-[#EEE5D9] text-[#23395d] font-semibold hover:bg-[#e0d6c8] transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Is03. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 