import { Routes, Route, Navigate } from 'react-router-dom';
import PocetnaStranica from './components/pocetnaStranica/PocetnaStranica';
import PrijavaStranica from './pages/auth/PrijavaStranica';
import RegistracijaStranica from './pages/auth/RegistracijaStranica';
import KorisnikStranica from './pages/korisnik/KorisnikStranica';
import ModeratorStranica from './pages/moderator/moderatorStranica';
import { authApi } from './api_services/auth/AuthAPIService';
import { ProtectedRoute } from './components/protected_route/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PocetnaStranica />} />

      <Route path="/prijava" element={<PrijavaStranica authApi={authApi} />} />
      <Route path="/registracija" element={<RegistracijaStranica authApi={authApi} />} />

      {/* Zaštićene rute */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute requiredRole="korisnik">
            <KorisnikStranica />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="moderator">
            <ModeratorStranica />
          </ProtectedRoute>
        }
      />

      {/* Default preusmeravanje */}
      <Route path="*" element={<Navigate to="/prijava" replace />} />
    </Routes>
  );
}

export default App;
