import { FC, useState } from "react";
import axios from "axios";

// Interface for Form Data
interface FormData {
  name: string;
  email: string;
  id: string;
}

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const Adminenroll: FC = () => {
  const [userType, setUserType] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    id: ''
  });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setError('');
      setMessage('Processing enrollment...');
      const response = await axios.post(`${API_BASE_URL}/users`, {
        ...formData,
        role: userType, // Add userType as role
      });
      setMessage(`Enrollment successful! User ID: ${response.data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to enroll user');
      setMessage('');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Enrollment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">User Type</label>
          <select 
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select User Type</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Name</label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Email</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">ID</label>
          <input 
            type="text"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            placeholder="Enter ID number"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          Enroll
        </button> 
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};
