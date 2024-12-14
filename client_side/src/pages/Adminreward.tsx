import { FC, useState, useEffect } from 'react';
import axios from 'axios';

// Type definition for reward form data
interface RewardFormData {
  name: string;
  points: number;
  image: string;
  _id?: string; // Include ID for backend-related operations
}

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const Adminreward: FC = () => {
  const [rewardData, setRewardData] = useState<RewardFormData>({
    name: '',
    points: 0,
    image: ''
  });

  const [rewards, setRewards] = useState<RewardFormData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Fetch rewards from backend
  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/rewards`);
      setRewards(response.data);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to fetch rewards');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setRewardData(prev => ({
      ...prev,
      [name]: name === 'points' ? Number(value) : value
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validate input
    if (!rewardData.name.trim()) {
      setError('Reward name cannot be empty');
      return;
    }

    if (rewardData.points <= 0) {
      setError('Points must be greater than zero');
      return;
    }

    try {
      setError('');
      setMessage('Adding reward...');
      const response = await axios.post(`${API_BASE_URL}/rewards`, rewardData);
      setRewards(prevRewards => [...prevRewards, response.data]);
      setMessage('Reward added successfully!');
      setRewardData({ name: '', points: 0, image: '' }); // Reset form
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add reward');
    }
  };

  // Handle Delete Reward
  const handleDeleteReward = async (id: string): Promise<void> => {
    try {
      setMessage('Deleting reward...');
      await axios.delete(`${API_BASE_URL}/rewards/${id}`);
      setRewards(prevRewards => prevRewards.filter(reward => reward._id !== id));
      setMessage('Reward deleted successfully!');
    } catch (err: any) {
      setError('Failed to delete reward');
    }
  };

  // Calculate total points from rewards
  const totalPoints = rewards.reduce((sum, reward) => sum + reward.points, 0);

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Add Reward</h2>

      {/* Display Messages */}
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Reward Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block mb-2">Reward Name</label>
          <input 
            type="text"
            name="name"
            value={rewardData.name}
            onChange={handleInputChange}
            placeholder="Enter reward name"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Points</label>
          <input 
            type="number"
            name="points"
            value={rewardData.points}
            onChange={handleInputChange}
            placeholder="Enter points"
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Image URL</label>
          <input 
            type="text"
            name="image"
            value={rewardData.image}
            onChange={handleInputChange}
            placeholder="Enter image URL (optional)"
            className="w-full p-2 border rounded"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Reward
        </button>
      </form>

      {/* Rewards List */}
      {loading ? (
        <p>Loading rewards...</p>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">Current Rewards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward, index) => (
              <div 
                key={reward._id || index} 
                className="border rounded p-4 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold">{reward.name}</h4>
                  <p className="text-gray-600">{reward.points} Points</p>
                  {reward.image && (
                    <img 
                      src={reward.image} 
                      alt={reward.name} 
                      className="mt-2 max-h-32 object-cover rounded"
                    />
                  )}
                </div>
                <button
                  onClick={() => reward._id && handleDeleteReward(reward._id)}
                  className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Badges Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Available Badges</h2>
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-2 ${totalPoints >= 5000 ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="font-semibold">Gold Badge</h3>
                  <p className="text-sm text-gray-600">5000+ points</p>
                </div>
              </div>
              {totalPoints >= 5000 && <span className="text-yellow-500">Earned!</span>}
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${totalPoints >= 3000 && totalPoints < 5000 ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥈</span>
                <div>
                  <h3 className="font-semibold">Silver Badge</h3>
                  <p className="text-sm text-gray-600">3000+ points</p>
                </div>
              </div>
              {totalPoints >= 3000 && <span className="text-gray-500">Earned!</span>}
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${totalPoints >= 1000 && totalPoints < 3000 ? 'border-amber-600 bg-amber-50' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥉</span>
                <div>
                  <h3 className="font-semibold">Bronze Badge</h3>
                  <p className="text-sm text-gray-600">1000+ points</p>
                </div>
              </div>
              {totalPoints >= 1000 && <span className="text-amber-600">Earned!</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminreward;
