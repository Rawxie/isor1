"use client";
import Image from "next/image";

const team = [
  { name: "Alex Kim", role: "Founder & Visionary", caption: "Dreams in polygons.", img: "/gallery/1.jpeg" },
  { name: "Priya Singh", role: "AI Lead", caption: "Turning code into creativity.", img: "/gallery/2.jpeg" },
  { name: "Liam Chen", role: "Community Manager", caption: "Building bridges, not walls.", img: "/gallery/3.jpeg" },
  { name: "Sara Lopez", role: "Design Director", caption: "Coloring outside the lines.", img: "/gallery/4.jpeg" },
];

const milestones = [
  { title: "500+ AI Creations Generated", date: "2024" },
  { title: "Launched v1.0 – R1.0 by Let's Connect Group", date: "2024" },
  { title: "Partnered with AWS, Google, IBM, Microsoft", date: "2024" },
  { title: "Community growth: 500+ accounts, 300+ projects", date: "2024" },
];

export default function AboutPage() {
  return (
    <main className="w-full bg-gray-100 text-navy-900">
      {/* Header Section */}
      <header className="relative w-full min-h-[320px] flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-navy-50 via-white to-navy-100 opacity-90" />
          <Image src="/globe.svg" alt="Mesh Overlay" fill className="object-cover opacity-20" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-4 text-navy-800">About IsoR-1</h1>
          <p className="text-xl md:text-2xl text-navy-700 font-sans mb-2">Blending AI, Culture, and Imagination</p>
        </div>
      </header>

      {/* Mission Section */}
      <section className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 font-display text-navy-800">Our Mission</h2>
        <p className="text-lg text-navy-700 font-sans italic">
          To empower creators across the globe to explore, reimagine, and visualize cultural and historical narratives through AI-generated surrealism and 3D isometric art.
        </p>
      </section>

      {/* What We Do Section */}
      <section className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 font-display text-navy-800">What We Do</h2>
          <ul className="list-disc pl-6 text-lg text-navy-700 font-sans space-y-3">
            <li>AI-based image generation engine trained on artistic and historical datasets</li>
            <li>Realistic 3D isometric visual output</li>
            <li>Community engagement through challenges</li>
            <li>Empowering creators with prompt-to-art experiences</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-navy-200 bg-white">
            <Image src="/gallery/1.jpeg" alt="Isometric AI Art" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-10 font-display text-navy-800 text-center">Meet the Minds</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member) => (
            <div key={member.name} className="bg-white/80 rounded-2xl shadow-lg border border-navy-100 p-6 flex flex-col items-center group hover:shadow-blue-400/40 hover:border-blue-400 transition-all duration-300">
              <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-navy-200 group-hover:shadow-lg group-hover:shadow-blue-400/40">
                <Image src={member.img} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold text-navy-800 mb-1 font-display">{member.name}</h3>
              <p className="text-navy-600 font-semibold mb-1">{member.role}</p>
              <p className="text-navy-500 text-sm italic">{member.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones/Impact Section */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-10 font-display text-navy-800 text-center">Impact & Milestones</h2>
        <div className="relative border-l-4 border-navy-200 pl-8 ml-4">
          {milestones.map((m, i) => (
            <div key={i} className="mb-10 relative">
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-navy-800 border-4 border-white shadow" />
              <div className="bg-white/90 rounded-xl shadow p-4">
                <div className="text-navy-800 font-bold text-lg">{m.title}</div>
                <div className="text-navy-500 text-sm">{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join Us CTA Section */}
      <section className="w-full py-16 px-4 flex flex-col items-center justify-center bg-gradient-to-r from-navy-50 via-white to-navy-100">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display text-navy-800 text-center">Be Part of the IsoR-1 Movement</h2>
        <p className="text-lg text-navy-700 mb-8 text-center max-w-2xl font-sans">
          Creators, dreamers, and innovators — join our global community and reshape the visual future.
        </p>
        <a href="/community" className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-navy-700 via-navy-800 to-navy-600 text-white font-bold text-lg shadow-lg hover:from-navy-800 hover:to-navy-700 transition-colors border-2 border-navy-800">
          Join the Community
        </a>
      </section>
    </main>
  );
} 