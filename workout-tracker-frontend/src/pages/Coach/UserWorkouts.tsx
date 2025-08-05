import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';

interface Exercise {
  id: number;
  name: string;
  description: string;
  muscleGroup: number;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

interface Workout {
  id: number;
  name: string;
  date: string;
  isCompleted: boolean;
  userId?: number;
  exercises: Exercise[];
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

const UserWorkouts = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAppSelector(state => state.auth);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingWorkout, setDeletingWorkout] = useState<Workout | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUserWorkouts();
      loadUserData();
    }
  }, [userId]);

  const loadUserWorkouts = async () => {
    try {
      const response = await api.get(`/workouts/user/${userId}`);
      setWorkouts(response.data);
    } catch (error: any) {
      console.error('Error loading user workouts:', error);
      if (error.response?.status === 404) {
        toast.error('User not found');
        navigate('/dashboard');
      } else {
        toast.error('Failed to load workouts');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      // Get user data from the coach/users endpoint (assuming it returns all users)
      const response = await api.get('/coach/users');
      const user = response.data.find((u: User) => u.id === Number(userId));
      if (user) {
        setUserData(user);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleDeleteClick = (workout: Workout, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the card click
    setDeletingWorkout(workout);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingWorkout) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/workouts/${deletingWorkout.id}`);
      setWorkouts(workouts.filter(w => w.id !== deletingWorkout.id));
      setShowDeleteConfirm(false);
      setDeletingWorkout(null);
      toast.success('Workout deleted successfully!');
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast.error('Failed to delete workout');
    } finally {
      setIsDeleting(false);
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

  const filteredWorkouts = workouts.filter(workout => {
    if (filter === 'completed') return workout.isCompleted;
    if (filter === 'pending') return !workout.isCompleted;
    return true;
  });

  const getWorkoutStatusColor = (isCompleted: boolean) => {
    return isCompleted 
      ? 'bg-green-900 text-green-400 border border-green-800'
      : 'bg-orange-900 text-orange-400 border border-orange-800';
  };

  const getWorkoutStatusIcon = (isCompleted: boolean) => {
    return isCompleted ? (
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : (
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
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

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar
        title={userData ? `${userData.name}'s Workouts` : 'User Workouts'}
        subtitle={
          <div className="flex items-center space-x-4">
            <p className="text-slate-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {userData?.username && `@${userData.username}`} • {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
            </p>
            <span className="text-slate-500">•</span>
            <span className="text-green-400 text-sm">
              {workouts.filter(w => w.isCompleted).length} completed
            </span>
            <span className="text-orange-400 text-sm">
              {workouts.filter(w => !w.isCompleted).length} pending
            </span>
          </div>
        }
        showBackButton={true}
        backTo="/dashboard"
        actions={
          <div className="flex items-center space-x-3">
            {/* Filter buttons */}
            <div className="flex items-center bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  filter === 'pending' 
                    ? 'bg-orange-600 text-white' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  filter === 'completed' 
                    ? 'bg-green-600 text-white' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        }
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Delete Workout</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete "{deletingWorkout.name}"? This action cannot be undone and will remove all exercises from this workout.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingWorkout(null);
                }}
                className="px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Workout'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-900 text-blue-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-slate-400 text-sm font-medium">Total Workouts</p>
                <p className="text-white text-2xl font-bold">{workouts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-900 text-green-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-slate-400 text-sm font-medium">Completed</p>
                <p className="text-white text-2xl font-bold">{workouts.filter(w => w.isCompleted).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-900 text-orange-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-slate-400 text-sm font-medium">Pending</p>
                <p className="text-white text-2xl font-bold">{workouts.filter(w => !w.isCompleted).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workouts List */}
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">
              {filter === 'all' ? 'All Workouts' : 
               filter === 'completed' ? 'Completed Workouts' : 'Pending Workouts'} 
              ({filteredWorkouts.length})
            </h2>
          </div>
          
          <div className="p-6">
            {filteredWorkouts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-300">
                  No {filter === 'all' ? '' : filter} workouts found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {filter === 'all' 
                    ? 'This user has no assigned workouts yet.' 
                    : `This user has no ${filter} workouts.`}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredWorkouts.map((workout) => (
                  <div 
                    key={workout.id} 
                    className="bg-slate-700 border border-slate-600 rounded-lg p-6 hover:bg-slate-650 hover:border-slate-500 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/workouts/${workout.id}`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{workout.name}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getWorkoutStatusColor(workout.isCompleted)}`}>
                            {getWorkoutStatusIcon(workout.isCompleted)}
                            {workout.isCompleted ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(workout.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="inline-flex items-center px-3 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white transition duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        {/* Delete button - only visible to coaches */}
                        {currentUser?.role === 'Coach' && (
                          <button
                            onClick={(e) => handleDeleteClick(workout, e)}
                            className="inline-flex items-center p-2 border border-red-600 text-sm font-medium rounded-lg text-red-400 bg-red-900/50 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                            title="Delete workout"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Exercise Preview */}
                    {workout.exercises.length > 0 && (
                      <div className="border-t border-slate-600 pt-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-3">Exercises:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {workout.exercises.slice(0, 6).map((exercise, index) => (
                            <div key={index} className="bg-slate-800 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="text-sm font-medium text-white truncate">{exercise.name}</h5>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-400 border border-blue-800">
                                  {getMuscleGroupName(exercise.muscleGroup)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 text-xs text-slate-400">
                                <span>{exercise.sets} sets</span>
                                <span>×</span>
                                <span>{exercise.reps} reps</span>
                                {exercise.weight && (
                                  <>
                                    <span>@</span>
                                    <span>{exercise.weight}kg</span>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                          {workout.exercises.length > 6 && (
                            <div className="bg-slate-800 rounded-lg p-3 flex items-center justify-center">
                              <span className="text-sm text-slate-400">
                                +{workout.exercises.length - 6} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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

export default UserWorkouts;
