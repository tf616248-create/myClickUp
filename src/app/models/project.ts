export interface projectData {
  id: number;
  team_id: number;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  created_at: string;
}

export interface createProjectData {
  team_id: number;
  name: string;
  description: string;
}
