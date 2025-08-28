import { PrijavaForma } from "../../components/auth/PrijavaForma";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";

interface LoginPageProps {
  authApi: IAuthAPIService;
}

export default function PrijavaStranica({ authApi }: LoginPageProps) {

  return (
    <main className="bg-white flex items-center justify-center">
      <PrijavaForma authApi={authApi} />
    </main>
  );
}
