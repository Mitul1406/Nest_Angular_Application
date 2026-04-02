import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUtils } from '../utils/api.utils';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get(endpoint: string) {
    return this.http.get(ApiUtils.getUrl(endpoint));
  }

  post(endpoint: string, body: any) {
    return this.http.post(ApiUtils.getUrl(endpoint), body);
  }

  put(endpoint: string, body: any) {
    return this.http.put(ApiUtils.getUrl(endpoint), body);
  }

  delete(endpoint: string) {
    return this.http.delete(ApiUtils.getUrl(endpoint));
  }
}