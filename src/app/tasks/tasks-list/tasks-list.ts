import { Component, computed, inject, input, signal, OnInit, AfterViewInit } from '@angular/core';
import { TasksService } from '../../services/tasks/tasks-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommentsListComponent } from '../../comments/comments-list/comments-list';
import { Task } from '../../models/task';

@Component({
  selector: 'app-tasks-list',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule,
    CommentsListComponent
  ],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.scss',
})
export class TasksList implements OnInit, AfterViewInit {
  projectId = input.required<string>();
  taskId = input<string | undefined>(undefined);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public tasksService = inject(TasksService);
  private fb = inject(FormBuilder);

  editingTaskId: number | null = null;
  openedTaskId = signal<number | null>(null);

  toggleComments(taskId: number) {
    const project = this.projectId();
    if (this.openedTaskId() === taskId) {
      this.openedTaskId.set(null);
      this.router.navigate(['/projects', project, 'tasks']);
    } else {
      this.openedTaskId.set(taskId);
      this.router.navigate(['/projects', project, 'tasks', taskId, 'comments']);
    }
  }

  isCommentsOpen = computed(() => (taskId: number) => this.openedTaskId() === taskId);

  editingTaskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['normal' as Task['priority']]
  });

  isCreateFormOpen = computed(() => this.router.url.includes('create-task'));

  ngOnInit() {
    const pid = parseInt(this.projectId(), 10);
    if (pid) this.tasksService.getTasksByProjectId(pid);

    this.route.params.subscribe(params => {
      const tid = params['taskId'];
      if (tid) this.openedTaskId.set(parseInt(tid, 10));
    });
  }

  ngAfterViewInit() {
    if (this.openedTaskId()) this.scrollToTask(this.openedTaskId()!);
  }

  private scrollToTask(taskId: number) {
    const el = document.getElementById(`task-${taskId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('task-highlight');
      setTimeout(() => el.classList.remove('task-highlight'), 2000);
    }
  }

  toggleCreateTask(): void {
    const project = this.projectId();
    if (this.isCreateFormOpen()) {
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: {} });
    } else {
      this.router.navigate(['create-task'], {
        relativeTo: this.route,
        queryParams: { projectId: project }
      });
    }
  }

  startEditTask(task: Task): void {
    this.editingTaskId = task.id!;
    this.editingTaskForm.patchValue({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'normal'
    });
  }

  cancelEdit(): void {
    this.editingTaskId = null;
    this.editingTaskForm.reset();
  }

  async saveEdit(): Promise<void> {
    if (!this.editingTaskId || this.editingTaskForm.invalid) return;

    const updates: Partial<Task> = {
      title: this.editingTaskForm.value.title || undefined,
      description: this.editingTaskForm.value.description || undefined,
      priority: this.editingTaskForm.value.priority || undefined
    };

    const success = await this.tasksService.updateTask(this.editingTaskId, updates);
    if (success) this.cancelEdit();
    else alert('שגיאה בעדכון המשימה');
  }

  async deleteTask(taskId: number) {
    if (confirm('האם למחוק משימה זו?')) {
      await this.tasksService.deleteTask(taskId);
    }
  }

  getPriorityColor(priority: Task['priority']): 'primary' | 'accent' | 'warn' {
    switch (priority) {
      case 'high': return 'warn';
      case 'low': return 'accent';
      default: return 'primary';
    }
  }

  getPriorityText(priority: Task['priority']): string {
    switch (priority) {
      case 'high': return 'גבוהה';
      case 'low': return 'נמוכה';
      default: return 'רגילה';
    }
  }

  trackTaskById(index: number, task: Task): number {
    return task.id!;
  }
}
