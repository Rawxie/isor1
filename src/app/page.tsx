"use client";
import Hero from '@/components/Hero';
import Partners from '@/components/Partners';
// import FeaturesOriginal from '../components/FeaturesOriginal';
import ImageGenerator from '../components/ImageGenerator';
import CommunityStats from '@/components/CommunityStats';
import Gallery from '@/components/Gallery';
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  return (
    <main className="min-h-screen">
      <Hero />
      <Partners />
      {/* <FeaturesOriginal /> */}
      <CommunityStats />
      <Gallery />
      <ImageGenerator prompt={prompt} onPromptChange={setPrompt} />
    </main>
  );
}
