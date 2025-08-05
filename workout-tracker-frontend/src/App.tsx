import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import WorkoutDetails from './pages/Workouts/WorkoutDetails';
import ExerciseLibrary from './pages/Exercises/ExerciseLibrary';
import './App.css';
import CoachDashboard from './pages/Coach/CoachDashboard';
import UserWorkouts from './pages/Coach/UserWorkouts';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={token && user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={token && user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/exercises" element={<ProtectedRoute><ExerciseLibrary /></ProtectedRoute>} />
          <Route path="/user/:userId/workouts" element={<UserWorkouts />} />
          <Route path="/workouts/:id" element={
            <ProtectedRoute>
              <WorkoutDetails />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/coach" element={
              <ProtectedRoute>
                <CoachDashboard />
              </ProtectedRoute>
            } />

        </Routes>
        <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #475569'
              }
            }}
          />
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;