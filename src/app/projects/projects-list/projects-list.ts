import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Subscription } from 'rxjs';
import { ProjectsService } from '../../services/projects/projects-service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './projects-list.html',
  styleUrls: ['./projects-list.scss']
})
export class projectsList implements OnInit, OnDestroy {
  protected serviceProjects = inject(ProjectsService);
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);

  get isCreateFormOpen(): boolean {
    return this.router.url.includes('/projects/create');
  }

  private queryParamsSubscription: Subscription | undefined;
  currentTeamId: number | null = null;

  ngOnInit(): void {
    this.loadProjectsForCurrentRoute();

    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.loadProjectsForCurrentRoute();
    });
  }

  private loadProjectsForCurrentRoute(): void {
    const teamId = this.route.snapshot.queryParams['teamId'];
    const numericTeamId = teamId ? +teamId : undefined;
    this.currentTeamId = numericTeamId || null;

    this.serviceProjects.loadProjects(numericTeamId);
  }

  toggleCreateProject(): void {
    if (this.router.url.includes('/projects/create-project')) {
      if (this.currentTeamId) {
        this.router.navigate(['/projects'], {
          queryParams: { teamId: this.currentTeamId }
        });
      } else {
        this.router.navigate(['/projects']);
      }
    } else {
      const queryParams = this.currentTeamId ? { teamId: this.currentTeamId } : undefined;
      this.router.navigate(['create-project'], {
        relativeTo: this.route,
        queryParams: queryParams
      });
    }
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }
}
