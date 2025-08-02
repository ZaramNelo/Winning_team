export default function ServicesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Diagnostic Services
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive symptom analysis and health insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Symptom Checker</h3>
            <p className="text-gray-600 text-sm">
              Enter symptoms and get instant preliminary diagnosis
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Condition Library</h3>
            <p className="text-gray-600 text-sm">
              Browse detailed information about various medical conditions
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Treatment Options</h3>
            <p className="text-gray-600 text-sm">
              Get recommended treatments and lifestyle changes
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Doctor Consultation</h3>
            <p className="text-gray-600 text-sm">
              Connect with healthcare professionals for expert advice
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
