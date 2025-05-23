'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-50 via-white to-navy-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display text-navy-800">
              Harnessing Artificial Intelligence Tools for 3D Isometric Images Generator
            </h1>
            
            <p className="text-navy-700 text-lg mb-8 font-sans">
              Transform your ideas into stunning isometric art with our AI-powered platform. 
              Create unique, cultural, and historical 3D images in seconds.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-navy-800 text-white px-6 py-3 rounded-lg hover:bg-navy-700 transition-colors">
                Try Free ↑
              </button>
              <button className="border-2 border-navy-800 text-navy-800 px-6 py-3 rounded-lg hover:bg-navy-50 transition-colors">
                Learn More
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-8">
              <div className="bg-navy-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-navy-800">500+</p>
                <p className="text-navy-700">Creations</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src="/gallery/1.jpeg"
                    alt="Community"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-navy-700">
                  We have the best AI image generator
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-navy-50 p-4 rounded-lg shadow-lg">
              <div className="relative w-full aspect-square">
                <Image
                  src="/gallery/1.jpeg"
                  alt="AI Generated Isometric Art"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 