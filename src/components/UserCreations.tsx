'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Creation {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
}

const STYLE_FILTERS = [
  { id: 'all', name: 'All' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'cyberpunk', name: 'Cyberpunk' },
  { id: 'historical', name: 'Historical' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'minimalist', name: 'Minimalist' },
];

const SORT_OPTIONS = [
  { id: 'newest', name: 'Newest' },
  { id: 'oldest', name: 'Oldest' },
  { id: 'popular', name: 'Most Popular' },
];

export default function UserCreations() {
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [creations, setCreations] = useState<Creation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCreations();
  }, []);

  const fetchCreations = async () => {
    try {
      const response = await fetch('/api/generate-image');
      if (!response.ok) {
        throw new Error('Failed to fetch creations');
      }
      const data = await response.json();
      console.log('Fetched creations:', data);
      if (data.images) {
        setCreations(data.images);
      } else {
        console.error('No images in response:', data);
        setError('No images found in response');
      }
    } catch (error) {
      console.error('Error fetching creations:', error);
      setError('Failed to load your creations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${prompt.slice(0, 20)}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      setError('Failed to download image');
    }
  };

  const handleShare = async (imageUrl: string) => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      alert('Image URL copied to clipboard!');
    } catch (error) {
      console.error('Error sharing image:', error);
      setError('Failed to share image');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
        {error}
      </div>
    );
  }

  if (creations.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Creations Yet</h3>
        <p className="text-gray-400">Generate your first image to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Your Creations</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creations.map((creation) => (
          <div
            key={creation.id}
            className="group relative aspect-square overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-navy-900/50"
          >
            <div className="relative h-full w-full">
              <img
                src={creation.imageUrl}
                alt={creation.prompt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  console.error('Error loading image:', creation.imageUrl);
                  setError('Failed to load image');
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm text-white mb-3 line-clamp-2">
                {creation.prompt}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">
                  {new Date(creation.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(creation.imageUrl, creation.prompt)}
                    className="p-2 text-white hover:text-navy-300 transition-colors"
                    title="Download"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleShare(creation.imageUrl)}
                    className="p-2 text-white hover:text-navy-300 transition-colors"
                    title="Share"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 