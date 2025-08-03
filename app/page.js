"use client";
import { useState } from "react";
import { useTranslations } from "./hooks/useTranslations";
import HeroSection from "./_components/HeroSection";
import FeaturesSection from "./_components/FeaturesSection";
import ServicesSection from "./_components/ServicesSection";
import CTASection from "./_components/CTASection";
import SymptomChecker from "./_components/SymptomChecker";
import PharmacyFinder from "./_components/PharmacyFinder";

export default function Home() {
  const t = useTranslations();
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);
  const [isPharmacyFinderOpen, setIsPharmacyFinderOpen] = useState(false);

  const handleOpenSymptomChecker = () => {
    setIsSymptomCheckerOpen(true);
  };

  const handleCloseSymptomChecker = () => {
    setIsSymptomCheckerOpen(false);
  };

  const handleOpenPharmacyFinder = () => {
    setIsPharmacyFinderOpen(true);
  };

  const handleClosePharmacyFinder = () => {
    setIsPharmacyFinderOpen(false);
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <HeroSection 
        onOpenSymptomChecker={handleOpenSymptomChecker}
        onOpenPharmacyFinder={handleOpenPharmacyFinder}
      />
      <FeaturesSection />
      <ServicesSection />
      <CTASection 
        onOpenSymptomChecker={handleOpenSymptomChecker}
        onOpenPharmacyFinder={handleOpenPharmacyFinder}
      />
      <SymptomChecker
        isOpen={isSymptomCheckerOpen}
        onClose={handleCloseSymptomChecker}
      />
      <PharmacyFinder
        isOpen={isPharmacyFinderOpen}
        onClose={handleClosePharmacyFinder}
      />
    </div>
  );
}
