import { Component, OnInit, signal } from '@angular/core';
import { TaskService } from '../../core/services/task';
import { TokenService } from '../../core/services/token';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-dashboard', standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,HeaderComponent],
  templateUrl: './dashboard.component.html',

})
export class DashboardComponent implements OnInit {
 tasks = signal<any[]>([]);
  role: string | null = '';

  newTask = {
    title: '',
    description: ''
  };

  editId: number | null = null;
  editTask: any = {};

  constructor(
    private taskService: TaskService,
    private token: TokenService
  ) {}

  ngOnInit() {
    this.role = this.token.getRole();
    this.loadTasks();
  }

  loadTasks() {
  const request = this.role === 'ADMIN'
    ? this.taskService.getAllTasks()
    : this.taskService.getMyTasks();

  request.subscribe((res: any) => {    
    this.tasks.set(res.data);

    console.log("------------>",this.tasks);

  });
}

  createTask() {
  if (!this.newTask.title) return;

  this.taskService.create(this.newTask)
    .subscribe((res: any) => {

      this.tasks.update(tasks => [res.data, ...tasks]);

      this.newTask = { title: '', description: '' };
    });
}

  startEdit(task: any) {
    this.editId = task.id;
    this.editTask = { ...task };
  }

  cancelEdit() {
    this.editId = null;
    this.editTask = {};
  }

  updateTask(id: number) {
  this.taskService.update(id, {
    title: this.editTask.title,
    description: this.editTask.description
  }).subscribe(() => {

    this.tasks.update(tasks =>
      tasks.map(t =>
        t.id === id
          ? { ...t, ...this.editTask }
          : t
      )
    );

    this.editId = null;
  });
}

  toggleStatus(task: any) {
  this.taskService.markDone(task.id, !task.completed)
    .subscribe(() => {
      this.tasks.update(tasks =>
        tasks.map(t =>
          t.id === task.id
            ? { ...t, completed: !t.completed }
            : t
        )
      );
    });
}

  deleteTask(id: number) {
  this.taskService.delete(id)
    .subscribe(() => {
      this.tasks.update(tasks =>
        tasks.filter(t => t.id !== id)
      );
    });
}
}