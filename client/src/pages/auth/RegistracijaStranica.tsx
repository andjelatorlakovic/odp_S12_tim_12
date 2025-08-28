

import { RegistracijaForma } from "../../components/auth/RegistracijaForma";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";


interface RegistracijaPageProps {
  authApi: IAuthAPIService;
}

export default function RegistracijaStranica({ authApi }: RegistracijaPageProps) {


  return (
    <main className="bg-white flex items-center justify-center">
      <RegistracijaForma authApi={authApi} />
    </main>
  );
}
