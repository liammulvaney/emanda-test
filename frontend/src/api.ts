import axios from 'axios';
import { Task } from './types';

const API_BASE = '/api/tasks';

export const fetchTasks = async (): Promise<Task[]> => {
    const res = await axios.get(API_BASE);
    return Array.isArray(res.data) ? res.data : [];
  };
  

export const createTask = async (title: string, parentId?: number): Promise<Task> => {
  const res = await axios.post(API_BASE, { title, parentId });
  return res.data;
};

/**
 * 
 * @param parentId - The ID of the parent task for which subtasks are to be fetched.
 * @description This function fetches subtasks for a given parent task ID from the API.
 * It constructs the API endpoint using the parentId and makes a GET request to retrieve the subtasks.
 * If the request is successful, it returns the list of subtasks; otherwise, it handles errors gracefully.
 * 
 * @example
 * const subtasks = await getSubtasksByParentId(1);
 * console.log(subtasks); // Logs the subtasks for the task with ID 1.
 * 
 * @throws Will log an error message to the console if the API request fails.
 * @returns the list of subtasks for the specified parent task ID.
 */
export const getSubtasksByParentId = async (parentId: number): Promise<Task[]> => {
  try {
    const uri = `${API_BASE}/${parentId}/subtasks`,
    res = await axios.get(uri);
    return res.data ?? [];
  } catch (error) {
    // gracefully handle any errors that may occur during the fetch from the API
    console.error("Error fetching subtasks:", error);
    return [];
  }  
}
