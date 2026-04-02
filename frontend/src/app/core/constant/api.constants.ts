export const API_BASE_URL = 'http://localhost:4040';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    LOGIN: '/auth/login',
    RESEND:"/auth/resend-otp",
    REFRESH: '/auth/refresh',
  },
  TASK: {
    CREATE: '/tasks',
    GET_MY: '/tasks',
    GET_ALL: '/tasks/admin/all',
    UPDATE: (id: number) => `/tasks/${id}`,
    DELETE: (id: number) => `/tasks/${id}`,
    MARK_DONE: (id: number) => `/tasks/${id}/status`,
  },
};