import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import Navbar from '../../components/common/Navbar';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import CreateAndAssignWorkout from './CreateAndAssignWorkout';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const CoachDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);

  // Redirect if not coach
  useEffect(() => {
    if (user && user.role !== 'Coach') {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  const loadUsers = async () => {
    try {
      const response = await api.get('/coach/users');
      setUsers(response.data.filter((u: User) => u.role === 'User')); // Only show regular users
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const assignWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !workoutName.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await api.post('/coach/assign-workout', {
        name: workoutName,
        date: workoutDate,
        userId: selectedUserId,
        coachId: user?.id
      });
      
      toast.success('Workout assigned successfully!');
      setShowAssignForm(false);
      setWorkoutName('');
      setSelectedUserId(null);
    } catch (error: any) {
      console.error('Error assigning workout:', error);
      toast.error(error.response?.data?.message || 'Failed to assign workout');
    }
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
        title="Coach Dashboard"
        subtitle="Manage users and assign workouts"
        showBackButton={true}
        actions={
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowAssignForm(true)}
              className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Quick Assign
            </button>
            <button 
              onClick={() => setShowCreateWorkout(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create & Assign Workout
            </button>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Quick Assign Modal (Old one - for empty workouts) */}
        {showAssignForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-white mb-4">Quick Assign Empty Workout</h3>
              <form onSubmit={assignWorkout} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">User</label>
                  <select 
                    value={selectedUserId || ''}
                    onChange={(e) => setSelectedUserId(Number(e.target.value))}
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Workout Name</label>
                  <input
                    type="text"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder="e.g., Upper Body Strength"
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={workoutDate}
                    onChange={(e) => setWorkoutDate(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowAssignForm(false)}
                    className="px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Assign Empty Workout
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Users ({users.length})</h2>
          </div>
          
          <div className="p-6">
            {users.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-300">No users found</h3>
                <p className="mt-1 text-sm text-slate-500">Users will appear here when they register.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {users.map((user) => (
                  <div key={user.id} className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{user.name}</h4>
                        <p className="text-slate-400">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setShowAssignForm(true);
                          }}
                          className="inline-flex items-center px-3 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-white transition duration-200"
                        >
                          Quick Assign
                        </button>
                        <button
                          onClick={() => setShowCreateWorkout(true)}
                          className="inline-flex items-center px-3 py-2 border border-blue-600 text-sm font-medium rounded-lg text-blue-400 bg-blue-900/50 hover:bg-blue-800 hover:text-white transition duration-200"
                        >
                          Create Workout
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* NEW: Create & Assign Workout Modal */}
      {showCreateWorkout && (
        <CreateAndAssignWorkout 
          onClose={() => setShowCreateWorkout(false)}
          onSuccess={() => {
            loadUsers(); // Refresh users data
          }}
        />
      )}
    </div>
  );
};

export default CoachDashboard;