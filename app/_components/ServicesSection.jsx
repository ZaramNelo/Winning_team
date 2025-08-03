import { useTranslations } from "../hooks/useTranslations";

export default function ServicesSection() {
  const t = useTranslations();
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('home.services.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('home.services.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('home.services.cards.symptomChecker.title')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('home.services.cards.symptomChecker.description')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('home.services.cards.conditionLibrary.title')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('home.services.cards.conditionLibrary.description')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('home.services.cards.treatmentOptions.title')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('home.services.cards.treatmentOptions.description')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('home.services.cards.doctorConsultation.title')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('home.services.cards.doctorConsultation.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
