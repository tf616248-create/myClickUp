import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Task } from '../../models/task';
import { environment } from '../../../environments/environment';
import { defaultIfEmpty, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private http = inject(HttpClient);
  tasks = signal<Task[]>([]);

  async getTasksByProjectId(projectId: number): Promise<Task[]> {
    const params = new HttpParams().set('projectId', projectId.toString());
    try {
      const tasks = await firstValueFrom(
        this.http.get<Task[]>(`${environment.apiUrl}/tasks`, { params })
      );

      this.tasks.set(tasks);

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks', error);
      return [];
    }
  }

  async addTask(data: Task): Promise<Task | null> {
    const taskData = {
      ...data,
      projectId: Number(data.projectId)
    };

    const task = await firstValueFrom(
      this.http.post<Task>(`${environment.apiUrl}/tasks`, taskData)
    );
    this.tasks.update(currentTasks => [...currentTasks, task]);
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | null> {
    try {
      const updatedTask = await firstValueFrom(
        this.http.patch<Task>(`${environment.apiUrl}/tasks/${id}`, updates)
      );

      this.tasks.update(allTasks =>
        allTasks.map(t => t.id === id ? updatedTask : t)
      );

      return updatedTask;
    } catch (error) {
      console.error('Update failed', error);
      return null;
    }
  }

  async deleteTask(id: number): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete(`${environment.apiUrl}/tasks/${id}`).pipe(defaultIfEmpty(null))
      );

      this.tasks.update(allTasks => allTasks.filter(t => t.id !== id));

      return true;
    } catch (error) {
      console.error('Delete failed', error);
      return false;
    }
  }
} 