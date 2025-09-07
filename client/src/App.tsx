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
import KvizStranica from './pages/korisnik/KvizStranica';
import UnaprediNivoKorisnikaStranica from './pages/moderator/UnaprediNivoKorisnikaStranica';
import RezultatiStranica from './pages/korisnik/RezultatiStranica';
import PrikaziNapredakStranica from './pages/korisnik/PrikaziNapredakStranica';
import { LanguageLevelAPIService } from './api_services/languageLevels/LanguageLevelApiService'
import { QuestionAPIService } from './api_services/questions/QuestionsApiService';
import { AnswerAPIService } from './api_services/answers/AnswerApiService';
import { UserQuizApiService } from './api_services/userQuiz/UserQuizApiService';
import NotFoundStranica from './pages/not_found/404Stranica';


function App() {
  return (
    <Routes>
      <Route path="/" element={<PocetnaStranica apiService={LanguageLevelAPIService} userQuizApiService={UserQuizApiService} />} />

      <Route path="/prijava" element={<PrijavaStranica authApi={authApi} />} />
      <Route path="/registracija" element={<RegistracijaStranica authApi={authApi} />} />
      <Route path="/404" element={<NotFoundStranica />} />
      <Route path="/prikazi-napredak/:username" element={<PrikaziNapredakStranica  userQuizApiService={UserQuizApiService}/>} />

      {/* Zaštićene rute */}
      <Route
        path="/korisnik-dashboard"
        element={
          <ProtectedRoute requiredRole="korisnik">
            <KorisnikStranica apiService={LanguageLevelAPIService} />
          </ProtectedRoute>
        }
      >
        <Route
          path="kreiraj-kviz"
          element={
            <KreirajKvizStranica
              languageLevelAPIService={LanguageLevelAPIService}
              questionAPIService={QuestionAPIService}
              answerAPIService={AnswerAPIService}
            />
          }
        />
        <Route
        path="kviz"
        element={
          <KvizStranica
            questionApiService={QuestionAPIService}
            answerApiService={AnswerAPIService}
            userQuizApi={UserQuizApiService}
          />
        }
      />
        <Route path="moji-rezultati" element={<RezultatiStranica userQuizApi={UserQuizApiService}  languageLevelAPIService={LanguageLevelAPIService}/>} />

      </Route>

      <Route
        path="/moderator-dashboard"
        element={
          <ProtectedRoute requiredRole="moderator">
            <ModeratorStranica />
          </ProtectedRoute>
        }
      >
        <Route path="dodaj-jezik" element={<DodajNoviJezikStranica languageLevelApi={LanguageLevelAPIService}/>} />
        <Route path="blokiraj-korisnika" element={<BlokirajKorisnikaStranica />} />
        <Route path="lista-blokiranih" element={<ListaBlokiranihStranica />} />
        <Route path="uredi-nivo" element={<UnaprediNivoKorisnikaStranica  userQuizApiService={UserQuizApiService} languageLevelAPIService={LanguageLevelAPIService}/>} />
      </Route>

      {/* Default preusmeravanje */}

      <Route path="/" element={<Navigate to="/prijava" replace />} />
      {/* Catch-all ruta za nepostojeće stranice */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
