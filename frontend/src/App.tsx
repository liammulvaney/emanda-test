import React, { useState } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { TaskList } from './components/TaskList';

const Main = () => {
  const [title, setTitle] = useState('');
  const { addTask } = useTasks(),
  [errMessage, showErrMessage] = useState('');

  /**
   * @description This function handles the addition of a new task. It checks if the title is not empty and then calls the addTask function from the context.
   * If the title is empty, it sets an error message to be displayed.
   * Before you could add a task without a title, but now we don't allow that as it would create an empty task.
   * @param title - The title of the task to be added.
   * @returns If an error is found then it will return an error message, otherwise it will add the task to the list.
   */
  const handleAddTask = async (title: string) => {
    if (!title.trim()) {
      showErrMessage('You are attempting to create a task without a title.');
      return;
    }
    showErrMessage('');
    await addTask(title);
    setTitle('');
  }

  return (
    <div>
      <h1>Task Manager</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New Task" />
      <span style={{ color: 'red' }}>*</span> {/* Improvement 1: This asterisk indicates that the task title is required */}
      <button onClick={() => { handleAddTask(title); }}>Add Task</button>
      <p style={{color:'red'}}>{errMessage}</p>
      <TaskList />
    </div>
  );
};

const App = () => (
  <TaskProvider>
    <Main />
  </TaskProvider>
);

export default App;
