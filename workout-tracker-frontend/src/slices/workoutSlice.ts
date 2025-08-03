import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workoutService } from '../services/workoutService';
import { CreateWorkoutFormData } from '../schemas/workout.schema';

interface Workout {
  id: number;
  name: string;
  date: string;
  isCompleted: boolean;
  userId: number;
  exercises: any[];
}

interface WorkoutState {
  workouts: Workout[];
  currentWorkout: Workout | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkoutState = {
  workouts: [],
  currentWorkout: null,
  isLoading: false,
  error: null,
};

export const fetchWorkouts = createAsyncThunk('workouts/fetchWorkouts', async (userId: number) => {
  return await workoutService.getWorkouts(userId);
});

export const createWorkout = createAsyncThunk('workouts/createWorkout', async (data: CreateWorkoutFormData & { userId: number }) => {
  return await workoutService.createWorkout(data);
});

const workoutSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.workouts = action.payload;
        state.isLoading = false;
      })
      .addCase(createWorkout.fulfilled, (state, action) => {
        state.workouts.push(action.payload);
        state.isLoading = false;
      });
  },
});

export const { clearError } = workoutSlice.actions;
export default workoutSlice.reducer;