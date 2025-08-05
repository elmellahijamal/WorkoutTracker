import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface Exercise {
  id: number;
  name: string;
  description: string;
  muscleGroup: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

interface WorkoutExercise {
  exerciseId: number;
  exerciseName: string;
  muscleGroup: number;
  sets: number;
  reps: number;
  weight?: number;
  notes: string;
}

interface CreateAndAssignWorkoutProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAndAssignWorkout: React.FC<CreateAndAssignWorkoutProps> = ({ onClose, onSuccess }) => {
  const { user } = useAppSelector(state => state.auth);
  const [workoutName, setWorkoutName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Data
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  
  // Form state
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState<number | undefined>();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [exercisesRes, usersRes] = await Promise.all([
        api.get('/exercises'),
        api.get('/coach/users')
      ]);
      setExercises(exercisesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
  };

  const getMuscleGroupName = (value: number) => {
    const groups = [
      { name: 'Chest', value: 1 }, { name: 'Back', value: 2 },
      { name: 'Shoulders', value: 3 }, { name: 'Biceps', value: 4 },
      { name: 'Triceps', value: 5 }, { name: 'Legs', value: 6 },
      { name: 'Glutes', value: 7 }, { name: 'Core', value: 8 },
      { name: 'Cardio', value: 9 }, { name: 'FullBody', value: 10 }
    ];
    return groups.find(g => g.value === value)?.name || 'Unknown';
  };

  const addExerciseToWorkout = () => {
    if (!selectedExerciseId) {
      toast.error('Please select an exercise');
      return;
    }

    const exercise = exercises.find(e => e.id === selectedExerciseId);
    if (!exercise) return;

    // Check if exercise already added
    if (workoutExercises.some(we => we.exerciseId === selectedExerciseId)) {
      toast.error('Exercise already added to workout');
      return;
    }

    const newWorkoutExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      muscleGroup: exercise.muscleGroup,
      sets,
      reps,
      weight,
      notes
    };

    setWorkoutExercises([...workoutExercises, newWorkoutExercise]);
    
    // Reset form
    setSelectedExerciseId(null);
    setSets(3);
    setReps(10);
    setWeight(undefined);
    setNotes('');
    setShowExerciseSelector(false);
    
    toast.success(`${exercise.name} added to workout!`);
  };

  const removeExercise = (exerciseId: number) => {
    setWorkoutExercises(workoutExercises.filter(we => we.exerciseId !== exerciseId));
  };

  const createAndAssignWorkout = async () => {
    if (!workoutName.trim()) {
      toast.error('Workout name is required');
      return;
    }

    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    if (workoutExercises.length === 0) {
      toast.error('Add at least one exercise');
      return;
    }

    setLoading(true);
    try {
      await api.post('/workouts/create-and-assign', {
        name: workoutName,
        date: workoutDate,
        userId: selectedUserId,
        coachId: user?.id,
        exercises: workoutExercises.map(we => ({
          exerciseId: we.exerciseId,
          sets: we.sets,
          reps: we.reps,
          weight: we.weight,
          notes: we.notes
        }))
      });

      toast.success('Workout created and assigned successfully! 🎉');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating workout:', error);
      toast.error(error.response?.data?.message || 'Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Create & Assign Workout</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Workout Name</label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="e.g., Upper Body Strength"
                className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Assign to User</label>
              <select 
                value={selectedUserId || ''}
                onChange={(e) => setSelectedUserId(Number(e.target.value) || null)}
                className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} (@{user.username})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Workout Date</label>
              <input
                type="date"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Exercises Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Workout Exercises ({workoutExercises.length})
              </h3>
              <button 
                onClick={() => setShowExerciseSelector(!showExerciseSelector)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Exercise
              </button>
            </div>

            {/* Exercise Selector */}
            {showExerciseSelector && (
              <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 mb-4">
                <h4 className="text-white font-medium mb-4">Add Exercise to Workout</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Select Exercise</label>
                    <select 
                      value={selectedExerciseId || ''}
                      onChange={(e) => setSelectedExerciseId(Number(e.target.value) || null)}
                      className="block w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose Exercise</option>
                      {exercises.map(exercise => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name} - {getMuscleGroupName(exercise.muscleGroup)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Sets</label>
                    <input
                      type="number"
                      value={sets}
                      onChange={(e) => setSets(parseInt(e.target.value) || 0)}
                      min="1"
                      className="block w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Reps</label>
                    <input
                      type="number"
                      value={reps}
                      onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                      min="1"
                      className="block w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Weight (kg) - Optional</label>
                    <input
                      type="number"
                      step="0.5"
                      value={weight || ''}
                      onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="block w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Notes - Optional</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Form cues, tempo, etc."
                      className="block w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowExerciseSelector(false)}
                    className="px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={addExerciseToWorkout}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
                  >
                    Add to Workout
                  </button>
                </div>
              </div>
            )}

            {/* Exercise List */}
            <div className="space-y-3">
              {workoutExercises.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <svg className="mx-auto h-12 w-12 text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  No exercises added yet. Click "Add Exercise" to get started.
                </div>
              ) : (
                workoutExercises.map((exercise, index) => (
                  <div key={exercise.exerciseId} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h4 className="text-white font-medium">{exercise.exerciseName}</h4>
                          <span className="px-2 py-1 bg-blue-900 text-blue-400 text-xs rounded-full">
                            {getMuscleGroupName(exercise.muscleGroup)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-slate-800 p-2 rounded text-center">
                            <p className="text-slate-400 text-xs">Sets</p>
                            <p className="text-white font-bold">{exercise.sets}</p>
                          </div>
                          <div className="bg-slate-800 p-2 rounded text-center">
                            <p className="text-slate-400 text-xs">Reps</p>
                            <p className="text-white font-bold">{exercise.reps}</p>
                          </div>
                          <div className="bg-slate-800 p-2 rounded text-center">
                            <p className="text-slate-400 text-xs">Weight</p>
                            <p className="text-white font-bold">
                              {exercise.weight ? `${exercise.weight}kg` : 'Bodyweight'}
                            </p>
                          </div>
                          <div className="bg-slate-800 p-2 rounded text-center">
                            <p className="text-slate-400 text-xs">Volume</p>
                            <p className="text-white font-bold">
                              {exercise.weight 
                                ? `${(exercise.sets * exercise.reps * exercise.weight).toFixed(0)}kg`
                                : `${exercise.sets * exercise.reps}`
                              }
                            </p>
                          </div>
                        </div>
                        
                        {exercise.notes && (
                          <div className="mt-3 p-2 bg-slate-800 rounded">
                            <p className="text-slate-400 text-xs mb-1">Notes:</p>
                            <p className="text-slate-300 text-sm">{exercise.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => removeExercise(exercise.exerciseId)}
                        className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
            <button 
              onClick={onClose}
              className="px-6 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 transition duration-200"
            >
              Cancel
            </button>
            <button 
              onClick={createAndAssignWorkout}
              disabled={loading}
              className="px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-3m-1 4l-3 3 7-7" />
                  </svg>
                  Create & Assign Workout
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAndAssignWorkout;