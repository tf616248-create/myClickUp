import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProjectsService } from '../../services/projects/projects-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { projectData } from '../../models/project';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-project.html',
  styleUrls: ['./create-project.scss']
})
export class CreateProject implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectsService);
  router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;

  projectForm = this.fb.nonNullable.group({
    teamId: [0, [Validators.required, Validators.min(1)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['']
  });

  ngOnInit(): void {
    const teamId = this.route.snapshot.queryParams['teamId'];
    if (teamId) {
      const numericTeamId = +teamId;
      this.projectForm.patchValue({ teamId: numericTeamId });
      this.projectService.loadProjects(numericTeamId);
    }
  }

  onCreateProject(): void {
    if (this.projectForm.valid) {
      this.isLoading = true;
      const teamId = this.projectForm.get('teamId')?.value;

      this.projectService.addProject(this.projectForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          if (teamId) {
            this.router.navigate(['/projects'], {
              queryParams: { teamId: teamId }
            });
          } else {
            this.router.navigate(['/projects']);
          }
        },
        error: (err) => {
          console.error('Error:', err);
          this.isLoading = false;
        }
      });
    }
  }
}
