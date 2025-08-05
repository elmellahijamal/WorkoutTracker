import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchExercises } from '../../slices/exerciseSlice';
import { exerciseService } from '../../services/exerciseService';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';

interface CreateExerciseForm {
  name: string;
  description: string;
  muscleGroup: number;
}

interface EditExerciseForm {
  name: string;
  description: string;
  muscleGroup: number;
}

const ExerciseLibrary = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { exercises, isLoading } = useAppSelector(state => state.exercises);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingExercise, setDeletingExercise] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateExerciseForm>();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEdit, setValue } = useForm<EditExerciseForm>();

  useEffect(() => {
    dispatch(fetchExercises());
  }, [dispatch]);

  const muscleGroups = [
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

  const onSubmitExercise = async (data: CreateExerciseForm) => {
    try {
      const exerciseData = {
        ...data,
        muscleGroup: Number(data.muscleGroup)
      };
      
      await exerciseService.createExercise(exerciseData);
      setShowCreateForm(false);
      reset();
      dispatch(fetchExercises());
      toast.success('Exercise created successfully!');
    } catch (error) {
      console.error('Full error details:', error);
      toast.error('Failed to create exercise');
    }
  };

  const onEditExercise = async (data: EditExerciseForm) => {
    try {
      const exerciseData = {
        ...data,
        muscleGroup: Number(data.muscleGroup)
      };
      
      await exerciseService.updateExercise(editingExercise.id, exerciseData);
      setShowEditForm(false);
      setEditingExercise(null);
      resetEdit();
      dispatch(fetchExercises());
      toast.success('Exercise updated successfully!');
    } catch (error) {
      console.error('Full error details:', error);
      toast.error('Failed to update exercise');
    }
  };

  const handleEditClick = (exercise: any) => {
    setEditingExercise(exercise);
    setValue('name', exercise.name);
    setValue('description', exercise.description || '');
    setValue('muscleGroup', exercise.muscleGroup);
    setShowEditForm(true);
  };

  const handleDeleteClick = (exercise: any) => {
    setDeletingExercise(exercise);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingExercise) return;
    
    setIsDeleting(true);
    try {
      await exerciseService.deleteExercise(deletingExercise.id);
      setShowDeleteConfirm(false);
      setDeletingExercise(null);
      dispatch(fetchExercises());
      toast.success('Exercise deleted successfully!');
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error('Failed to delete exercise');
    } finally {
      setIsDeleting(false);
    }
  };

  const getMuscleGroupName = (value: number) => {
    const group = muscleGroups.find(g => g.value === value);
    return group ? group.name : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <Navbar 
        title="Exercise Library"
        subtitle="Browse available exercises"
        showBackButton={true}
        actions={
          user?.role === 'Coach' && (
            <button 
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Exercise
            </button>
          )
        }
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 mb-8">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-medium text-white">Create New Exercise</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmitExercise)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Exercise Name
                  </label>
                  <input
                    {...register('name', { required: 'Exercise name is required' })}
                    type="text"
                    placeholder="e.g., Bench Press"
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    placeholder="Brief description of the exercise (optional)"
                    rows={3}
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Muscle Group
                  </label>
                  <select 
                    {...register('muscleGroup', { 
                      required: 'Muscle group is required',
                      valueAsNumber: true
                    })}
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Muscle Group</option>
                    {muscleGroups.map(group => (
                      <option key={group.value} value={group.value}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  {errors.muscleGroup && <p className="mt-1 text-sm text-red-400">{errors.muscleGroup.message}</p>}
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
                    Create Exercise
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {showEditForm && editingExercise && (
          <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 mb-8">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-medium text-white">Edit Exercise</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmitEdit(onEditExercise)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Exercise Name
                  </label>
                  <input
                    {...registerEdit('name', { required: 'Exercise name is required' })}
                    type="text"
                    placeholder="e.g., Bench Press"
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errorsEdit.name && <p className="mt-1 text-sm text-red-400">{errorsEdit.name.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    {...registerEdit('description')}
                    placeholder="Brief description of the exercise (optional)"
                    rows={3}
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Muscle Group
                  </label>
                  <select 
                    {...registerEdit('muscleGroup', { 
                      required: 'Muscle group is required',
                      valueAsNumber: true
                    })}
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Muscle Group</option>
                    {muscleGroups.map(group => (
                      <option key={group.value} value={group.value}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  {errorsEdit.muscleGroup && <p className="mt-1 text-sm text-red-400">{errorsEdit.muscleGroup.message}</p>}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingExercise(null);
                      resetEdit();
                    }}
                    className="px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Update Exercise
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && deletingExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-white mb-4">Delete Exercise</h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete "{deletingExercise.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingExercise(null);
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
                    'Delete Exercise'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exercises Grid */}
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">
              Your Exercises ({exercises.length})
            </h2>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : exercises.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-300">No exercises yet</h3>
                <p className="mt-1 text-sm text-slate-500">Get started by creating your first exercise.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4 hover:bg-slate-650 hover:border-slate-500 transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{exercise.name}</h3>
                        <div className="flex items-center mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-400 border border-blue-800">
                            {getMuscleGroupName(exercise.muscleGroup)}
                          </span>
                        </div>
                        {exercise.description && (
                          <p className="text-sm text-slate-400 mt-2">{exercise.description}</p>
                        )}
                      </div>
                      
                      {/* Action buttons for coaches */}
                      {user?.role === 'Coach' && (
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEditClick(exercise)}
                            className="inline-flex items-center p-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                            title="Edit exercise"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(exercise)}
                            className="inline-flex items-center p-2 border border-red-600 text-sm font-medium rounded-lg text-red-400 bg-red-900/50 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                            title="Delete exercise"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
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

export default ExerciseLibrary;