import { Routes, Route, Navigate } from 'react-router-dom';
import PocetnaStranica from './components/pocetnaStranica/PocetnaStranica';
import PrijavaStranica from './pages/auth/PrijavaStranica';
import RegistracijaStranica from './pages/auth/RegistracijaStranica';
import KorisnikStranica from './pages/korisnik/KorisnikStranica';
import ModeratorStranica from './pages/moderator/moderatorStranica';
import DodajNoviJezikStranica from './pages/moderator/DodajNoviJezikStranica';
import { authApi } from './api_services/auth/AuthAPIService';
import { ProtectedRoute } from './components/protected_route/ProtectedRoute';
import BlokirajKorisnikaStranica from './pages/moderator/BlokirajKorisnikaStranica';
import ListaBlokiranihStranica from './pages/moderator/ListaBlokiranihKorisnikaStranica';
import KreirajKvizStranica from './pages/korisnik/KreirajKvizStranica';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PocetnaStranica />} />

      <Route path="/prijava" element={<PrijavaStranica authApi={authApi} />} />
      <Route path="/registracija" element={<RegistracijaStranica authApi={authApi} />} />

      {/* Zaštićene rute */}
      <Route
        path="/korisnik-dashboard"
        element={
          <ProtectedRoute requiredRole="korisnik">
            <KorisnikStranica />
          </ProtectedRoute>
        }
        >
          <Route path="kreiraj-kviz" element={<KreirajKvizStranica />} />
       </Route>

      <Route
        path="/moderator-dashboard"
        element={
          <ProtectedRoute requiredRole="moderator">
            <ModeratorStranica />
          </ProtectedRoute>
        }
      >
        <Route path="dodaj-jezik" element={<DodajNoviJezikStranica />} />
        <Route path="blokiraj-korisnika" element={<BlokirajKorisnikaStranica />} /> 
         <Route path="lista-blokiranih" element={<ListaBlokiranihStranica />} /> 
      </Route>



      {/* Default preusmeravanje */}
      <Route path="*" element={<Navigate to="/prijava" replace />} />
    </Routes>
  );
}

export default App;
