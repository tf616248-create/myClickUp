import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TasksService } from '../../services/tasks/tasks-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-task.html',
  styleUrls: ['./create-task.scss'],
})
export class CreateTask implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TasksService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Input() projectId?: string | number;

  taskForm = this.fb.group({
    projectId: [null as number | null, [Validators.required, Validators.min(1)]],
    title: ['', [Validators.required]],
    description: ['']
  });

  isSubmitting = false;
  submitError?: string;

  ngOnInit(): void {
    if (this.projectId != null) {
      this.taskForm.patchValue({ projectId: Number(this.projectId) });
    } else {
      const pid = this.route.snapshot.queryParamMap.get('projectId');
      if (pid) {
        this.taskForm.patchValue({ projectId: Number(pid) });
      }
    }
  }

  async saveTask() {
    if (this.taskForm.invalid) return;

    const raw = this.taskForm.getRawValue();
    const trimmedTitle = (raw.title || '').toString().trim();
    if (!trimmedTitle) {
      this.taskForm.get('title')?.setErrors({ required: true });
      return;
    }

    this.isSubmitting = true;
    this.submitError = undefined;
    try {
      const payload = {
        projectId: Number(raw.projectId),
        title: trimmedTitle,
        description: raw.description || ''
      };
      await this.taskService.addTask(payload);
      this.router.navigate(['../'], {
        relativeTo: this.route,
        queryParamsHandling: 'preserve'
      });
    } catch (err: any) {
      this.submitError = err?.error?.message || err?.message || 'שגיאה בשמירה';
      console.error('Save task failed', err);
    } finally {
      this.isSubmitting = false;
    }
  }
}
