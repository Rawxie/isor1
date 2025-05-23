'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const partners = [
  { name: 'AWS', logo: '/partners/aws-logo (1).png' },
  { name: 'Microsoft for Startups', logo: '/partners/microsoft for startups.jpg' },
  { name: 'Google for Startups', logo: '/partners/googleforstartups (1).jpg' },
  { name: 'IBM', logo: '/partners/ibm.png' },
];

export default function Partners() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-navy-800">
            Trusted by Industry Leaders
          </h2>
        </div>
        
        {/* Glassmorphism wrapper for partners grid */}
        <div className="rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 items-center justify-items-center">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative w-40 h-20 grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 