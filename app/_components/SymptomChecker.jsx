"use client";
import { useState } from "react";
import { generateDiagnosis } from "../_lib/api-actions";
import { useSession } from "next-auth/react";

// import {
//   analyzeSymptomsWithAI,
//   formatDiagnosisForDisplay,
//   getSeverityColor,
//   getConfidenceDescription,
// } from "../_lib/actions";

export default function SymptomChecker({ isOpen, onClose }) {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [duration, setDuration] = useState("Less than 24 hours");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);

  const { data: session, status } = useSession();
  console.log(session);

  const resetState = () => {
    setSymptoms("");
    setAge("");
    setDuration("Less than 24 hours");
    setIsAnalyzing(false);
    setDiagnosis(null);
    setError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Call the server action with patient data
      const result = await generateDiagnosis(
        symptoms,
        parseInt(age) || null,
        duration,
        session?.user?.userId
      );

      if (result.success) {
        setDiagnosis(result.data);
      } else {
        throw new Error(result.error || "Failed to analyze symptoms");
      }
    } catch (error) {
      console.error("AI analysis error:", error);
      setError(
        error.message || "An error occurred during analysis. Please try again."
      );
      // Fallback diagnosis
      setDiagnosis({
        possibleConditions: [
          { name: "General Assessment", confidence: 70, severity: "Mild" },
        ],
        recommendations: [
          "Monitor your symptoms closely",
          "Rest and stay hydrated",
          "Consider over-the-counter medications if appropriate",
          "Seek medical attention if symptoms worsen",
        ],
        nextSteps:
          "Please consult with a healthcare provider for proper diagnosis and treatment",
        aiInsights: {
          confidence: 70,
          analysisTime: "2.3 seconds",
          symptomsAnalyzed: symptoms.split(" ").length,
          ageConsideration: age
            ? `Patient age: ${age} years`
            : "Age not specified",
          durationImpact: duration
            ? `Duration: ${duration}`
            : "Duration not specified",
        },
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
              onClick={handleClose}
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

          {error && (
            <div
              className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

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
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
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
                  onClick={handleClose}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors hover:cursor-pointer"
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
                    Primary Diagnosis:
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-900">
                        {diagnosis.primaryDiagnosis}
                      </span>
                      <span className="text-sm text-blue-700">
                        Confidence: {diagnosis.confidence}%
                      </span>
                    </div>
                    <div className="text-sm text-blue-700">
                      Urgency:
                      <span
                        className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                          diagnosis.urgency === "low"
                            ? "bg-green-100 text-green-800"
                            : diagnosis.urgency === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {diagnosis.urgency}
                      </span>
                    </div>
                  </div>
                </div>

                {diagnosis.differentialDiagnoses &&
                  diagnosis.differentialDiagnoses.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-700 mb-3">
                        Other Possible Conditions:
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {diagnosis.differentialDiagnoses.map(
                          (diagnosis, index) => (
                            <li key={index}>{diagnosis}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {diagnosis.recommendedTests &&
                  diagnosis.recommendedTests.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-700 mb-3">
                        Recommended Tests:
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {diagnosis.recommendedTests.map((test, index) => (
                          <li key={index}>{test}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {diagnosis.treatmentOptions &&
                  diagnosis.treatmentOptions.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-700 mb-3">
                        Treatment Options:
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {diagnosis.treatmentOptions.map((treatment, index) => (
                          <li key={index}>{treatment}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {diagnosis.notes && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      Additional Notes:
                    </h4>
                    <p className="text-gray-700">{diagnosis.notes}</p>
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
                  onClick={resetState}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors hover:cursor-pointer"
                >
                  Check Different Symptoms
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
