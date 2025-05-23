'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Build', href: '/build' },
  { name: 'Community', href: '/community' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-white shadow-sm transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-navy-800 font-display">
              IsO3
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-navy-700 hover:text-navy-900 group relative font-sans"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-navy-800 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
              {!session && (
                <>
                  <Link href="/login" className="text-navy-700 hover:text-navy-900 font-sans">Login</Link>
                  <Link href="/signup" className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition font-semibold ml-2">Sign Up</Link>
                </>
              )}
              {session && (
                <>
                  <Link href="/account" className="text-navy-700 hover:text-navy-900 font-sans">Account</Link>
                  <button onClick={() => signOut({ callbackUrl: '/login' })} className="ml-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-semibold">Sign Out</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 