import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchExercises } from '../../slices/exerciseSlice';
import { addExerciseToWorkoutSchema, AddExerciseFormData } from '../../schemas/workout.schema';
import { workoutService } from '../../services/workoutService';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';

const WorkoutDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { exercises } = useAppSelector(state => state.exercises);
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddExercise, setShowAddExercise] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddExerciseFormData>({
    resolver: zodResolver(addExerciseToWorkoutSchema)
  });

  useEffect(() => {
    dispatch(fetchExercises());
    if (id) {
      loadWorkout();
    }
  }, [dispatch, id]);

  const loadWorkout = async () => {
    try {
      const workoutData = await workoutService.getWorkout(Number(id));
      setWorkout(workoutData);
    } catch (error) {
      console.error('Error loading workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const onAddExercise = async (data: AddExerciseFormData) => {
    try {
      await api.post(`/workouts/${id}/exercises`, data);
      setShowAddExercise(false);
      reset();
      loadWorkout();
      toast.success('Exercise added to workout!');
    } catch (error) {
      console.error('Error adding exercise to workout:', error);
      toast.error('Failed to add exercise');
    }
  };

  const completeWorkout = async () => {
    try {
      await workoutService.completeWorkout(Number(id));
      loadWorkout();
      toast.success('Workout completed! Great job! 🎉');
    } catch (error) {
      console.error('Error completing workout:', error);
      toast.error('Failed to complete workout');
    }
  };

  const getMuscleGroups = () => [
    { name: 'Chest', value: 1 },
    { name: 'Back', value: 2 },
    { name: 'Shoulders', value: 3 },
    { name: 'Biceps', value: 4 },
    { name: 'Triceps', value: 5 },
    { name: 'Legs', value: 6 },
    { name: 'Glutes', value: 7 },
    { name: 'Core', value: 8 },
    { name: 'Cardio', value: 9 },
    { name: 'FullBody', value: 10 }
  ];

  const getMuscleGroupName = (value: number) => {
    const groups = getMuscleGroups();
    const group = groups.find(g => g.value === value);
    return group ? group.name : 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Workout not found</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <Navbar
  title={workout.name}
  subtitle={
    <div className="flex items-center space-x-4">
      <p className="text-slate-400 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {new Date(workout.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        workout.isCompleted 
          ? 'bg-green-900 text-green-400 border border-green-800' 
          : 'bg-orange-900 text-orange-400 border border-orange-800'
      }`}>
        {workout.isCompleted ? (
          <>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Completed
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            In Progress
          </>
        )}
      </span>
    </div>
  }
  showBackButton={true}
  actions={
    !workout.isCompleted && (
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setShowAddExercise(true)}
          className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Exercise
        </button>
        <button 
          onClick={completeWorkout}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Complete Workout
        </button>
      </div>
    )
  }
/>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {showAddExercise && (
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 mb-8">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-medium text-white">Add Exercise to Workout</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit(onAddExercise)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Exercise
                  </label>
                  <select 
                    {...register('exerciseId', { 
                      valueAsNumber: true,
                      required: 'Exercise is required'
                    })}
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Exercise</option>
                    {exercises.map(exercise => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name} ({getMuscleGroupName(exercise.muscleGroup)})
                      </option>
                    ))}
                  </select>
                  {errors.exerciseId && <p className="mt-1 text-sm text-red-400">{errors.exerciseId.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Sets
                    </label>
                    <input
                      {...register('sets', { valueAsNumber: true })}
                      type="number"
                      placeholder="3"
                      className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.sets && <p className="mt-1 text-sm text-red-400">{errors.sets.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Reps
                    </label>
                    <input
                      {...register('reps', { valueAsNumber: true })}
                      type="number"
                      placeholder="10"
                      className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.reps && <p className="mt-1 text-sm text-red-400">{errors.reps.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      {...register('weight', { valueAsNumber: true })}
                      type="number"
                      step="0.5"
                      placeholder="80"
                      className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    placeholder="Any notes about this exercise..."
                    rows={3}
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowAddExercise(false)}
                    className="px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Add Exercise
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Exercises List */}
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">
              Exercises ({workout.exercises?.length || 0})
            </h2>
          </div>
          
          <div className="p-6">
            {!workout.exercises || workout.exercises.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-300">No exercises added yet</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {workout.isCompleted ? 'This workout was completed without exercises.' : 'Start by adding your first exercise.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {workout.exercises.map((exercise: any, index: number) => (
                  <div key={index} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">{exercise.name}</h4>
                        <div className="flex items-center mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-400 border border-blue-800">
                            {getMuscleGroupName(exercise.muscleGroup)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="bg-slate-800 p-3 rounded-lg">
                            <p className="text-slate-400 font-medium">Sets</p>
                            <p className="text-white text-lg font-bold">{exercise.sets}</p>
                          </div>
                          <div className="bg-slate-800 p-3 rounded-lg">
                            <p className="text-slate-400 font-medium">Reps</p>
                            <p className="text-white text-lg font-bold">{exercise.reps}</p>
                          </div>
                          {exercise.weight && (
                            <div className="bg-slate-800 p-3 rounded-lg">
                              <p className="text-slate-400 font-medium">Weight</p>
                              <p className="text-white text-lg font-bold">{exercise.weight}kg</p>
                            </div>
                          )}
                          <div className="bg-slate-800 p-3 rounded-lg">
                            <p className="text-slate-400 font-medium">Volume</p>
                            <p className="text-white text-lg font-bold">
                              {exercise.weight ? (exercise.sets * exercise.reps * exercise.weight).toFixed(0) + 'kg' : exercise.sets * exercise.reps}
                            </p>
                          </div>
                        </div>
                        {exercise.notes && (
                          <div className="mt-3 p-3 bg-slate-800 rounded-lg">
                            <p className="text-slate-400 text-sm font-medium mb-1">Notes:</p>
                            <p className="text-slate-300 text-sm">{exercise.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutDetails;