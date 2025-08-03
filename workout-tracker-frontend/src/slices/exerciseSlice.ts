import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { exerciseService } from '../services/exerciseService';

interface Exercise {
  id: number;
  name: string;
  description: string;
  muscleGroup: number;
}

interface ExerciseState {
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExerciseState = {
  exercises: [],
  isLoading: false,
  error: null,
};

export const fetchExercises = createAsyncThunk('exercises/fetchExercises', async () => {
  return await exerciseService.getExercises();
});

const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.exercises = action.payload;
        state.isLoading = false;
      });
  },
});

export default exerciseSlice.reducer;