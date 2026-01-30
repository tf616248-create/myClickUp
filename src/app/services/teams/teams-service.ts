import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { teamData } from '../../models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private http = inject(HttpClient);
  teams = signal<teamData[]>([]);

  getTeams(): Observable<teamData[]> {
    return this.http.get<teamData[]>(`${environment.apiUrl}/teams`);
  }

  loadTeams(): void {
    this.http.get<teamData[]>(`${environment.apiUrl}/teams`).subscribe(data => {
      this.teams.set(data);
    });
  }

  createTeam(data: string): void {
    this.http.post(`${environment.apiUrl}/teams`, { name: data }).subscribe(() => {
      this.loadTeams();
    });
  }

  addMember(teamId: number, userId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/teams/${teamId}/members`, { userId });
  }
}