import { API_BASE_URL } from "../constant/api.constants";

export class ApiUtils {
  static getUrl(endpoint: string): string {
    return `${API_BASE_URL}${endpoint}`;
  }
}