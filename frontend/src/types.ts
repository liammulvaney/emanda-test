export interface Task {
    id: number;
    title: string;
    parentId?: number;
    subtasks?: Task[];

    subtaskCount? : number; // Optional property to track the number of subtasks
  }