export interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  author_name: string;
  body: string;
  created_at: string;
  updated_at?: string;
}
