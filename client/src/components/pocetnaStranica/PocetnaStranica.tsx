import { useNavigate } from 'react-router-dom';
import knjiga from '../../assets/knjiga.png';
import panda from '../../assets/panda.png';

function PocetnaStranica() {
  const navigate = useNavigate(); 

  return (
    <>
      {/* Zaglavlje */}
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      {/* Glavni sadržaj stranice */}
      <div className="pt-[150px] flex flex-col">
        <div className="flex w-screen h-screen">
          {/* Slika pande */}
          <div className="w-1/2 flex justify-center items-start mt-5">
            <img src={panda} alt="panda" className="w-[80%] h-auto" />
          </div>

          {/* Sekcija sa porukom i dugmadima */}
          <div className="w-1/2 flex flex-col items-center pt-[10px]">
            <h2 className="text-[60px] text-[#8f60bf] font-semibold">DOBRO DOŠLI!</h2>
            
            <button
              className="mt-[30px] w-[50%] h-[10%] bg-[#8f60bf] text-white text-[20px] hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
              onClick={() => navigate('/prijava')}
            >
              Prijava
            </button>
            <button
              className="mt-[30px] w-[50%] h-[10%] bg-[#8f60bf] text-white text-[20px] hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
              onClick={() => navigate('/registracija')}
            >
              Registracija
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PocetnaStranica;
