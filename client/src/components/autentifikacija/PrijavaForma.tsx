import knjiga from '../../assets/knjiga.png';

function PrijavaForma() {
  return (
    <div className="min-h-screen bg-white">
      {/* Zaglavlje */}
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      {/* Glavni sadržaj ispod zaglavlja */}
      <div className="pt-[120px] flex justify-center mt-[60px]">
        <div className="bg-[#f3e5ff] shadow-md rounded-2xl p-10 w-full max-w-md border border-purple-400">
          <label className="block text-lg text-gray-800 mb-2">Korisnicko ime:</label>
          <input
            type="text"
            className="w-full px-4 bg-white  py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <label className="block text-lg text-gray-800 mb-2">Lozinka:</label>
          <input
            type="password"
            className="w-full px-4 bg-white  py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
          className="mt-[30px] w-[50%] h-[45px] bg-[#8f60bf] text-white text-[20px] hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition mx-auto block">
         Potvrdi
        </button>


        </div>
      </div>
    </div>
  );
}

export default PrijavaForma;
