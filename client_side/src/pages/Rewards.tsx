import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

interface Reward {
  id: string;
  name: string;
  pointsRequired: number;
  description: string;
  claimed: boolean;
}

export const Rewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0); // For displaying user points if needed

  const fetchRewards = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/rewards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRewards(
        response.data.map((reward: any) => ({
          ...reward,
          id: String(reward.id), // Ensure id is a string
        }))
      );

      const userResponse = await axios.get(`${API_BASE_URL}/user/points`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserPoints(userResponse.data.points);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching rewards:", err);
      setError("Failed to fetch rewards. Please try again.");
      setLoading(false);
    }
  };

  const claimReward = async (rewardId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/rewards/${rewardId}/claim`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the rewards state to mark the reward as claimed
      setRewards((prevRewards) =>
        prevRewards.map((reward) =>
          reward.id === rewardId ? { ...reward, claimed: true } : reward
        )
      );

      alert("Reward claimed successfully!");
    } catch (err) {
      console.error("Error claiming reward:", err);
      alert("Failed to claim reward. Please try again.");
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading rewards...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Rewards</h1>
      <p className="text-gray-700 mb-4">Your Points: {userPoints}</p>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium">{reward.name}</p>
                <p className="text-sm text-gray-600">{reward.description}</p>
                <p className="text-sm text-gray-600">
                  Points Required: {reward.pointsRequired}
                </p>
              </div>
              <button
                onClick={() => claimReward(reward.id)}
                disabled={reward.claimed || userPoints < reward.pointsRequired}
                className={`px-3 py-1 rounded-lg ${
                  reward.claimed
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : userPoints >= reward.pointsRequired
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-gray-200 text-gray-700 cursor-not-allowed"
                }`}
              >
                {reward.claimed ? "Claimed" : "Claim"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
