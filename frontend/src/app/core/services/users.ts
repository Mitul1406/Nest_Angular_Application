import { Injectable } from '@angular/core';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root',
})
export class Users {
  constructor(private api: ApiService){}
  uploadProfile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return this.api.post('/users/upload-profile', formData);
}

getUser(id: string) {
  return this.api.get(`/users/${id}`);
}
}
