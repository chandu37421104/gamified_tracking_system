import { FC } from "react";
import { Task } from "../types"; // Import the shared Task type

interface TaskProgressProps {
  tasks: Task[];
}

export const TaskProgress: FC<TaskProgressProps> = ({ tasks }) => {
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Task Progress</h2>
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedTasks} of {tasks.length} tasks completed
        </p>
      </div>
    </div>
  );
};
