"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SymptomChecker from "@/app/_components/SymptomChecker";

export default function DashboardClient({ user, symptomsHistory }) {
  console.log(symptomsHistory);
  const { update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSymptomChecker = () => {
    setIsSymptomCheckerOpen(true);
  };

  const handleCloseSymptomChecker = () => {
    setIsSymptomCheckerOpen(false);
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
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.name || user?.fullName || "User"}!
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your health and view your symptom history
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleOpenSymptomChecker}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Check Symptoms
                </button>
                <button
                  onClick={() => router.push("/history")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  View Full History
                </button>
                <button
                  onClick={() => router.push("/settings")}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Symptom History */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Recent Symptom History
                </h2>
                <button
                  onClick={handleOpenSymptomChecker}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add New Check
                </button>
              </div>

              {symptomsHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-2">No symptom history yet</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Start by checking your symptoms to build your health history
                  </p>
                  <button
                    onClick={handleOpenSymptomChecker}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Check Symptoms
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {symptomsHistory.slice(0, 5).map((entry, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {entry.diagnosis?.primaryDiagnosis ||
                              "Symptom Check"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {entry.symptoms}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(
                              entry.diagnosis?.urgency
                            )}`}
                          >
                            {entry.diagnosis?.urgency || "Unknown"} Urgency
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>
                          Confidence: {entry.diagnosis?.confidence || 0}%
                        </span>
                        <span>{formatDate(entry.created_at)}</span>
                      </div>

                      {entry.diagnosis?.notes && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                          <strong>Notes:</strong> {entry.diagnosis.notes}
                        </div>
                      )}
                    </div>
                  ))}

                  {symptomsHistory.length > 5 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => router.push("/history")}
                        className="text-blue-600 hover:text-blue-700 font-medium"
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

      {/* Symptom Checker Modal */}
      <SymptomChecker
        isOpen={isSymptomCheckerOpen}
        onClose={handleCloseSymptomChecker}
      />
    </>
  );
}
