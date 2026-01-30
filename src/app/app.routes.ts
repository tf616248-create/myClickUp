import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'teams',
    loadComponent: () => import('./teams/teams-list/teams-list').then(m => m.TeamsList),
    canActivate: [authGuard],
    children: [
      {
        path: 'create-team',
        loadComponent: () => import('./teams/create-team/create-team').then(m => m.CreateTeam)
      }
    ]
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/projects-list/projects-list').then(m => m.projectsList),
    canActivate: [authGuard],
    children: [
      {
        path: 'create-project',
        loadComponent: () => import('./projects/create-project/create-project').then(m => m.CreateProject)
      }
    ]
  },
  {
    path: 'projects/:projectId/tasks',
    loadComponent: () => import('./tasks/tasks-list/tasks-list').then(m => m.TasksList),
    canActivate: [authGuard],
    children: [
      {
        path: 'create-task',
        loadComponent: () => import('./tasks/create-task/create-task').then(m => m.CreateTask)
      },
      {
        path: ':taskId/comments',
        loadComponent: () => import('./comments/comments-list/comments-list').then(m => m.CommentsListComponent)
      }
    ]
  },
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/tasks-list/tasks-list').then(m => m.TasksList),
    canActivate: [authGuard],
    children: [
      {
        path: 'create-task',
        loadComponent: () => import('./tasks/create-task/create-task').then(m => m.CreateTask)
      }
    ]
  },
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: '**', redirectTo: 'teams' }
];