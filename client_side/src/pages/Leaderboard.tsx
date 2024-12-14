import { useState, useEffect } from 'react';
import axios from 'axios';

// Shared Leaderboard Item Component
const LeaderboardItem = ({ player }: { player: any }) => (
  <div
    key={player.rank}
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
      {player.points >= 5000 && <span className="text-yellow-500">🏆 Gold</span>}
      {player.points >= 3000 && player.points < 5000 && (
        <span className="text-gray-400">🥈 Silver</span>
      )}
      {player.points >= 1000 && player.points < 3000 && (
        <span className="text-amber-600">🥉 Bronze</span>
      )}
    </div>
  </div>
);

export const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('faculty'); // Manage active tab
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]); // Store leaderboard data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // Fetch leaderboard data based on role
  const fetchLeaderboard = async (role: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/leaderboard/${role}`);
      setLeaderboardData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch leaderboard data');
      setLoading(false);
    }
  };

  // Fetch leaderboard data whenever the active tab changes
  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      {/* Tab Navigation */}
      <div className="flex mb-6 space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === 'faculty' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('faculty')}
        >
          Faculty
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === 'students' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === 'pi' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('pi')}
        >
          PI Team
        </button>
      </div>

      {/* Leaderboard Content */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {leaderboardData.map((player: any) => (
              <LeaderboardItem key={player.rank} player={player} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
