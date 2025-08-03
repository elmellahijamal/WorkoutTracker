import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../slices/authSlice';
import { fetchWorkouts, createWorkout } from '../../slices/workoutSlice';
import { createWorkoutSchema, CreateWorkoutFormData } from '../../schemas/workout.schema';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const { workouts, isLoading } = useAppSelector(state => state.workouts);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateWorkoutFormData>({
    resolver: zodResolver(createWorkoutSchema)
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchWorkouts(user.id));
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const onSubmitWorkout = async (data: CreateWorkoutFormData) => {
    if (user) {
      const result = await dispatch(createWorkout({ ...data, userId: user.id }));
      if (createWorkout.fulfilled.match(result)) {
        setShowCreateForm(false);
        reset();
        dispatch(fetchWorkouts(user.id));
        toast.success('Workout created successfully!');
      } else {
        toast.error('Failed to create workout');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <Navbar 
  title={`Welcome back, ${user?.name}! 👋`}
  subtitle="Track your fitness journey"
/>
  
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total Workouts</p>
                <p className="text-2xl font-bold text-white">{workouts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {workouts.filter(w => w.isCompleted).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">In Progress</p>
                <p className="text-2xl font-bold text-white">
                  {workouts.filter(w => !w.isCompleted).length}
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Workouts Section */}
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <div className="px-6 py-4 border-b border-slate-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Your Workouts</h2>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Workout
              </button>
            </div>
          </div>
  
          {showCreateForm && (
            <div className="px-6 py-4 border-b border-slate-700 bg-slate-750">
              <h3 className="text-lg font-medium text-white mb-4">Create New Workout</h3>
              <form onSubmit={handleSubmit(onSubmitWorkout)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Workout Name
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="e.g., Push Day, Leg Day"
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Date & Time
                  </label>
                  <input
                    {...register('date')}
                    type="datetime-local"
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
                  )}
                </div>
  
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Create Workout
                  </button>
                </div>
              </form>
            </div>
          )}
  
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : workouts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-300">No workouts yet</h3>
                <p className="mt-1 text-sm text-slate-500">Get started by creating your first workout.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {workouts.map((workout: any) => (
                  <div 
                    key={workout.id} 
                    className="bg-slate-700 border border-slate-600 rounded-lg p-6 hover:bg-slate-650 hover:border-slate-500 transition-all duration-200 cursor-pointer group"
                    onClick={() => navigate(`/workout/${workout.id}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-200 mb-2">
                          {workout.name}
                        </h3>
                        <div className="space-y-1">
                          <div className="flex items-center text-slate-400">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">{formatDate(workout.date)}</span>
                          </div>
                          <div className="flex items-center text-slate-400">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="text-sm">{workout.exercises?.length || 0} exercises</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          workout.isCompleted 
                            ? 'bg-green-900 text-green-400 border border-green-800' 
                            : 'bg-orange-900 text-orange-400 border border-orange-800'
                        }`}>
                          {workout.isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                        <svg className="w-5 h-5 text-slate-500 group-hover:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
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
                      }

export default Dashboard;
