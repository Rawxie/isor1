import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import AIGenerator from "@/components/AIGenerator";
import UserCreations from "@/components/UserCreations";

export default async function BuildPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/50 via-gray-900 to-navy-900/50" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-6">
              Create & Explore Your World
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Use powerful AI prompts to generate stunning 3D isometric visuals
            </p>
            <button className="bg-navy-600 hover:bg-navy-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto">
              <span>Learn how it works</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* AI Generator Section */}
        <div className="mb-16">
          <AIGenerator />
        </div>

        {/* User Creations Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white font-display mb-4">Your Creations</h2>
            <p className="text-gray-300">Every image you generate is saved here</p>
          </div>
          <UserCreations />
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white font-display mb-4">
            Join a Movement of Visual Storytellers
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your imagination is the blueprint — we bring it to life with AI.
          </p>
          <button className="bg-navy-600 hover:bg-navy-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200">
            Join the Community
          </button>
        </div>
      </div>
    </div>
  );
} 