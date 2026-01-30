import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamsService } from '../../services/teams/teams-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-create-team',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './create-team.html',
  styleUrls: ['./create-team.scss'],
})
export class CreateTeam {
  newTeamName: string = '';

  private teamService = inject(TeamsService);
  private teams = this.teamService.teams;

  onCreateTeam() {
    if (this.newTeamName.trim()) {
      this.teamService.createTeam(this.newTeamName);
      this.newTeamName = '';
    }
  }
}