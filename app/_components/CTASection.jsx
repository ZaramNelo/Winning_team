"use client";

export default function CTASection({ onOpenSymptomChecker }) {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Your Symptom Check</h2>
        <p className="text-xl mb-8 text-blue-100">
          Get instant preliminary diagnosis and health insights in minutes
        </p>
        <button
          onClick={onOpenSymptomChecker}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors hover:cursor-pointer"
        >
          Try Now for Free!
        </button>
      </div>
    </section>
  );
}
