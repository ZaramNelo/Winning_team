"use client";

import { useTranslations } from "../hooks/useTranslations";

export default function CTASection({ onOpenSymptomChecker, onOpenPharmacyFinder }) {
  const t = useTranslations();
  
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('home.cta.title')}</h2>
        <p className="text-xl mb-8 text-blue-100">
          {t('home.cta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onOpenSymptomChecker}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors hover:cursor-pointer"
          >
            🩺 {t('home.cta.checkSymptomsNow')}
          </button>
          <button
            onClick={onOpenPharmacyFinder}
            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors hover:cursor-pointer"
          >
            🏥 {t('home.cta.findPharmacy')}
          </button>
        </div>
      </div>
    </section>
  );
}
