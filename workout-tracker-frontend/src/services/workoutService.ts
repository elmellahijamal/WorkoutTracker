import { api } from './api';
import { CreateWorkoutFormData } from '../schemas/workout.schema';

// Same helper function
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

export const workoutService = {
  getWorkouts: async (userId: number) => {
    try {
      const response = await api.get(`/workouts/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  createWorkout: async (data: CreateWorkoutFormData & { userId: number }) => {
    try {
      const response = await api.post('/workouts', data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getWorkout: async (id: number) => {
    try {
      const response = await api.get(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  completeWorkout: async (id: number) => {
    try {
      const response = await api.post(`/workouts/${id}/complete`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};