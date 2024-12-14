import { useEffect, useState } from "react";
import axios from "axios";
import { TaskProgress } from "../components/TaskProgress";
import { Task } from "../types";



interface LeaderboardPlayer {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const Pidashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tasksResponse, leaderboardResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/tasks/pi`),
        axios.get(`${API_BASE_URL}/leaderboard/pi`),
      ]);

      setTasks(tasksResponse.data);

      const points = tasksResponse.data
        .filter((task: Task) => task.status === "completed")
        .reduce((sum: number, task: Task) => sum + task.points, 0);
      setTotalPoints(points);

      setLeaderboardData(leaderboardResponse.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getBadgeInfo = () => {
    if (totalPoints >= 5000) return { type: "Gold", color: "yellow-500", emoji: "🏆" };
    if (totalPoints >= 3000) return { type: "Silver", color: "gray-400", emoji: "🥈" };
    if (totalPoints >= 1000) return { type: "Bronze", color: "amber-600", emoji: "🥉" };
    return null;
  };

  const badgeInfo = getBadgeInfo();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="text-dark py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome back, PI Team! 👋</h1>
          <div className="flex items-center gap-4">
            <p className="text-dark-100">
              Current Points: <span className="font-semibold">{totalPoints}</span>
            </p>
            {badgeInfo && (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${badgeInfo.color}/10`}
              >
                <span className="text-lg">{badgeInfo.emoji}</span>
                <span className={`font-medium text-${badgeInfo.color}`}>
                  {badgeInfo.type} Badge
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TaskProgress tasks={tasks} />

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Top 5 Leaders</h2>
            <div className="space-y-4">
              {leaderboardData.slice(0, 5).map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {player.avatar || player.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-gray-600">{player.points} points</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                      #{player.rank}
                    </div>
                    {player.points >= 5000 && <span className="text-yellow-500">🏆</span>}
                    {player.points >= 3000 && player.points < 5000 && (
                      <span className="text-gray-400">🥈</span>
                    )}
                    {player.points >= 1000 && player.points < 3000 && (
                      <span className="text-amber-600">🥉</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
