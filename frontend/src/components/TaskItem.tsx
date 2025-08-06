import React, { useState } from 'react';
import { Task } from '../types';
import { useTasks } from '../context/TaskContext';

export const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const [showSubtasks, setShowSubtasks] = useState(false),
  { tasks, addTask, getSubtasksByParentId } = useTasks(),
  [localSubtasks, setLocalSubtasks] = useState<Task[]>([]);

  const  createSubTask = async() => {
    const subTaskTitle = prompt('Enter subtask title:');
    if (subTaskTitle) {
      await addTask(subTaskTitle, task.id);
      const subs = await getSubtasksByParentId!(task.id);
      task.subtaskCount = subs.length; // Update the subtask count for the parent task
      setLocalSubtasks(subs);
      setShowSubtasks(true);
    }
  }

  const toggleSubtasks = async () => {
    if (!showSubtasks) {
      const subs = await getSubtasksByParentId!(task.id);
      setLocalSubtasks(subs);
    }
    setShowSubtasks(!showSubtasks);
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '0.75rem',
        margin: '0.5rem 0',
        backgroundColor: task.parentId ? '#f9f9f9' : '#fff',
        marginLeft: task.parentId ? '2rem' : '0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between' }}> {/* Improvement 2: This task item has a title and a button to add subtasks. I also updated the flexbox configuration so that the task features are evenly spaced */ }
          <strong>{task.title}</strong>          
          { task.subtaskCount > 0  && <button onClick={toggleSubtasks}>
            {showSubtasks ? 'Hide Subtasks' : 'Show Subtasks'}
          </button> }
          <button onClick={createSubTask}>+ Add Sub Task</button>
        </div> 
      </div>

      {showSubtasks && (
        <div>
          {localSubtasks.map((s) => (
            <TaskItem key={s.id} task={s} />
          ))}
        </div>
      )}
    </div>
  )
};