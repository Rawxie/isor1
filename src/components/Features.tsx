'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Button {
  text: string;
  href: string;
  primary?: boolean;
}

interface Feature {
  title: string;
  description: string;
  buttons: Button[];
}

interface FeaturesProps {
  prompt: string;
  onPromptChange: (value: string) => void;
}

const features: Feature[] = [
  {
    title: 'Automated Image Synthesis and Design',
    description: 'Experience the power of AI-driven image generation with our advanced synthesis technology.',
    buttons: [
      { text: 'YouTube', href: '#' },
      { text: 'Podcast', href: '#' },
    ],
  },
  {
    title: 'Create stunning visual in seconds',
    description: 'Transform your ideas into beautiful isometric art with just a few clicks.',
    buttons: [
      { text: 'Write Prompt → Generate Image', href: '#', primary: true },
    ],
  },
];

export default function Features({ prompt, onPromptChange }: FeaturesProps) {
  // Handler to scroll and focus the prompt input
  const handlePromptClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById('image-generator');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const input = section.querySelector('input');
        if (input) (input as HTMLInputElement).focus();
      }, 600);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display text-navy-800">Features</h2>
          <p className="text-navy-700 max-w-2xl mx-auto font-sans">
            Experience the power of AI-driven isometric art generation with our cutting-edge features
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-navy-50 p-8 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2 font-display text-navy-800">{feature.title}</h3>
              <p className="text-navy-700 font-sans">{feature.description}</p>
              <div className="flex flex-wrap gap-4 mt-4">
                {feature.buttons.map((button) => (
                  button.text === 'Write Prompt → Generate Image' ? (
                    <input
                      key={button.text}
                      type="text"
                      className="flex-1 px-4 py-3 rounded-lg border border-navy-200 focus:outline-none focus:border-navy-500 font-sans text-navy-800"
                      placeholder="Write your prompt here..."
                      value={prompt}
                      onChange={e => onPromptChange(e.target.value)}
                    />
                  ) : (
                    <a
                      key={button.text}
                      href={button.href}
                      className={button.primary 
                        ? 'bg-navy-800 text-white px-6 py-3 rounded-lg hover:bg-navy-700 transition-colors'
                        : 'border-2 border-navy-800 text-navy-800 px-6 py-3 rounded-lg hover:bg-navy-50 transition-colors'
                      }
                    >
                      {button.text}
                    </a>
                  )
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 