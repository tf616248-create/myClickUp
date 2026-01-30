export interface Task {
  id?: number;
  projectId: number;
  title: string;
  description: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'normal' | 'high';
  assigneeId?: number;
  dueDate?: string;
  orderIndex?: number;
}