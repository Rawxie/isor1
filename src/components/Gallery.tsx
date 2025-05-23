'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Gallery images with correct file extensions
const galleryImages = [
  { src: '/gallery/1.jpeg', alt: 'Isometric Art 1' },
  { src: '/gallery/2.jpeg', alt: 'Isometric Art 2' },
  { src: '/gallery/3.jpeg', alt: 'Isometric Art 3' },
  { src: '/gallery/4.jpeg', alt: 'Isometric Art 4' },
  { src: '/gallery/5.jpeg', alt: 'Isometric Art 5' },
  { src: '/gallery/6.jpeg', alt: 'Isometric Art 6' },
  { src: '/gallery/7.jpeg', alt: 'Isometric Art 7' },
  { src: '/gallery/8.jpeg', alt: 'Isometric Art 8' },
  { src: '/gallery/9.jpeg', alt: 'Isometric Art 9' },
];

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Gallery</h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-sans">
            Explore our collection of AI-generated isometric art
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.alt}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-lg border border-navy-100 bg-white/80 hover:shadow-2xl hover:border-navy-300 transition-all"
              onClick={() => setOpenIndex(index)}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 text-white text-lg font-bold drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.alt}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Modal/Lightbox */}
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIndex(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full mx-4 rounded-3xl overflow-hidden shadow-2xl bg-white/90 border-2 border-navy-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 bg-navy-800 text-white rounded-full p-2 shadow hover:bg-navy-700 transition-colors"
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
              <div className="relative w-full aspect-[4/3] bg-navy-50">
                <Image
                  src={galleryImages[openIndex!].src}
                  alt={galleryImages[openIndex!].alt}
                  fill
                  className="object-contain rounded-3xl"
                  priority
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-navy-800 mb-2 font-display">{galleryImages[openIndex!].alt}</h3>
                <button
                  className="mt-2 px-6 py-2 rounded-lg bg-navy-800 text-white hover:bg-navy-700 transition-colors font-sans shadow"
                  onClick={() => setOpenIndex(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 