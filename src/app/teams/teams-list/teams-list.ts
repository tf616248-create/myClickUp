import { Component, inject, OnInit, signal } from '@angular/core';
import { teamData } from '../../models/team';
import { TeamsService } from '../../services/teams/teams-service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    FormsModule
  ],
  templateUrl: './teams-list.html',
  styleUrls: ['./teams-list.scss'],
})
export class TeamsList implements OnInit {
  private teamsService = inject(TeamsService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);
  teamsList = this.teamsService.teams;
  teams: teamData[] = [];
  errorMessage = '';

  showAddMemberInput = signal<Record<number, boolean>>({});
  userIdInputs = signal<Record<number, string>>({});
  submitting = signal<Record<number, boolean>>({});
  addMemberErrors = signal<Record<number, string>>({});

  ngOnInit(): void {
    this.teamsService.loadTeams();
  }

  goToCreateTeam(): void {
    if (this.router.url.includes('/teams/create-team')) {
      this.router.navigate(['/teams']);
    } else {
      this.router.navigate(['create-team'], { relativeTo: this.route });
    }
  }

  loadTeams(): void {
    this.teamsService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
      },
      error: (err) => {
        this.errorMessage = 'שגיאה בטעינת הצוותים';
        console.error(err);
      }
    });
  }

  viewTeamDetails(teamId: number): void {
    this.router.navigate(['/projects'], { queryParams: { teamId } });
  }

  toggleAddMemberInput(teamId: number): void {
    const current = this.showAddMemberInput();
    this.showAddMemberInput.set({ ...current, [teamId]: !current[teamId] });

    if (!current[teamId]) {
      const errors = this.addMemberErrors();
      this.addMemberErrors.set({ ...errors, [teamId]: '' });
    }
  }

  addMember(teamId: number): void {
    const userIdStr = this.userIdInputs()[teamId];

    if (!userIdStr || isNaN(Number(userIdStr)) || Number(userIdStr) <= 0) {
      const errors = this.addMemberErrors();
      this.addMemberErrors.set({ ...errors, [teamId]: 'אנא הכנס מזהה משתמש תקין' });
      return;
    }

    const userId = Number(userIdStr);

    const submitting = this.submitting();
    this.submitting.set({ ...submitting, [teamId]: true });

    const errors = this.addMemberErrors();
    this.addMemberErrors.set({ ...errors, [teamId]: '' });

    this.teamsService.addMember(teamId, userId).subscribe({
      next: () => {
        const inputs = this.userIdInputs();
        const show = this.showAddMemberInput();
        this.userIdInputs.set({ ...inputs, [teamId]: '' });
        this.showAddMemberInput.set({ ...show, [teamId]: false });

        this.teamsService.loadTeams();

        const submitState = this.submitting();
        this.submitting.set({ ...submitState, [teamId]: false });
      },
      error: (err) => {
        const errors = this.addMemberErrors();
        this.addMemberErrors.set({
          ...errors,
          [teamId]: 'שגיאה בהוספת חבר לצוות. אנא נסה שוב.'
        });

        const submitState = this.submitting();
        this.submitting.set({ ...submitState, [teamId]: false });

        console.error('Error adding member:', err);
      }
    });
  }

  updateUserIdInput(teamId: number, value: string): void {
    const inputs = this.userIdInputs();
    this.userIdInputs.set({ ...inputs, [teamId]: value });

    if (value) {
      const errors = this.addMemberErrors();
      this.addMemberErrors.set({ ...errors, [teamId]: '' });
    }
  }
}