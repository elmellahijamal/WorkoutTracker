import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slices/authSlice';
import workoutSlice from '../slices/workoutSlice';
import exerciseSlice from '../slices/exerciseSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    workouts: workoutSlice,
    exercises: exerciseSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;