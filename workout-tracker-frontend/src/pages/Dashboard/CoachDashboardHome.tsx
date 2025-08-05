import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import Navbar from '../../components/common/Navbar';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

interface CoachStats {
  totalAthletes: number;
  workoutsAssigned: number;
  completedThisWeek: number;
  totalExercises: number;
}

const CoachDashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const [athletes, setAthletes] = useState<User[]>([]);
  const [stats, setStats] = useState<CoachStats>({
    totalAthletes: 0,
    workoutsAssigned: 0,
    completedThisWeek: 0,
    totalExercises: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoachData();
  }, []);

  const loadCoachData = async () => {
    try {
      // Load athletes
      const athletesResponse = await api.get('/coach/users');
      setAthletes(athletesResponse.data);

      // Load exercises count
      const exercisesResponse = await api.get('/exercises');
      
      setStats({
        totalAthletes: athletesResponse.data.length,
        workoutsAssigned: Math.floor(Math.random() * 25) + 15, // Mock data
        completedThisWeek: Math.floor(Math.random() * 12) + 5,
        totalExercises: exercisesResponse.data.length
      });
    } catch (error) {
      console.error('Error loading coach data:', error);
      toast.error('Failed to load coach data');
    } finally {
      setLoading(false);
    }
  };

  const handleAthleteClick = (athleteId: number) => {
    navigate(`/user/${athleteId}/workouts`);
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
        title={`Coach ${user?.name} Dashboard 🏋️‍♂️`}
        subtitle="Manage your athletes and their fitness journey"
      />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Coach-Specific Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-900 text-blue-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-slate-400 text-sm font-medium">Total Athletes</p>
                <p className="text-white text-2xl font-bold">{stats.totalAthletes}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-900 text-orange-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-slate-400 text-sm font-medium">Exercise Library</p>
                <p className="text-white text-2xl font-bold">{stats.totalExercises}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Coach Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <button 
            onClick={() => navigate('/coach')}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-lg p-6 text-white transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-semibold">Assign Workouts</h3>
                <p className="text-blue-200 text-sm">Create and assign to athletes</p>
              </div>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>

          <button 
            onClick={() => navigate('/exercises')}
            className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 rounded-lg p-6 text-white transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-semibold">Manage Exercises</h3>
                <p className="text-green-200 text-sm">Add and edit exercises</p>
              </div>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </button>
        </div>

        {/* Athletes Management */}
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <div className="px-6 py-4 border-b border-slate-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Athlete Management</h2>
              <button 
                onClick={() => navigate('/coach')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
              >
                Assign Workouts
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
    
          <div className="p-6">
            {athletes.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-300">No athletes yet</h3>
                <p className="mt-1 text-sm text-slate-500">Athletes will appear here when they register.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {athletes.map((athlete) => (
                  <div 
                    key={athlete.id} 
                    className="bg-slate-700 border border-slate-600 rounded-lg p-4 hover:bg-slate-600 hover:border-slate-500 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleAthleteClick(athlete.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-900 rounded-full group-hover:bg-blue-800 transition-colors">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium group-hover:text-blue-100 transition-colors">{athlete.name}</h4>
                          <p className="text-slate-400 text-sm">@{athlete.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-slate-400 group-hover:text-slate-300">
                        <span className="text-xs mr-2">View workouts</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
};

export default CoachDashboardHome;