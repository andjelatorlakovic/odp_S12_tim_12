import PocetnaStranica from './components/pocetnaStranica/PocetnaStranica';
import PrijavaForma from './components/autentifikacija/PrijavaForma';
import RegistracijaForma from './components/autentifikacija/RegistracijaForma';
import { useState } from 'react';

function App() {
  const [prikaziPrijavu, setPrikaziPrijavu] = useState(false);
  const [prikaziRegistraciju, setPrikaziRegistraciju] = useState(false);

  return (
    <>
      {prikaziPrijavu ? (
        <PrijavaForma />
      ) : prikaziRegistraciju ? (
        <RegistracijaForma />
      ) : (
        <PocetnaStranica
          onKlikPrijava={() => setPrikaziPrijavu(true)}
          onKlikRegistracija={() => setPrikaziRegistraciju(true)}
        />
      )}
    </>
  );
}

export default App;
