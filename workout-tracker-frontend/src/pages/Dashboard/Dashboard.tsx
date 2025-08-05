import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import UserDashboard from './UserDashboard';
import CoachDashboardHome from './CoachDashboardHome';

const Dashboard = () => {
  const { user } = useAppSelector(state => state.auth);

  console.log("user?.role" ,user?.role)
  // Render different dashboards based on role
  if (user?.role === 'Coach') {
    console.log("coach")
    return <CoachDashboardHome />;
  }
  console.log("LocalStorage User:", localStorage.getItem('user'));

  console.log("normal user")
  return <UserDashboard />;
};

export default Dashboard;