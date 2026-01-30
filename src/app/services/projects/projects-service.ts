import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { projectData } from '../../models/project';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient);
  private allProjects = signal<projectData[]>([]);
  private currentTeamId = signal<number | undefined>(undefined);

  projects = computed(() => {
    const teamId = this.currentTeamId();
    if (!teamId) return this.allProjects();
    return this.allProjects().filter(project => project.team_id === teamId);
  });

  loadProjects(teamId?: number): void {
    let url = `${environment.apiUrl}/projects`;
    const params: any = {};

    if (teamId) {
      params.teamId = teamId.toString();
    }

    this.currentTeamId.set(teamId);

    this.http.get<projectData[]>(url, { params }).subscribe({
      next: (data) => {
        this.allProjects.set(data);
      },
      error: (err) => {
        console.error('Error loading projects', err);
      }
    });
  }

  addProject(data: Partial<projectData>): Observable<projectData> {
    const observable = new Observable<projectData>(subscriber => {
      this.http.post<projectData>(`${environment.apiUrl}/projects`, data).subscribe({
        next: (newProject) => {
          this.allProjects.update(projects => [...projects, newProject]);
          subscriber.next(newProject);
          subscriber.complete();
        },
        error: (err) => {
          subscriber.error(err);
        }
      });
    });
    return observable;
  }
}