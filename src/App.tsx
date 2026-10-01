import type { ReactNode } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from './components/AppLayout';
import { BrandMark } from './components/ui';
import { AuthProvider, useAuth } from './lib/auth';
import { AccountScreen } from './screens/AccountScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { LoginScreen } from './screens/LoginScreen';
import { ReportScreen } from './screens/ReportScreen';
import { RouteSearchScreen } from './screens/RouteSearchScreen';
import { TerminalsScreen } from './screens/TerminalsScreen';
import { TricycleScreen } from './screens/TricycleScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';

function Splash() {
  return (
    <div className="splash" role="status" aria-label="Naglo-load">
      <BrandMark size={64} />
    </div>
  );
}

/** The app itself is open to guests and signed-in users; first launch goes to Welcome. */
function RequireEntry({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'loading') return <Splash />;
  if (status === 'signed_out') return <Navigate to="/welcome" replace />;
  return children;
}

/** Welcome and login are pointless once signed in. */
function PublicOnly({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'loading') return <Splash />;
  if (status === 'signed_in') return <Navigate to="/" replace />;
  return children;
}

// HashRouter: works on any static host and inside the Capacitor WebView
// without server rewrites, and keeps the Android back button working.
export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route
            path="/welcome"
            element={
              <PublicOnly>
                <WelcomeScreen />
              </PublicOnly>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnly>
                <LoginScreen />
              </PublicOnly>
            }
          />
          <Route
            element={
              <RequireEntry>
                <AppLayout />
              </RequireEntry>
            }
          >
            <Route index element={<DashboardScreen />} />
            <Route path="ruta" element={<RouteSearchScreen />} />
            <Route path="tricycle" element={<TricycleScreen />} />
            <Route path="terminals" element={<TerminalsScreen />} />
            <Route path="report" element={<ReportScreen />} />
            <Route path="account" element={<AccountScreen />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
