// Define task status and priority types
export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Blocked';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
    assignee: User[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
    progress: number;
    storyPoints: number;
    documentationLink: string;
}


export interface User {
  id: string | number;
  name: string;
  imgURL?: string;
}