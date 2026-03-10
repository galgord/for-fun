import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ActiveWorkout from './pages/ActiveWorkout';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Progress from './pages/Progress';
import { useTodayWorkout } from './lib/hooks';

// Initialize database (triggers populate on first load)
import './db';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [activeWorkoutId, setActiveWorkoutId] = useState(null);
  const todayWorkout = useTodayWorkout();

  const startWorkout = (workoutId) => {
    setActiveWorkoutId(workoutId);
    setPage('workout');
  };

  // When tapping Workout tab directly, use today's workout
  const workoutId = activeWorkoutId || todayWorkout?.id || null;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard onNavigate={setPage} onStartWorkout={startWorkout} />;
      case 'workout':
        return workoutId ? (
          <ActiveWorkout
            workoutId={workoutId}
            onBack={() => setPage('dashboard')}
          />
        ) : (
          <div style={{ paddingTop: 64, textAlign: 'center' }}>
            <p style={{ color: '#98989D', fontSize: 15 }}>No workout scheduled today.</p>
            <p style={{ color: '#636366', fontSize: 13, marginTop: 8 }}>Start a workout from the Dashboard or come back on a weekday.</p>
          </div>
        );
      case 'library':
        return <ExerciseLibrary />;
      case 'progress':
        return <Progress />;
      default:
        return <Dashboard onNavigate={setPage} onStartWorkout={startWorkout} />;
    }
  };

  return (
    <Layout activePage={page} onNavigate={setPage}>
      {renderPage()}
    </Layout>
  );
}
