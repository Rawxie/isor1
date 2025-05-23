"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";

interface ImageGeneratorProps {
  prompt: string;
  onPromptChange: (value: string) => void;
}

const ImageGenerator = forwardRef(({ prompt, onPromptChange }: ImageGeneratorProps, ref) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focusPrompt: () => {
      inputRef.current?.focus();
    },
  }));

  async function query(data: any) {
    const response = await fetch(
      "https://api.stack-ai.com/inference/v0/run/451d2968-2035-422e-a3a3-a2eaff4afdce/67e197e79243101a48bbcf03",
      {
        headers: {
          Authorization: "Bearer 9e821633-7628-4b22-b703-c88311ac17c2",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const userId = "demo-user"; // Replace with real user/conversation ID if available
      const response = await query({
        "txt2img-0": prompt,
        "user_id": userId,
        "in-0": prompt,
      });
      console.log("Full API response:", response);
      // Try to extract the image URL from outputs['out-0'] (Markdown image string)
      let url = null;
      if (response.outputs && response.outputs["out-0"]) {
        const markdown = response.outputs["out-0"];
        const match = markdown.match(/!\[.*?\]\((.*?)\)/);
        if (match && match[1]) {
          url = match[1];
        }
      }
      // Fallbacks (if needed)
      if (!url) {
        if (response.image) url = response.image;
        else if (response.output) url = response.output;
        else if (response.url) url = response.url;
        else if (response.data && response.data.image_url) url = response.data.image_url;
        else {
          for (const key in response) {
            if (typeof response[key] === 'string' && response[key].startsWith('http')) {
              url = response[key];
              break;
            }
          }
        }
      }
      if (url) {
        setImageUrl(url);
      } else {
        setError("No image returned from API. Check console for details.");
      }
    } catch (e) {
      setError("Failed to generate image.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="image-generator" className="py-16 flex justify-center bg-navy-50">
      <div className="w-full max-w-2xl px-4 sm:px-8 text-center rounded-3xl shadow-2xl bg-white/70 border-2 border-navy-200 backdrop-blur-lg relative overflow-hidden glass-card">
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{boxShadow: '0 0 32px 4px #23395d33, 0 0 0 4px #e0e7ef'}} />
        <div className="relative z-10 pt-12 pb-6 px-2 sm:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display text-navy-800 drop-shadow">Generate Isometric Art</h2>
          <p className="mb-6 text-navy-700">Enter a prompt to generate a 3D isometric image using AI.</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 px-4 py-3 rounded-lg border border-navy-200 focus:outline-none focus:border-navy-500 font-sans text-navy-800 bg-white/80 shadow-sm"
              placeholder="Describe your image..."
              value={prompt}
              onChange={e => onPromptChange(e.target.value)}
              disabled={loading}
            />
            <button
              className="bg-gradient-to-r from-navy-700 via-navy-800 to-navy-600 text-white px-6 py-3 rounded-lg hover:from-navy-800 hover:to-navy-700 transition-colors font-sans border border-navy-800 shadow-md"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
          {error && <p className="text-red-500 mb-4 font-sans">{error}</p>}
          {imageUrl && (
            <div className="mb-4">
              <img
                src={imageUrl}
                alt="Generated preview"
                className="mx-auto rounded-xl max-h-96 object-contain border border-navy-200 shadow-lg bg-white/90"
              />
              <button
                className="mt-4 bg-gradient-to-r from-navy-700 via-navy-800 to-navy-600 text-white px-6 py-2 rounded-lg hover:from-navy-800 hover:to-navy-700 transition-colors font-sans border border-navy-800 shadow"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default ImageGenerator; 