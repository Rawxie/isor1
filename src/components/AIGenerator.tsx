'use client';

import { useState } from 'react';

export default function AIGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (!data.imageUrl) {
        throw new Error('No image URL in response');
      }

      setGeneratedImage(data.imageUrl);
    } catch (error) {
      console.error('Failed to generate image:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-navy-900/50 shadow-xl">
      {/* Prompt Input */}
      <div className="mb-6">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Describe your scene...
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A futuristic cityscape with neon lights and flying cars..."
          className="w-full h-32 bg-gray-700/50 border border-navy-900/50 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full bg-navy-600 hover:bg-navy-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>Generate Image</span>
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-300 hover:text-red-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Generated Image */}
      {generatedImage && (
        <div className="mt-6">
          <img
            src={generatedImage}
            alt="Generated image"
            className="w-full rounded-lg"
            onError={(e) => {
              console.error('Error loading image:', e);
              setError('Failed to load the generated image');
            }}
          />
        </div>
      )}

      {/* Info Text */}
      <div className="mt-6 text-sm text-gray-400">
        <p>💡 Tip: Be specific about colors, lighting, and mood for better results</p>
      </div>
    </div>
  );
} 