import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              TerraHacks Project
            </h1>
            <p className="text-gray-600 text-lg">
              Your Next.js app with ChatGPT integration
            </p>
          </div>
          
          <Link href="/chat">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg">
              🤖 Start Chatting with AI
            </button>
          </Link>

          <div className="mt-6 text-sm text-gray-500">
            Click above to begin your conversation
          </div>
        </div>
      </div>
    </div>
  );
}
