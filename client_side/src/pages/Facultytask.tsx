import { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "../types"; // Import the shared Task type

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const Facultytask = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null); // id as string
  const [zoomLink, setZoomLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks for faculty user
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/tasks/faculty`);
      // Convert id to string for consistency
      setTasks(response.data.map((task: any) => ({ ...task, id: String(task.id) })));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Open the modal for a specific task
  const handleCheckInClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
    setZoomLink("");
    setSelectedFile(null);
  };

  // Handle sending Zoom link
  const handleSendZoomLink = async () => {
    if (!zoomLink.trim()) {
      alert("Please enter a Zoom link before sending.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/tasks/${selectedTaskId}/zoom-link`, {
        zoomLink,
      });
      alert("Zoom link sent successfully.");
    } catch (err) {
      console.error("Error sending Zoom link:", err);
      alert("Failed to send Zoom link. Please try again.");
    }
  };

  // Handle file upload for research tasks
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(`${API_BASE_URL}/tasks/${selectedTaskId}/upload`, formData);
      alert("File uploaded successfully.");
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to upload file. Please try again.");
    }
  };

  // Handle modal confirmation (mark task as completed)
  const handleConfirm = async () => {
    if (selectedTaskId) {
      try {
        await axios.put(`${API_BASE_URL}/tasks/${selectedTaskId}/complete`);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === selectedTaskId ? { ...task, status: "completed" } : task
          )
        );
      } catch (err) {
        console.error("Error updating task status:", err);
        alert("Failed to update task. Please try again.");
      }
    }
    setIsModalOpen(false);
    setSelectedTaskId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Faculty Tasks</h1>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
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
                    readOnly
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="font-medium">{task.title}</span>
                    <p className="text-sm text-gray-600">Points: {task.points}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Due: {task.deadline}</span>
                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleCheckInClick(task.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      Check-In
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl font-semibold mb-4">Task Check-In</h2>
            <div className="mb-4">
              <label htmlFor="zoom-link" className="block text-sm font-medium mb-2">
                Zoom Link
              </label>
              <input
                type="text"
                id="zoom-link"
                value={zoomLink}
                onChange={(e) => setZoomLink(e.target.value)}
                placeholder="Enter Zoom link"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <button
                onClick={handleSendZoomLink}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Send
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                Upload Research File
              </label>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-600">
                  <span>Selected file: {selectedFile.name}</span>
                </div>
              )}
              <button
                onClick={handleFileUpload}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Upload
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-200 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
