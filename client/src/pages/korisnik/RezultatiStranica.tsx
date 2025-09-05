
import type { IUserQuizApiService } from "../../api_services/userQuiz/IUserQuizApiService";
import { RezultatiForma } from "../../components/korisnik/RezultatiForma";

interface RezultatiFormaProps {
  userQuizApi: IUserQuizApiService;
} 
export default function RezultatiStranica({userQuizApi} : RezultatiFormaProps) {
  return (
    <div>
      <RezultatiForma userQuizApi={userQuizApi} />
    </div>
  );
}
