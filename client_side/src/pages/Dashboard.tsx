import { useEffect, useState } from "react";
import { TaskProgress } from "../components/TaskProgress";
import axios from "axios";
import { getUserIdFromToken } from "../utils/authHelpers";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const Dashboard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const studentId = getUserIdFromToken(); // Dynamically fetch `userId` from the token

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!studentId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      // Fetch tasks for the student
      const tasksResponse = await axios.get(`${API_BASE_URL}/tasks/user/${studentId}`);
      setTasks(tasksResponse.data);

      // Fetch student details
      const studentResponse = await axios.get(`${API_BASE_URL}/users/${studentId}`);
      setStudentData(studentResponse.data);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="text-dark py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {studentData?.name || "Student"}! 👋
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-dark-100">
              Current Points: <span className="font-semibold">{totalPoints}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <TaskProgress tasks={tasks} />
      </div>
    </div>
  );
};
