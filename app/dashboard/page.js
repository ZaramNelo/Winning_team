import { auth } from "@/app/_lib/auth";
import { getSymptomsHistory } from "@/app/_lib/database-actions";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            Please sign in to access your dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Fetch user's symptom history
  let symptomsHistory = [];
  try {
    const historyResult = await getSymptomsHistory(session.user.userId);
    if (historyResult.success) {
      symptomsHistory = historyResult.data;
    }
  } catch (error) {
    console.error("Error fetching symptoms history:", error);
  }

  return (
    <DashboardClient user={session.user} symptomsHistory={symptomsHistory} />
  );
}
