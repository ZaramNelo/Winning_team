"use client";
import { useState } from "react";
import Navigation from "./_components/Navigation";
import HeroSection from "./_components/HeroSection";
import FeaturesSection from "./_components/FeaturesSection";
import ServicesSection from "./_components/ServicesSection";
import CTASection from "./_components/CTASection";
import Footer from "./_components/Footer";
import SymptomChecker from "./_components/SymptomChecker";

export default function Home() {
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);

  const handleOpenSymptomChecker = () => {
    setIsSymptomCheckerOpen(true);
  };

  const handleCloseSymptomChecker = () => {
    setIsSymptomCheckerOpen(false);
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection onOpenSymptomChecker={handleOpenSymptomChecker} />
      <FeaturesSection />
      <ServicesSection />
      <CTASection onOpenSymptomChecker={handleOpenSymptomChecker} />
      <Footer />
      <SymptomChecker
        isOpen={isSymptomCheckerOpen}
        onClose={handleCloseSymptomChecker}
      />
    </div>
  );
}
