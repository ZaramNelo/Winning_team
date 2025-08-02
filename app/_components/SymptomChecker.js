"use client";
import { useState } from "react";
import { analyzeSymptomsWithAI } from "../utils/aiDiagnosis";

export default function SymptomChecker({ isOpen, onClose }) {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [duration, setDuration] = useState("Less than 24 hours");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);

    try {
      // Call the mock AI function with patient data
      const result = await analyzeSymptomsWithAI(
        symptoms,
        parseInt(age) || null,
        duration
      );

      setDiagnosis(result.data);
    } catch (error) {
      console.error("AI analysis error:", error);
      // Fallback diagnosis
      setDiagnosis({
        possibleConditions: [
          { name: "Common Cold", confidence: 85, severity: "Mild" },
          { name: "Seasonal Allergies", confidence: 70, severity: "Mild" },
          { name: "Sinus Infection", confidence: 45, severity: "Moderate" },
        ],
        recommendations: [
          "Rest and stay hydrated",
          "Consider over-the-counter decongestants",
          "Monitor symptoms for 3-5 days",
          "Seek medical attention if symptoms worsen",
        ],
        nextSteps:
          "Schedule a follow-up with your doctor if symptoms persist beyond 10 days",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center bg-black/50 justify-center z-50 p-4">
      {/* Modal content */}
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative z-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Symptom Checker
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {!diagnosis ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-2">
                  Describe your symptoms in detail
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Example: I have a headache, fever of 101°F, and fatigue for the past 2 days..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
                  rows="6"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information (Optional)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    >
                      <option>Less than 24 hours</option>
                      <option>1-3 days</option>
                      <option>3-7 days</option>
                      <option>More than 1 week</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isAnalyzing || !symptoms.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analyzing with AI...
                    </div>
                  ) : (
                    "Analyze Symptoms"
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  AI-Powered Analysis
                </h3>

                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-3">
                    Possible Conditions:
                  </h4>
                  <div className="space-y-3">
                    {diagnosis.possibleConditions.map((condition, index) => (
                      <div key={index} className="text-black p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{condition.name}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              condition.severity === "Mild"
                                ? "bg-green-100 text-green-800"
                                : condition.severity === "Moderate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {condition.severity}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Confidence: {condition.confidence}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-3">
                    AI Recommendations:
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {diagnosis.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-2">
                    Next Steps:
                  </h4>
                  <p className="text-gray-700">{diagnosis.nextSteps}</p>
                </div>

                {diagnosis.aiInsights && (
                  <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      AI Analysis Details:
                    </h4>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>Analysis Time: {diagnosis.aiInsights.analysisTime}</p>
                      <p>
                        Symptoms Analyzed:{" "}
                        {diagnosis.aiInsights.symptomsAnalyzed}
                      </p>
                      <p>
                        Age Consideration:{" "}
                        {diagnosis.aiInsights.ageConsideration}
                      </p>
                      <p>
                        Duration Impact: {diagnosis.aiInsights.durationImpact}
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Disclaimer:</strong> This is a preliminary analysis
                    and should not replace professional medical advice. Please
                    consult with a healthcare provider for proper diagnosis and
                    treatment.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDiagnosis(null);
                    setSymptoms("");
                    setAge("");
                    setDuration("Less than 24 hours");
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Check Different Symptoms
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
