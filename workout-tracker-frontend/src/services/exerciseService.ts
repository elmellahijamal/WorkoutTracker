import { api } from './api';

const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    const validationErrors = error.response.data.errors;
    const firstError = Object.values(validationErrors)[0];
    return Array.isArray(firstError) ? firstError[0] : firstError;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const exerciseService = {
  getExercises: async () => {
    try {
      const response = await api.get('/exercises');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  createExercise: async (data: any) => {
    try {
      const response = await api.post('/exercises', data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};