import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task } from '../types';
import { fetchTasks, createTask, getSubtasksByParentId as apiGetSubtasks } from '../api';

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, parentId?: number) => Promise<void>;
  getSubtasksByParentId?: (parentId: number) => Promise<Task[]>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]),
  [subtasks, setSubtasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  const addTask = async (title: string, parentId?: number) => {
    if (!title.trim()) return console.error('You are attempting to create a task without a title.'); // We don't allow tasks without a title as this will allow users to create empty tasks
    const newTask = await createTask(title, parentId);
    //fetchTasks().then(setTasks); <-- problematic line as it is an async function without await and I will lose the newly created task due to the parallel execution
    const tasks = await fetchTasks();
    setTasks(tasks);
  };

  const getSubtasksByParentId = async (parentId: number) => {
    const subs = await apiGetSubtasks(parentId);
    setSubtasks(subs);
    return subs;
  };

  return <TaskContext.Provider value={{ tasks, addTask, getSubtasksByParentId }}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};
