import { useState, useEffect } from "react";
import axios from "axios";
import { TaskProgress } from "../components/TaskProgress";
import { getUserIdFromToken } from "../utils/authHelpers";
import { Task } from "../types";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = getUserIdFromToken();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/tasks/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Convert id to string for consistency
      setTasks(response.data.map((task: any) => ({ ...task, id: String(task.id) })));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks. Please try again.");
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await axios.put(
        `${API_BASE_URL}/tasks/${taskId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          String(task.id) === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Failed to update task status. Please try again.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading tasks...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
      <TaskProgress tasks={tasks} />
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => toggleTaskStatus(String(task.id), task.status)}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <span className="font-medium">{task.title}</span>
                  <p className="text-sm text-gray-600">Points: {task.points}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">Due: {task.deadline}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
