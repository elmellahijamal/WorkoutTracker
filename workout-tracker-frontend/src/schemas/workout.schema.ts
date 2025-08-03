import { z } from 'zod';

export const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  date: z.string().min(1, 'Date is required'),
});

export const addExerciseToWorkoutSchema = z.object({
  exerciseId: z.number().min(1, 'Exercise is required'),
  sets: z.number().min(1, 'Sets must be at least 1'),
  reps: z.number().min(1, 'Reps must be at least 1'),
  weight: z.number().optional(),
  notes: z.string().optional(),
});

export type CreateWorkoutFormData = z.infer<typeof createWorkoutSchema>;
export type AddExerciseFormData = z.infer<typeof addExerciseToWorkoutSchema>;