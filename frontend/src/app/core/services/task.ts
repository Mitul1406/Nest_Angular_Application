import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { API_ENDPOINTS } from '../constant/api.constants';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private api: ApiService) {}
  

  create(data: { title: string; description?: string }) {
    return this.api.post(API_ENDPOINTS.TASK.CREATE, data);
  }

  getMyTasks() {
    return this.api.get(API_ENDPOINTS.TASK.GET_MY);
  }

  getAllTasks() {
    return this.api.get(API_ENDPOINTS.TASK.GET_ALL);
  }

  update(id: number, data: { title?: string; description?: string; completed?: boolean }) {
    return this.api.put(API_ENDPOINTS.TASK.UPDATE(id), data);
  }

  delete(id: number) {
    return this.api.delete(API_ENDPOINTS.TASK.DELETE(id));
  }

  markDone(id: number, completed: boolean) {
    return this.api.put(API_ENDPOINTS.TASK.MARK_DONE(id), { completed });
  }
}