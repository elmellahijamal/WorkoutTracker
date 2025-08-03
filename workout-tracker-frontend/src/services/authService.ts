import { api } from './api';
import { LoginFormData, RegisterFormData } from '../schemas/auth.schema';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
}

// Helper function to extract error message
const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    // Handle validation errors
    const validationErrors = error.response.data.errors;
    const firstError = Object.values(validationErrors)[0];
    return Array.isArray(firstError) ? firstError[0] : firstError;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const authService = {
  login: async (credentials: LoginFormData): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  register: async (userData: RegisterFormData): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};