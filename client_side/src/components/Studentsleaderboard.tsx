import { useEffect, useState } from "react";
import axios from "axios";

export const Studentsleaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // Fetch leaderboard data for students
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/leaderboard/students`);
      setLeaderboardData(response.data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Student Leaderboard</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          {leaderboardData.map((player) => (
            <div
              key={player.id} // Ensure unique key from the API
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {player.avatar || player.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-sm text-gray-600">{player.points} points</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">#{player.rank}</span>
                {player.points >= 5000 && (
                  <span className="text-yellow-500">🏆 Gold</span>
                )}
                {player.points >= 3000 && player.points < 5000 && (
                  <span className="text-gray-400">🥈 Silver</span>
                )}
                {player.points >= 1000 && player.points < 3000 && (
                  <span className="text-amber-600">🥉 Bronze</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
