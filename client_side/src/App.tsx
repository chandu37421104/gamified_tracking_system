import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Facultynavbar } from './components/Facultynavbar';
import { Pinavbar } from './components/Pinavbar';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Leaderboard } from './pages/Leaderboard';
import { Rewards } from './pages/Rewards';
import { Signin } from './pages/Signin';
import { ForgotPassword } from './pages/Forgotpassword';
import { Facultydashboard } from './pages/Facultydashboard';
import { Facultytask } from './pages/Facultytask';
import { Facultyrewards } from './pages/Facultyrewards';
import { Pitask } from './pages/Pitask';
import { Pirewards } from './pages/Pirewards';
import { Admindashboard } from './pages/Admindashboard';
import { Adminenroll } from "./pages/Adminenroll";
import { Pidashboard } from './pages/Pidashboard';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent: React.FC = () => {
  const location = useLocation();

  // Array of paths where no navbar should be shown
  const noNavbarPaths: string[] = ['/signin', '/forgotpassword', '/admindashbord'];

  // Arrays to determine which navbar to show
  const facultyNavPaths: string[] = [
    '/facultydashboard',
    '/facultytask',
    '/facultyrewards',
  ];

  const piNavPaths: string[] = ['/pidashboard', '/pitask', '/pirewards'];

  // Determine which navbar to render
  const shouldRenderFacultyNavbar = facultyNavPaths.includes(location.pathname);
  const shouldRenderPiNavbar = piNavPaths.includes(location.pathname);

  return (
    <>
      {/* Render appropriate Navbar */}
      {!noNavbarPaths.includes(location.pathname) && (
        shouldRenderFacultyNavbar ? (
          <Facultynavbar />
        ) : shouldRenderPiNavbar ? (
          <Pinavbar />
        ) : (
          <Navbar />
        )
      )}

      {/* Route Configurations */}
      <Routes>
        {/* Authentication Routes */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Student Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <Rewards />
            </ProtectedRoute>
          }
        />

        {/* Faculty Routes */}
        <Route
          path="/facultydashboard"
          element={
            <ProtectedRoute>
              <Facultydashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facultytask"
          element={
            <ProtectedRoute>
              <Facultytask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facultyrewards"
          element={
            <ProtectedRoute>
              <Facultyrewards />
            </ProtectedRoute>
          }
        />

        {/* PI Routes */}
        <Route
          path="/pidashboard"
          element={
            <ProtectedRoute>
              <Pidashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pitask"
          element={
            <ProtectedRoute>
              <Pitask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pirewards"
          element={
            <ProtectedRoute>
              <Pirewards />
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admindashbord"
          element={
            <ProtectedRoute>
              <Admindashboard />
            </ProtectedRoute>
          }
        />
        <Route
    path="/admin/enroll"
    element={
      <ProtectedRoute>
        <Adminenroll />
      </ProtectedRoute>
    }
  />
      </Routes>

    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
