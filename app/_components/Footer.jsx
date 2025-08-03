"use client";

import { useTranslations } from "../hooks/useTranslations";

export default function Footer() {
  const t = useTranslations();
  
  return (
    <footer id="footer" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.company.name')}</h3>
            <p className="text-gray-400">
              {t('footer.company.description')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.services.title')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.services.symptomChecker')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.services.diagnosis')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.services.conditionLibrary')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.services.treatmentOptions')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.support.title')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.support.helpCenter')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.support.contactUs')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.support.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.support.termsOfService')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('footer.connect.title')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.connect.aboutUs')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.connect.careers')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.connect.blog')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.connect.newsletter')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
