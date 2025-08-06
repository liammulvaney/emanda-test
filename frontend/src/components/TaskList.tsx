import React from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from './TaskItem';

export const TaskList: React.FC = () => {
  const { tasks } = useTasks();
  const topLevelTasks = tasks.filter((task) => !task.parentId);

  return (
    <div>
      {topLevelTasks.length === 0 ? (
        <p>No top-level tasks found.</p>
      ) : (
        topLevelTasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </div>
  );
};