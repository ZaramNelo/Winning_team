"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SymptomChecker from "@/app/_components/SymptomChecker";
import PharmacyFinder from "@/app/_components/PharmacyFinder";

export default function DashboardClient({ user, symptomsHistory = [] }) {
  console.log(symptomsHistory);
  const { update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome back, {user?.name || user?.fullName || "User"}!
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">
                    Your health journey starts here
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">
                      {symptomsHistory?.length || 0}
                    </div>
                    <div className="text-blue-100">Total Checks</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">
                      {
                        symptomsHistory?.filter(
                          (entry) => entry.diagnosis?.urgency === "low"
                        )?.length || 0
                      }
                    </div>
                    <div className="text-green-100">Low Risk</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold mb-2">
                      {
                        symptomsHistory?.filter(
                          (entry) => entry.diagnosis?.urgency === "high"
                        )?.length || 0
                      }
                    </div>
                    <div className="text-purple-100">High Priority</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Symptom History */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Health Actions
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Check symptoms or find nearby pharmacies
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleOpenSymptomChecker}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Check Symptoms
                  </button>
                  <button
                    onClick={handleOpenPharmacyFinder}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Find Pharmacy
                  </button>
                </div>
              </div>

              {/* Symptom History Section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Symptom History</h3>

              {!symptomsHistory || symptomsHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-6">
                    <svg
                      className="mx-auto h-20 w-20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No symptom history yet
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Start by checking your symptoms to build your comprehensive
                    health history
                  </p>
                  <button
                    onClick={handleOpenSymptomChecker}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Start Your First Check
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {(symptomsHistory || []).slice(0, 5).map((entry, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {entry.diagnosis?.primaryDiagnosis ||
                              "Symptom Check"}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {entry.symptoms}
                          </p>
                        </div>
                        <div className="ml-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(
                              entry.diagnosis?.urgency
                            )}`}
                          >
                            {entry.diagnosis?.urgency || "Unknown"} Urgency
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          Confidence: {entry.diagnosis?.confidence || 0}%
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(entry.created_at)}
                        </div>
                      </div>

                      {entry.diagnosis?.notes && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                          <div className="flex items-start">
                            <svg
                              className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-blue-800 mb-1">
                                Notes
                              </p>
                              <p className="text-sm text-blue-700">
                                {entry.diagnosis.notes}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {symptomsHistory && symptomsHistory.length > 5 && (
                    <div className="text-center pt-6">
                      <button
                        onClick={() => router.push("/history")}
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                      >
                        View all {symptomsHistory.length} entries →
                      </button>
                    </div>
                  )}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Symptom Checker Modal */}
      <SymptomChecker
        isOpen={isSymptomCheckerOpen}
        onClose={handleCloseSymptomChecker}
        userId={user.userId}
      />

      {/* Pharmacy Finder Modal */}
      <PharmacyFinder
        isOpen={isPharmacyFinderOpen}
        onClose={handleClosePharmacyFinder}
        initialLocation={null}
      />
    </>
  );
}
