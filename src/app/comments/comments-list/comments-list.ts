import { Component, input, signal, inject, linkedSignal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommentsService } from '../comments.service';
import { Comment } from '../comment.interface';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './comments-list.html',
  styleUrl: './comments-list.scss'
})
export class CommentsListComponent {
  taskId = input.required<number>();
  currentUserId = signal<number>(1);

  private commentsService = inject(CommentsService);

  newComment = linkedSignal(() => '');
  isSubmitting = signal(false);
  comments = signal<Comment[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  private taskIdEffect = effect(() => {
    const currentTaskId = this.taskId();
    if (currentTaskId) {
      this.loadComments();
    }
  });

  async loadComments() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const comments = await this.commentsService.getComments(this.taskId()).toPromise();
      this.comments.set(comments || []);
    } catch (err) {
      this.error.set('Failed to load comments');
      console.error('Failed to load comments:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async addComment() {
    const commentBody = this.newComment().trim();
    if (!commentBody || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const optimisticComment: Comment = {
      id: Date.now(),
      task_id: this.taskId(),
      user_id: this.currentUserId(),
      author_name: 'Current User',
      body: commentBody,
      created_at: new Date().toISOString()
    };

    try {
      this.comments.set([...this.comments(), optimisticComment]);
      this.newComment.set('');

      const serverComment = await this.commentsService.addComment(
        this.taskId(),
        commentBody
      ).toPromise();

      if (serverComment) {
        const currentComments = this.comments();
        const index = currentComments.findIndex(c => c.id === optimisticComment.id);
        if (index !== -1) {
          currentComments[index] = serverComment;
          this.comments.set([...currentComments]);
        }
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      this.comments.set(this.comments().filter(c => c.id !== optimisticComment.id));
      this.newComment.set(commentBody);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  isMyComment(comment: Comment): boolean {
    return comment.user_id === this.currentUserId();
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        return;
      } else {
        event.preventDefault();
        this.addComment();
      }
    }
  }

  refreshComments() {
    this.loadComments();
  }
}
